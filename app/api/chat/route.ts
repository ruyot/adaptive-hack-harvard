import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Check if API key is available
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY
    if (!apiKey) {
      console.error('Gemini API key not found in environment variables')
      console.error('Available env vars:', Object.keys(process.env).filter(key => key.includes('GEMINI')))
      return NextResponse.json(
        { 
          success: false, 
          error: 'API key not configured. Please check environment variables.' 
        },
        { status: 500 }
      )
    }

    console.log('API key found, length:', apiKey.length)
    console.log('API key starts with:', apiKey.substring(0, 10) + '...')

    const { message, context } = await request.json()

    // Build the system prompt with context
    const systemPrompt = `You are an AI coding assistant for a technical assessment platform called Adaptive.

Context:
${context ? `
- Problem Statement: ${context.problemStatement || 'Not provided'}
- Current File: ${context.activeFile || 'Not specified'}
- Available Files: ${context.availableFiles ? context.availableFiles.join(', ') : 'Not provided'}
- Current Code: ${context.currentCode || 'Not provided'}
` : ''}

Guidelines:
- Provide specific, actionable code suggestions
- Reference the problem requirements when relevant
- Suggest best practices for the given tech stack (TypeScript, React, Next.js)
- Help debug errors and explain solutions clearly
- Be concise but comprehensive in your responses
- Focus on helping the candidate solve the assessment challenge and go above and beyond.
- If asked about implementation details, provide working code examples by referencing existing code in the context.
- Always consider security, performance, and maintainability

User Message: ${message}`

    // Use direct REST API call like your example
    const payload = {
      contents: [
        {
          parts: [
            { text: systemPrompt },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 1024,
      }
    }

    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify(payload)
    }

    console.log('Sending request to Gemini API...')
    console.log('URL:', url)
    console.log('Payload:', JSON.stringify(payload, null, 2))
    
    const response = await fetch(url, options)
    
    console.log('Response status:', response.status)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))
    
    if (!response.ok) {
      const errorData = await response.text()
      console.error('Gemini API Error Response:', errorData)
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.error('Unexpected Gemini API response:', data)
      throw new Error('Invalid response from Gemini API')
    }

    const text = data.candidates[0].content.parts[0].text

    return NextResponse.json({ 
      success: true, 
      message: text 
    })

  } catch (error) {
    console.error('Gemini API Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get response from AI assistant' 
      },
      { status: 500 }
    )
  }
}

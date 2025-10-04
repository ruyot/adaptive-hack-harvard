import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

// Initialize Gemini AI with API key
function getGeminiAI() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not found in environment variables')
  }
  
  return new GoogleGenerativeAI(apiKey)
}

function getGeminiModel() {
  const genAI = getGeminiAI()
  return genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    generationConfig: {
      temperature: 0.7,
      topP: 0.8,
      topK: 40,
      maxOutputTokens: 1024,
    }
  })
}

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
- Focus on helping the candidate solve the assessment challenge
- If asked about implementation details, provide working code examples
- Always consider security, performance, and maintainability

User Message: ${message}`

    const model = getGeminiModel()
    const result = await model.generateContent(systemPrompt)
    const response = await result.response
    const text = response.text()

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

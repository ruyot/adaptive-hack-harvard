import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'GEMINI_API_KEY not found in environment variables',
        availableEnvVars: Object.keys(process.env).filter(key => key.includes('GEMINI') || key.includes('GOOGLE'))
      })
    }

    // Simple test payload
    const payload = {
      contents: [
        {
          parts: [
            { text: "Hello! Please respond with just 'API key is working!' to confirm the connection." },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 50,
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

    const response = await fetch(url, options)
    
    if (!response.ok) {
      const errorData = await response.text()
      return NextResponse.json({
        success: false,
        error: `Gemini API error: ${response.status} ${response.statusText}`,
        details: errorData
      })
    }

    const data = await response.json()
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      return NextResponse.json({
        success: false,
        error: 'Invalid response from Gemini API',
        response: data
      })
    }

    const text = data.candidates[0].content.parts[0].text

    return NextResponse.json({
      success: true,
      message: text,
      apiKeyLength: apiKey.length,
      apiKeyPrefix: apiKey.substring(0, 10) + '...'
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
  }
}

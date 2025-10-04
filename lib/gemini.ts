export interface ChatContext {
  problemStatement?: string
  activeFile?: string
  availableFiles?: string[]
  currentCode?: string
}

export async function sendToGemini(message: string, context: ChatContext = {}) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        context,
      }),
    })

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error || 'Failed to get response from AI assistant')
    }

    return data.message
  } catch (error) {
    console.error('Error calling Gemini API:', error)
    throw error
  }
}

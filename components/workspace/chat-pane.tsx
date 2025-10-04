"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Copy, Bot, User } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { sendToGemini, type ChatContext } from "@/lib/gemini"

interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
}

const systemMessage: Message = {
  id: "system",
  role: "system",
  content:
    "I'm your AI coding assistant! I can help you with the authentication challenge, explain code concepts, debug issues, and provide implementation guidance. Ask me anything about the problem or your code.",
}

export default function ChatPane() {
  const [messages, setMessages] = useState<Message[]>([systemMessage])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Create context for Gemini
      const context: ChatContext = {
        problemStatement: `# Build a User Authentication Feature

## Overview
Implement a user authentication system that allows users to sign up, log in, and manage their sessions.

## Requirements

### 1. Sign Up Flow
- Create a registration form with email and password fields
- Validate email format and password strength (min 8 characters)
- Store user credentials securely
- Show appropriate error messages for validation failures

### 2. Login Flow
- Create a login form with email and password fields
- Authenticate users against stored credentials
- Create a session token upon successful login
- Handle incorrect credentials gracefully

### 3. Session Management
- Implement session persistence using JWT tokens
- Add middleware to protect authenticated routes
- Provide a logout functionality that clears the session

## Technical Constraints
- Use the existing API endpoints in \`/src/api/auth\`
- Follow the authentication patterns in the repo docs
- Ensure all forms are accessible (ARIA labels, keyboard navigation)
- Write unit tests for authentication logic

## Evaluation Criteria
- Code quality and organization
- Proper error handling
- Security best practices
- Test coverage
- User experience considerations`,
        activeFile: "src/api/auth.ts",
        availableFiles: ["src/api/auth.ts", "src/components/auth-form.tsx", "src/pages/login.tsx"],
        currentCode: `export async function signup(email: string, password: string) {
  // TODO: Implement signup logic
  return { success: false, error: 'Not implemented' }
}

export async function login(email: string, password: string) {
  // TODO: Implement login logic
  return { success: false, error: 'Not implemented' }
}`
      }

      const response = await sendToGemini(input, context)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I'm having trouble connecting to the AI assistant right now. Please try again in a moment.",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  return (
    <div className="h-full flex flex-col bg-card">
      <div className="border-b border-brand-100 p-4 flex-shrink-0">
        <h2 className="text-sm font-semibold text-brand-900">AI Assistant</h2>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === "system" ? "bg-brand-100/30 -mx-4 px-4 py-3" : ""}`}
          >
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.role === "user" ? "bg-[#0077dd]" : "bg-secondary"
              }`}
            >
              {message.role === "user" ? (
                <User className={`w-4 h-4 ${message.role === "user" ? "text-white" : "text-secondary-foreground"}`} />
              ) : (
                <Bot className="w-4 h-4 text-secondary-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div
                className={`prose prose-sm max-w-none ${
                  message.role === "user" ? "bg-[#0077dd] text-white p-3 rounded-lg prose-p:text-white" : ""
                }`}
              >
                {message.role === "system" ? (
                  <p className="text-sm text-muted-foreground">{message.content}</p>
                ) : (
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                )}
              </div>
              {message.role === "assistant" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(message.content)}
                  className="mt-2 gap-2"
                >
                  <Copy className="w-3 h-3" />
                  Copy
                </Button>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
              <Bot className="w-4 h-4 text-secondary-foreground" />
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-brand-700 animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-2 h-2 rounded-full bg-brand-700 animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-2 h-2 rounded-full bg-brand-700 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-border p-4 flex-shrink-0">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about the docs or implementation... (Shift+Enter for new line)"
            className="min-h-[60px] max-h-[120px] resize-none"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isLoading}
            className="flex-shrink-0 bg-primary hover:bg-primary/90"
          >
            <Send className="w-4 h-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
        <p className="text-xs text-muted-foreground mt-2">
          Answers are grounded in the provided repository documentation.
        </p>
      </div>
    </div>
  )
}

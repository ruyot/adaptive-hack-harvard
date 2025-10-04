"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Copy, Bot, User } from "lucide-react"
import ReactMarkdown from "react-markdown"

interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
}

const systemMessage: Message = {
  id: "system",
  role: "system",
  content:
    "Tip: The internal docs have exact function signatures. Use the Repo Docs tab to find implementation details.",
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

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Based on the repository documentation, here's what I found:\n\nThe authentication API is located in \`/src/api/auth.ts\`. You'll need to implement the \`signup\` and \`login\` functions.\n\nFor the signup flow:\n1. Validate the email format\n2. Check password strength (minimum 8 characters)\n3. Hash the password using bcrypt\n4. Store the user in the database\n\nRefer to [Repo Docs → API → auth] for the exact function signatures.`,
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
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
                <ReactMarkdown>{message.content}</ReactMarkdown>
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

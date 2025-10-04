"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search, ChevronDown, ChevronUp } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { Button } from "@/components/ui/button"

const problemStatement = `# Build a User Authentication Feature

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
- User experience considerations
`

const mockDocs = [
  {
    id: "auth",
    title: "Authentication API",
    content: "# Authentication API\n\n## Overview\nThe authentication system uses JWT tokens...",
  },
  {
    id: "database",
    title: "Database Schema",
    content: "# Database Schema\n\n## Users Table\n- id: UUID\n- email: string\n- password_hash: string",
  },
  {
    id: "api",
    title: "API Reference",
    content: "# API Reference\n\n## Endpoints\n\n### POST /api/auth/signup\nCreate a new user account",
  },
]

export default function DocsPopup() {
  const [isMinimized, setIsMinimized] = useState(false)
  const [activeTab, setActiveTab] = useState("problem")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDoc, setSelectedDoc] = useState(mockDocs[0])

  const filteredDocs = mockDocs.filter((doc) => doc.title.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div
      className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 transition-all duration-300 ${
        isMinimized ? "h-14" : "h-[400px]"
      } z-10`}
      style={{
        width: 'calc(70% - 2rem)', // Covers more of the middle section
        maxWidth: '900px',
        minWidth: '500px'
      }}
    >
      <div
        className="h-full rounded-lg border border-border/50 shadow-2xl flex flex-col overflow-hidden"
        style={{
          background: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        {/* Header with minimize button */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/30 bg-white/40 flex-shrink-0">
          <h2 className="text-sm font-semibold text-brand-900">Brief & Docs</h2>
          <Button variant="ghost" size="sm" onClick={() => setIsMinimized(!isMinimized)} className="h-8 w-8 p-0">
            {isMinimized ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>

        {/* Content - only shown when not minimized */}
        {!isMinimized && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="w-full rounded-none border-b border-border/30 bg-white/40 px-4 flex-shrink-0">
              <TabsTrigger value="problem" className="data-[state=active]:bg-[#0077dd] data-[state=active]:text-white">
                Problem
              </TabsTrigger>
              <TabsTrigger value="docs" className="data-[state=active]:bg-[#0077dd] data-[state=active]:text-white">
                Repo Docs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="problem" className="flex-1 overflow-auto p-6 m-0">
              <div className="prose prose-sm max-w-none prose-headings:text-brand-900 prose-p:text-foreground prose-li:text-foreground">
                <ReactMarkdown>{problemStatement}</ReactMarkdown>
              </div>
            </TabsContent>

            <TabsContent value="docs" className="flex-1 overflow-hidden m-0 flex flex-col">
              <div className="p-4 border-b border-border/30 flex-shrink-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search docs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-white/60"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-auto">
                <div className="grid grid-cols-1 divide-y divide-border/30">
                  {filteredDocs.map((doc) => (
                    <button
                      key={doc.id}
                      onClick={() => setSelectedDoc(doc)}
                      className={`p-4 text-left hover:bg-white/60 transition-colors ${
                        selectedDoc.id === doc.id ? "bg-white/60" : ""
                      }`}
                    >
                      <div className="font-medium text-sm text-foreground">{doc.title}</div>
                    </button>
                  ))}
                </div>

                {selectedDoc && (
                  <div className="p-6 border-t border-border/30">
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown>{selectedDoc.content}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}

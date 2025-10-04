"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import dynamic from "next/dynamic"
import FileTree from "./file-tree"
import { Button } from "@/components/ui/button"
import { Play, Circle, X } from "lucide-react"

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false })

const mockFiles = {
  "src/api/auth.ts": `export async function signup(email: string, password: string) {
  // TODO: Implement signup logic
  return { success: false, error: 'Not implemented' }
}

export async function login(email: string, password: string) {
  // TODO: Implement login logic
  return { success: false, error: 'Not implemented' }
}`,
  "src/components/auth-form.tsx": `export default function AuthForm() {
  return (
    <div>
      {/* TODO: Build authentication form */}
    </div>
  )
}`,
  "src/pages/login.tsx": `export default function LoginPage() {
  return <div>Login Page</div>
}`,
}

type TestStatus = "idle" | "running" | "passed" | "failed"

export default function EditorPane() {
  const [openTabs, setOpenTabs] = useState<string[]>(["src/api/auth.ts"])
  const [activeTab, setActiveTab] = useState<string>("src/api/auth.ts")
  const [code, setCode] = useState(mockFiles["src/api/auth.ts"])
  const [testStatus, setTestStatus] = useState<TestStatus>("idle")

  useEffect(() => {
    const savedTabs = localStorage.getItem("adaptive_open_tabs")
    const savedActive = localStorage.getItem("adaptive_active_tab")

    if (savedTabs) {
      const tabs = JSON.parse(savedTabs)
      setOpenTabs(tabs)
    }

    if (savedActive && mockFiles[savedActive as keyof typeof mockFiles]) {
      setActiveTab(savedActive)
      setCode(mockFiles[savedActive as keyof typeof mockFiles])
    }
  }, [])

  const handleFileSelect = (path: string) => {
    if (!openTabs.includes(path)) {
      const newTabs = [...openTabs, path]
      setOpenTabs(newTabs)
      localStorage.setItem("adaptive_open_tabs", JSON.stringify(newTabs))
    }
    setActiveTab(path)
    setCode(mockFiles[path as keyof typeof mockFiles] || "")
    localStorage.setItem("adaptive_active_tab", path)
  }

  const handleCloseTab = (path: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const newTabs = openTabs.filter((tab) => tab !== path)
    setOpenTabs(newTabs)
    localStorage.setItem("adaptive_open_tabs", JSON.stringify(newTabs))

    if (activeTab === path && newTabs.length > 0) {
      const newActive = newTabs[newTabs.length - 1]
      setActiveTab(newActive)
      setCode(mockFiles[newActive as keyof typeof mockFiles] || "")
      localStorage.setItem("adaptive_active_tab", newActive)
    }
  }

  const handleTabClick = (path: string) => {
    setActiveTab(path)
    setCode(mockFiles[path as keyof typeof mockFiles] || "")
    localStorage.setItem("adaptive_active_tab", path)
  }

  const handleRunTests = () => {
    setTestStatus("running")
    setTimeout(() => {
      setTestStatus(Math.random() > 0.5 ? "passed" : "failed")
    }, 2000)
  }

  const getStatusColor = () => {
    switch (testStatus) {
      case "running":
        return "text-yellow-500"
      case "passed":
        return "text-green-500"
      case "failed":
        return "text-red-500"
      default:
        return "text-muted-foreground"
    }
  }

  const getStatusText = () => {
    switch (testStatus) {
      case "running":
        return "Running"
      case "passed":
        return "Passed"
      case "failed":
        return "Failed"
      default:
        return "Idle"
    }
  }

  const getFileName = (path: string) => {
    return path.split("/").pop() || path
  }

  return (
    <div className="h-full flex flex-col bg-card">
      <div className="border-b border-brand-100 p-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold text-brand-900">Files & Editor</h2>
          <div className="flex items-center gap-2 text-xs">
            <Circle className={`w-2 h-2 fill-current ${getStatusColor()}`} />
            <span className="text-muted-foreground">{getStatusText()}</span>
          </div>
        </div>
        <Button size="sm" variant="outline" onClick={handleRunTests} className="gap-2 bg-transparent">
          <Play className="w-3 h-3" />
          Run Tests
        </Button>
      </div>

      <div className="flex-1 overflow-hidden">
        <PanelGroup direction="horizontal">
          <Panel defaultSize={30} minSize={20} maxSize={50}>
            <FileTree files={Object.keys(mockFiles)} selectedFile={activeTab} onFileSelect={handleFileSelect} />
          </Panel>

          <PanelResizeHandle className="w-1 bg-border hover:bg-brand-700/50 transition-colors" />

          <Panel minSize={50}>
            <div className="h-full flex flex-col">
              <div className="flex items-center border-b border-border overflow-x-auto flex-shrink-0">
                {openTabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => handleTabClick(tab)}
                    className={`
                      group flex items-center gap-2 px-4 py-2 text-sm font-mono border-r border-border
                      transition-colors hover:bg-surface-50 flex-shrink-0
                      ${activeTab === tab ? "text-white" : "bg-surface-50/50 text-muted-foreground"}
                    `}
                    style={activeTab === tab ? { backgroundColor: "#0077dd" } : {}}
                  >
                    <span className="max-w-[150px] truncate">{getFileName(tab)}</span>
                    <div
                      onClick={(e) => handleCloseTab(tab, e)}
                      className="opacity-0 group-hover:opacity-100 hover:bg-white/20 rounded p-0.5 transition-opacity cursor-pointer"
                      aria-label={`Close ${tab}`}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          handleCloseTab(tab, e as any)
                        }
                      }}
                    >
                      <X className="w-3 h-3" />
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex-1">
                <MonacoEditor
                  height="100%"
                  language="typescript"
                  value={code}
                  onChange={(value) => setCode(value || "")}
                  theme="vs-light"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: "on",
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                  }}
                />
              </div>
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  )
}

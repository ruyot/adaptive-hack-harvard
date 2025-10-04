"use client"

import { useState, useEffect } from "react"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import DocsPane from "./docs-pane"
import EditorPane from "./editor-pane"
import ChatPane from "./chat-pane"
import PreviewWindow from "./preview-window"
import { useMobile } from "@/hooks/use-mobile"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface WorkspacePanelsProps {
  showPreview: boolean
  onHidePreview: () => void
}

export default function WorkspacePanels({ showPreview, onHidePreview }: WorkspacePanelsProps) {
  const isMobile = useMobile()
  const [leftSize, setLeftSize] = useState(25)
  const [rightSize, setRightSize] = useState(25)

  useEffect(() => {
    const savedLeft = localStorage.getItem("adaptive_left_panel_size")
    const savedRight = localStorage.getItem("adaptive_right_panel_size")
    if (savedLeft) setLeftSize(Number(savedLeft))
    if (savedRight) setRightSize(Number(savedRight))
  }, [])

  const handleLeftResize = (size: number) => {
    setLeftSize(size)
    localStorage.setItem("adaptive_left_panel_size", String(size))
  }

  const handleRightResize = (size: number) => {
    setRightSize(size)
    localStorage.setItem("adaptive_right_panel_size", String(size))
  }

  if (showPreview) {
    return <PreviewWindow onBack={onHidePreview} />
  }

  if (isMobile) {
    return (
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="editor" className="h-full flex flex-col">
          <TabsList className="w-full rounded-none border-b border-border bg-card">
            <TabsTrigger value="brief" className="flex-1">
              Brief
            </TabsTrigger>
            <TabsTrigger value="editor" className="flex-1">
              Editor
            </TabsTrigger>
            <TabsTrigger value="assistant" className="flex-1">
              Assistant
            </TabsTrigger>
          </TabsList>
          <TabsContent value="brief" className="flex-1 m-0 overflow-hidden">
            <DocsPane />
          </TabsContent>
          <TabsContent value="editor" className="flex-1 m-0 overflow-hidden">
            <EditorPane />
          </TabsContent>
          <TabsContent value="assistant" className="flex-1 m-0 overflow-hidden">
            <ChatPane />
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-hidden">
      <PanelGroup direction="horizontal">
        <Panel defaultSize={leftSize} minSize={20} maxSize={40} onResize={handleLeftResize}>
          <DocsPane />
        </Panel>

        <PanelResizeHandle className="w-1 bg-border hover:bg-brand-700/50 transition-colors" />

        <Panel minSize={30}>
          <EditorPane />
        </Panel>

        <PanelResizeHandle className="w-1 bg-border hover:bg-brand-700/50 transition-colors" />

        <Panel defaultSize={rightSize} minSize={20} maxSize={40} onResize={handleRightResize}>
          <ChatPane />
        </Panel>
      </PanelGroup>
    </div>
  )
}

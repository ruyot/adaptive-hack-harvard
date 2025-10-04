"use client"

import { Button } from "@/components/ui/button"
import { Play, Eye } from "lucide-react"

interface WorkspaceHeaderProps {
  onSubmit: () => void
  onShowPreview: () => void
}

export default function WorkspaceHeader({ onSubmit, onShowPreview }: WorkspaceHeaderProps) {
  const handleRunTests = () => {
    // Mock test run
    console.log("[v0] Running tests...")
  }

  return (
    <header
      className="h-14 border-b border-border flex items-center justify-between px-4 flex-shrink-0"
      style={{ backgroundColor: "#1c1c84" }}
    >
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-bold text-white">Adaptive</h1>
      </div>

      <div className="flex items-center gap-2">
        <div className="px-3 py-1.5 rounded-full bg-white/10 text-sm text-white">Step 3 of 4</div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onShowPreview}
          className="gap-2 bg-white/10 text-white border-white/20 hover:bg-white/20"
        >
          <Eye className="w-4 h-4" />
          Show Preview
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRunTests}
          className="gap-2 bg-white/10 text-white border-white/20 hover:bg-white/20"
        >
          <Play className="w-4 h-4" />
          Run All Tests
        </Button>
        <Button size="sm" onClick={onSubmit} className="bg-white text-[#1c1c84] hover:bg-white/90">
          Submit Assessment
        </Button>
      </div>
    </header>
  )
}

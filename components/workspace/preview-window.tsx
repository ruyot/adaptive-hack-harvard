"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface PreviewWindowProps {
  onBack: () => void
}

export default function PreviewWindow({ onBack }: PreviewWindowProps) {
  return (
    <div className="h-full w-full flex flex-col bg-background">
      <div className="border-b border-border p-4 flex items-center gap-4 flex-shrink-0">
        <Button variant="outline" size="sm" onClick={onBack} className="gap-2 bg-transparent">
          <ArrowLeft className="w-4 h-4" />
          Back to Editor
        </Button>
        <h2 className="text-sm font-semibold text-brand-900">Preview</h2>
      </div>

      <div className="flex-1 flex items-center justify-center bg-surface-50">
        <div className="text-center space-y-2">
          <div className="text-6xl text-brand-700/20">👁️</div>
          <p className="text-muted-foreground">Preview window</p>
          <p className="text-sm text-muted-foreground">Your application preview will appear here</p>
        </div>
      </div>
    </div>
  )
}

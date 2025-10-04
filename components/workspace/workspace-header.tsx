"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Play, Eye, Clock } from "lucide-react"

interface WorkspaceHeaderProps {
  onSubmit: () => void
  onManualSubmit?: () => void
  onShowPreview: () => void
}

export default function WorkspaceHeader({ onSubmit, onManualSubmit, onShowPreview }: WorkspaceHeaderProps) {
  const [timeLeft, setTimeLeft] = useState(60 * 60) // 60 minutes in seconds
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    // Check if timer was already started
    const startTime = localStorage.getItem("adaptive_timer_start")
    if (!startTime) {
      // Start the timer
      localStorage.setItem("adaptive_timer_start", Date.now().toString())
      setTimeLeft(60 * 60)
    } else {
      // Calculate remaining time
      const elapsed = Math.floor((Date.now() - parseInt(startTime)) / 1000)
      const remaining = Math.max(0, 60 * 60 - elapsed)
      setTimeLeft(remaining)
      
      if (remaining === 0) {
        setIsExpired(true)
        // Use setTimeout to defer the auto-submit call
        setTimeout(() => onSubmit(), 0)
      }
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsExpired(true)
          // Use setTimeout to defer the auto-submit call
          setTimeout(() => onSubmit(), 0)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [onSubmit])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

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
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-mono ${
          timeLeft < 300 ? 'bg-red-500/20 text-red-300 border border-red-400/30' : 'bg-white/10 text-white'
        }`}>
          <Clock className="w-4 h-4" />
          {isExpired ? '00:00' : formatTime(timeLeft)}
        </div>
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
        <Button size="sm" onClick={onManualSubmit || onSubmit} className="bg-white text-[#1c1c84] hover:bg-white/90">
          Submit Assessment
        </Button>
      </div>
    </header>
  )
}

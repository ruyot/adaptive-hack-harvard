"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import WorkspaceHeader from "@/components/workspace/workspace-header"
import WorkspacePanels from "@/components/workspace/workspace-panels"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function AssessmentPage() {
  const router = useRouter()
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [isAutoSubmit, setIsAutoSubmit] = useState(false)

  const handleSubmit = () => {
    setShowSubmitDialog(true)
  }

  const handleAutoSubmit = () => {
    setIsAutoSubmit(true)
    localStorage.setItem("adaptive_completed", "true")
    router.push("/thanks")
  }

  const confirmSubmit = () => {
    localStorage.setItem("adaptive_completed", "true")
    router.push("/thanks")
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <WorkspaceHeader 
        onSubmit={handleAutoSubmit} 
        onManualSubmit={handleSubmit}
        onShowPreview={() => setShowPreview(true)} 
      />
      <WorkspacePanels showPreview={showPreview} onHidePreview={() => setShowPreview(false)} />

      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Assessment?</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit and end your session? You won't be able to make changes after submitting.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmSubmit} className="bg-primary hover:bg-primary/90">
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

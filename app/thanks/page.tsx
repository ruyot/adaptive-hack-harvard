"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"

export default function ThanksPage() {
  const handleClose = () => {
    window.close()
  }

  const handleHome = () => {
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl text-center">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 text-sm text-secondary-foreground mb-6">
            Step 4 of 4
          </div>

          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-brand-700/10 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-brand-700" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-brand-900 mb-4 text-balance">Thanks for completing the assessment!</h1>
        </div>

        <div className="bg-card rounded-xl border border-border p-8 shadow-sm mb-8">
          <p className="text-lg text-foreground/80 mb-6 leading-relaxed">Your results are being processed.</p>

          <div className="space-y-4 text-foreground/70 leading-relaxed">
            <p>
              We'll review your submission and get back to you within 2-3 business days. You'll receive an email with
              detailed feedback and next steps.
            </p>
            <p>
              Thank you for taking the time to complete this assessment. We appreciate your effort and look forward to
              reviewing your work.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={handleClose} size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Close Window
          </Button>
          <Button onClick={handleHome} size="lg" variant="outline">
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}

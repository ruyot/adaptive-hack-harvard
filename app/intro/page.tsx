"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export default function IntroPage() {
  const router = useRouter()

  const handleStart = () => {
    router.push("/assessment")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 text-sm text-secondary-foreground mb-4">
            Step 2 of 4
          </div>
          <h1 className="text-4xl font-bold text-brand-900 mb-2">Assessment Overview</h1>
        </div>

        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Left Column */}
            <div className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-border">
              <h2 className="text-2xl font-bold text-brand-900 mb-6">What to expect</h2>

              <div className="space-y-6 text-foreground/80 leading-relaxed">
                <p>
                  You'll be working on a real-world coding challenge that tests your ability to build features on top of
                  an existing codebase.
                </p>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-700 mt-2" />
                    <div>
                      <strong className="text-foreground">Estimated time:</strong> 60-90 minutes
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-700 mt-2" />
                    <div>
                      <strong className="text-foreground">Open-book:</strong> Use internal docs and AI assistant
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-700 mt-2" />
                    <div>
                      <strong className="text-foreground">Scoring:</strong> Based on code quality, completeness, and
                      test results
                    </div>
                  </div>
                </div>

                <p className="text-sm">
                  You'll ship a small feature on top of an existing backend. Internal docs and the AI assistant are your
                  best friends.
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="p-8 md:p-12 bg-surface-50/50">
              <h2 className="text-2xl font-bold text-brand-900 mb-6">Before you start</h2>

              <div className="space-y-4 mb-8">
                {[
                  "Ensure you have a stable internet connection",
                  "Find a quiet environment to focus",
                  "Read the problem statement carefully",
                  "Explore the repository documentation",
                  "Use the AI assistant when you need help",
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-700 flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-foreground/80 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>

              <Button
                onClick={handleStart}
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Start Assessment
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

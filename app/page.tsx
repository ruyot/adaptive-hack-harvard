"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function EmailGate() {
  const [email, setEmail] = useState("")
  const [isValid, setIsValid] = useState(false)
  const router = useRouter()

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    setIsValid(emailRegex.test(value))
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    validateEmail(value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isValid) {
      localStorage.setItem("adaptive_email", email)
      router.push("/intro")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-xl border border-border p-8 shadow-sm">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-brand-900 mb-2">Adaptive</h1>
            <p className="text-foreground/80 text-balance">
              A modern technical assessment platform designed for developers.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={handleEmailChange}
                required
                className="w-full"
                aria-describedby="email-description"
              />
              <p id="email-description" className="text-xs text-muted-foreground">
                We'll use this to save your session.
              </p>
            </div>

            <Button
              type="submit"
              disabled={!isValid}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Next
            </Button>
          </form>

          <footer className="mt-8 pt-6 border-t border-border">
            <div className="flex gap-4 text-xs text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy Policy
              </a>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}

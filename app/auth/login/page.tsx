"use client"

import type React from "react"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, ArrowLeft, Lock } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [resetMode, setResetMode] = useState(false)
  const [resetMessage, setResetMessage] = useState("")

  const supabase = createClient()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
      } else {
        window.location.href = "/"
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setResetMessage("")

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        setError(error.message)
      } else {
        setResetMessage("Password reset email sent! Check your inbox.")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Job Board
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{resetMode ? "Reset Password" : "Welcome Back"}</CardTitle>
            <CardDescription>
              {resetMode
                ? "Enter your email to receive a password reset link"
                : "Sign in to your account to access exclusive features"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={resetMode ? handleResetPassword : handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {!resetMode && (
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              )}

              {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}
              {resetMessage && <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">{resetMessage}</div>}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (resetMode ? "Sending..." : "Signing in...") : resetMode ? "Send Reset Email" : "Sign In"}
              </Button>
            </form>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setResetMode(!resetMode)
                  setError("")
                  setResetMessage("")
                }}
                className="text-sm text-primary hover:underline"
              >
                {resetMode ? "Back to Sign In" : "Forgot your password?"}
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                New to our platform?{" "}
                <Link href="/auth/sign-up" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

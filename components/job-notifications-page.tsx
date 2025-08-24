"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Mail, CheckCircle, AlertCircle } from "lucide-react"

export function JobNotificationsPage() {
  const [email, setEmail] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [frequency, setFrequency] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const categories = [
    { id: "climate", label: "Climate", color: "bg-green-100 text-green-800" },
    { id: "weather", label: "Weather", color: "bg-blue-100 text-blue-800" },
    { id: "energy", label: "Energy", color: "bg-yellow-100 text-yellow-800" },
    { id: "academia", label: "Academia", color: "bg-purple-100 text-purple-800" },
    { id: "geospatial", label: "Geospatial", color: "bg-indigo-100 text-indigo-800" },
    { id: "insurance", label: "Insurance/Reinsurance", color: "bg-orange-100 text-orange-800" },
  ]

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || selectedCategories.length === 0 || !frequency) return

    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const response = await fetch("/api/newsletter-subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          categories: selectedCategories,
          frequency,
        }),
      })

      if (response.ok) {
        setSubmitStatus("success")
        setEmail("")
        setSelectedCategories([])
        setFrequency("")
      } else {
        setSubmitStatus("error")
      }
    } catch (error) {
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div
        className="relative h-64 bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center"
        style={{
          backgroundImage: "url('/sky-clouds.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-primary/40"></div>
        <div className="relative z-10 text-center text-white">
          <Bell className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-2">Job Notifications</h1>
          <p className="text-xl opacity-90">Stay updated with the latest opportunities</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Subscribe to Job Alerts
              </CardTitle>
              <CardDescription>
                Get notified when new jobs are posted in your areas of interest. We'll send you personalized job alerts
                based on your selected categories.
              </CardDescription>
              <p className="text-sm text-muted-foreground mt-2">
                your email is only used for job notifications and can be unsubscribed at any time.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="frequency">Notification Frequency</Label>
                  <Select value={frequency} onValueChange={setFrequency} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select how often you'd like to receive notifications" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily - Get notified every day</SelectItem>
                      <SelectItem value="weekly">Weekly - Get notified once a week</SelectItem>
                      <SelectItem value="monthly">Monthly - Get notified once a month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Select Industries</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => toggleCategory(category.id)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          selectedCategories.includes(category.id)
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <Badge
                          variant="secondary"
                          className={`${category.color} ${
                            selectedCategories.includes(category.id) ? "ring-2 ring-primary" : ""
                          }`}
                        >
                          {category.label}
                        </Badge>
                      </button>
                    ))}
                  </div>
                  {selectedCategories.length === 0 && (
                    <p className="text-sm text-muted-foreground">Please select at least one industry</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || !email || selectedCategories.length === 0 || !frequency}
                >
                  {isSubmitting ? "Subscribing..." : "Subscribe to Job Alerts"}
                </Button>

                {submitStatus === "success" && (
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
                    <CheckCircle className="h-4 w-4" />
                    <span>Successfully subscribed! You'll receive job alerts for your selected categories.</span>
                  </div>
                )}

                {submitStatus === "error" && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                    <AlertCircle className="h-4 w-4" />
                    <span>Something went wrong. Please try again.</span>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Privacy Notice */}
          <Card className="mt-6">
            <CardContent className="pt-6">
              <div className="text-center text-sm text-muted-foreground">
                <p className="mb-2">🔒 we do not keep your data :)</p>
                <p>your email is only used for job notifications and can be unsubscribed at any time.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

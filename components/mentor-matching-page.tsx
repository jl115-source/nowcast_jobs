"use client"

import type React from "react"

import { Users, UserPlus, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

export function MentorMatchingPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    signupType: "",
    industry: "",
    experience: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.signupType || !formData.industry) return

    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      console.log("[v0] Mentor form data being sent:", formData)

      const response = await fetch("/api/mentor-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          role_type: formData.signupType, // Map signupType to role_type for database
          bio: formData.experience, // Map experience to bio for database
        }),
      })

      console.log("[v0] Mentor API response status:", response.status)

      if (response.ok) {
        const result = await response.json()
        console.log("[v0] Mentor API success result:", result)
        setSubmitStatus("success")
        setFormData({
          name: "",
          email: "",
          signupType: "",
          industry: "",
          experience: "",
        })
      } else {
        const errorText = await response.text()
        console.log("[v0] Mentor API error response:", errorText)
        setSubmitStatus("error")
      }
    } catch (error) {
      console.log("[v0] Mentor API fetch error:", error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative text-center mb-12 rounded-2xl overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90"
          style={{
            backgroundImage: `url('/sky-clouds.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-primary/40"></div>
        <div className="relative z-10 py-16 px-8 text-white">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Users className="h-7 w-7" />
            </div>
            <h1 className="text-5xl font-bold">Mentor Matching</h1>
          </div>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Whether you're seeking guidance or sharing expertise, mentorship can be a transformative experience that
            shapes careers and advances the fields of climate, weather, energy, and geospatial science
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card className="border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <UserPlus className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-2xl">Join the List</CardTitle>
            </div>
            <CardDescription>
              Sign up to be notified when mentor matching a good match is found! Choose whether you'd like to be a
              mentor or find a mentor.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-type">I want to be a...</Label>
                  <Select
                    value={formData.signupType}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, signupType: value }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mentor">Mentor - Share my expertise</SelectItem>
                      <SelectItem value="mentee">Mentee - Find a mentor</SelectItem>
                      <SelectItem value="both">Both - Mentor and be mentored</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Primary Industry</Label>
                  <Select
                    value={formData.industry}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, industry: value }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="academia">Academia & Research</SelectItem>
                      <SelectItem value="banking">Banking & Finance</SelectItem>
                      <SelectItem value="climate">Climate Science</SelectItem>
                      <SelectItem value="energy">Energy & Renewables</SelectItem>
                      <SelectItem value="geospatial">Geospatial & GIS</SelectItem>
                      <SelectItem value="geophysics">Geophysics & Geology</SelectItem>
                      <SelectItem value="insurance">Insurance & Reinsurance</SelectItem>
                      <SelectItem value="tech">Tech (Data Science & ML)</SelectItem>
                      <SelectItem value="weather">Weather & Meteorology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Experience & Goals</Label>
                <Textarea
                  id="experience"
                  placeholder="Tell us about your experience and what you hope to achieve through mentorship..."
                  className="min-h-[100px]"
                  value={formData.experience}
                  onChange={(e) => setFormData((prev) => ({ ...prev, experience: e.target.value }))}
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={
                  isSubmitting || !formData.name || !formData.email || !formData.signupType || !formData.industry
                }
              >
                <UserPlus className="mr-2 h-4 w-4" />
                {isSubmitting ? "Joining..." : "Join the List"}
              </Button>

              {submitStatus === "success" && (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
                  <CheckCircle className="h-4 w-4" />
                  <span>Successfully joined the list! We'll notify you when a good match is found.</span>
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
      </div>
    </div>
  )
}

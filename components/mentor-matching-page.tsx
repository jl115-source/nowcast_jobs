"use client"

import type React from "react"

import { Users, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

export function MentorMatchingPage() {
  const [signupType, setSignupType] = useState<string>("")
  const [industry, setIndustry] = useState<string>("")

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle signup logic here
    console.log("Signup submitted")
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
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Connect with experienced professionals in climate, weather, energy, academia, and geospatial fields
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
              <CardTitle className="text-2xl">Join the Waitlist</CardTitle>
            </div>
            <CardDescription>
              Sign up to be notified when mentor matching becomes available. Choose whether you'd like to be a mentor or
              find a mentor.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Enter your full name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="Enter your email" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-type">I want to be a...</Label>
                  <Select value={signupType} onValueChange={setSignupType} required>
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
                  <Select value={industry} onValueChange={setIndustry} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="climate">Climate Science</SelectItem>
                      <SelectItem value="weather">Weather & Meteorology</SelectItem>
                      <SelectItem value="energy">Energy & Renewables</SelectItem>
                      <SelectItem value="academia">Academia & Research</SelectItem>
                      <SelectItem value="geospatial">Geospatial & GIS</SelectItem>
                      <SelectItem value="insurance">Insurance & Reinsurance</SelectItem>
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
                />
              </div>

              <Button type="submit" size="lg" className="w-full">
                <UserPlus className="mr-2 h-4 w-4" />
                Join Waitlist
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

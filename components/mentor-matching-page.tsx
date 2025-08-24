"use client"

import type React from "react"

import { Users, Clock, Star, MessageCircle, Calendar, Target, Wrench, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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

      <div className="max-w-4xl mx-auto">
        <Card className="mb-8 border-primary/20">
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

        <Card className="border-2 border-dashed border-primary/30 bg-primary/5">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Wrench className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Feature In Development</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              We're building an intelligent mentor-mentee matching system to connect you with industry experts. This
              feature will be available soon!
            </p>
            <Badge variant="secondary" className="text-sm px-4 py-2">
              Coming Soon
            </Badge>
          </CardContent>
        </Card>

        <div className="mt-12 space-y-8">
          <div className="text-center">
            <h3 className="text-2xl font-semibold mb-4">What to Expect</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our mentor matching platform will connect you with experienced professionals who can guide your career in
              specialized fields.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-lg">Smart Matching</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  AI-powered matching based on your career goals, experience level, and industry interests in climate,
                  energy, and geospatial fields.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-lg">Direct Communication</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Secure messaging system to connect with mentors, schedule calls, and track your mentorship progress
                  over time.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Star className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-lg">Expert Network</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Access to verified professionals from leading organizations in climate science, renewable energy,
                  meteorology, and academia.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle className="text-lg">Flexible Scheduling</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Integrated calendar system for easy scheduling of mentorship sessions, with options for video calls,
                  phone calls, or in-person meetings.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <CardTitle className="text-lg">Progress Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Track your mentorship goals, milestones, and career development progress with built-in analytics and
                  reporting tools.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                </div>
                <CardTitle className="text-lg">Community Access</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Join exclusive mentorship groups, participate in industry discussions, and access networking events
                  for continuous learning.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Card className="bg-muted/30">
              <CardContent className="p-8">
                <h4 className="text-xl font-semibold mb-4">Get Notified When It's Ready</h4>
                <p className="text-muted-foreground mb-6">
                  Be the first to know when our mentor matching platform launches. We'll send you an exclusive early
                  access invitation.
                </p>
                <Button size="lg" disabled>
                  <Clock className="mr-2 h-4 w-4" />
                  Notify Me When Available
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EyeOff, Shield, UserCheck, Mail, Briefcase, Users, Search, LogIn, CheckCircle } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"

export function OffMarketJobsPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createBrowserClient()

  const [activeTab, setActiveTab] = useState<"talent" | "recruiter">("talent")

  const [talentFormData, setTalentFormData] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
    skills: "",
    industries: [] as string[],
    currentRole: "",
    location: "",
    availability: "",
  })

  const [recruiterFormData, setRecruiterFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    website: "",
    specializations: [] as string[],
    experience: "",
    clientTypes: "",
    description: "",
  })

  const [isTalentSubmitted, setIsTalentSubmitted] = useState(false)
  const [isRecruiterSubmitted, setIsRecruiterSubmitted] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      if (user?.email) {
        setTalentFormData((prev) => ({ ...prev, email: user.email }))
        setRecruiterFormData((prev) => ({ ...prev, email: user.email }))
      }
      setLoading(false)
    }
    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      if (session?.user?.email) {
        setTalentFormData((prev) => ({ ...prev, email: session.user.email }))
        setRecruiterFormData((prev) => ({ ...prev, email: session.user.email }))
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const industries = [
    "Academia & Research",
    "Banking & Finance",
    "Climate Science",
    "Energy & Renewables",
    "Geospatial & GIS",
    "Geophysics & Geology",
    "Insurance & Reinsurance",
    "Post-doc",
    "Professor",
    "Tech (Data Science & ML)",
    "Trading (Commodities, weather, energy)",
    "Weather & Meteorology",
  ]

  const handleTalentIndustryToggle = (industry: string) => {
    setTalentFormData((prev) => ({
      ...prev,
      industries: prev.industries.includes(industry)
        ? prev.industries.filter((i) => i !== industry)
        : [...prev.industries, industry],
    }))
  }

  const handleRecruiterSpecializationToggle = (specialization: string) => {
    setRecruiterFormData((prev) => ({
      ...prev,
      specializations: prev.specializations.includes(specialization)
        ? prev.specializations.filter((s) => s !== specialization)
        : [...prev.specializations, specialization],
    }))
  }

  const handleTalentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/off-market-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "talent",
          ...talentFormData,
        }),
      })

      if (response.ok) {
        console.log("Off-market talent signup saved to database")
        setIsTalentSubmitted(true)
      } else {
        console.error("Failed to save talent signup")
      }
    } catch (error) {
      console.error("Error submitting talent form:", error)
    }
  }

  const handleRecruiterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/off-market-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "recruiter",
          ...recruiterFormData,
        }),
      })

      if (response.ok) {
        console.log("Recruiter signup saved to database")
        setIsRecruiterSubmitted(true)
      } else {
        console.error("Failed to save recruiter signup")
      }
    } catch (error) {
      console.error("Error submitting recruiter form:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="relative h-64 bg-gradient-to-r from-primary/90 to-accent/90 overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/sky-clouds.png')" }} />
          <div className="absolute inset-0 bg-primary/40"></div>
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="text-center text-white">
              <EyeOff className="h-16 w-16 mx-auto mb-4" />
              <h1 className="text-4xl font-bold mb-2">Off-Market Jobs</h1>
              <p className="text-xl opacity-90">Exclusive opportunities not advertised publicly</p>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto p-6">
          <Card>
            <CardHeader className="text-center">
              <LogIn className="h-12 w-12 mx-auto mb-4 text-primary" />
              <CardTitle className="text-2xl">Login Required</CardTitle>
              <CardDescription>
                You need to be logged in to access our exclusive off-market job network. This helps us verify your
                identity and provide personalized opportunities.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">Once logged in, you'll be able to:</p>
              <ul className="text-left space-y-2 mb-6 max-w-md mx-auto">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Access exclusive hidden job opportunities</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Connect with vetted recruiters in your field</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Manage your off-market job preferences</span>
                </li>
              </ul>
              <p className="text-sm text-muted-foreground">
                Please use the login button in the bottom left corner to sign in or create an account.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (isTalentSubmitted || isRecruiterSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="relative h-64 bg-gradient-to-r from-primary/90 to-accent/90 overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/sky-clouds.png')" }} />
          <div className="absolute inset-0 bg-primary/40"></div>
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="text-center text-white">
              <EyeOff className="h-16 w-16 mx-auto mb-4" />
              <h1 className="text-4xl font-bold mb-2">Thank You!</h1>
              <p className="text-xl opacity-90">We've received your application</p>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto p-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-primary">Application Submitted</CardTitle>
              <CardDescription>
                {isTalentSubmitted
                  ? "Your profile has been added to our exclusive talent network. We'll be in touch soon with relevant opportunities."
                  : "Your recruiter application has been received. We'll review your credentials and contact you within 48 hours."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Privacy Protected</p>
                  <p className="text-sm text-muted-foreground">
                    Your information is secure and only shared with verified parties
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <UserCheck className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">{isTalentSubmitted ? "Vetted Recruiters Only" : "Verification Process"}</p>
                  <p className="text-sm text-muted-foreground">
                    {isTalentSubmitted
                      ? "We only work with verified recruiters in your target industries"
                      : "All recruiters go through our verification process before accessing talent"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative h-64 bg-gradient-to-r from-primary/90 to-accent/90 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/sky-clouds.png')" }} />
        <div className="absolute inset-0 bg-primary/40"></div>
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white">
            <EyeOff className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-2">Off-Market Jobs</h1>
            <p className="text-xl opacity-90">Exclusive opportunities not advertised publicly</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="flex justify-center">
          <div className="flex bg-muted rounded-lg p-1">
            <Button
              variant={activeTab === "talent" ? "default" : "ghost"}
              onClick={() => setActiveTab("talent")}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              For Talent
            </Button>
            <Button
              variant={activeTab === "recruiter" ? "default" : "ghost"}
              onClick={() => setActiveTab("recruiter")}
              className="flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              For Recruiters
            </Button>
          </div>
        </div>

        {activeTab === "talent" ? (
          <>
            {/* Info Section */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Hidden Opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Some high-paying roles are never publicly advertised, with recruiters tasked by companies to quietly
                    seek the right talent. We make it easier to connect those opportunities directly to you.{" "}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Your Privacy Matters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <UserCheck className="h-4 w-4 mt-1 text-primary" />
                      <div>
                        <p className="font-medium">Vetted Recruiters Only</p>
                        <p className="text-sm text-muted-foreground">
                          Only verified recruiters with matching profiles can contact you
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="h-4 w-4 mt-1 text-primary" />
                      <div>
                        <p className="font-medium">Easy Removal</p>
                        <p className="text-sm text-muted-foreground">
                          Circumstances change—we'll unsubscribe you anytime you choose.{" "}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Talent Signup Form */}
            <Card>
              <CardHeader>
                <CardTitle>Sign Up as Talent</CardTitle>
                <CardDescription>
                  Join our exclusive network and get access to hidden opportunities in your field
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTalentSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={talentFormData.name}
                        onChange={(e) => setTalentFormData((prev) => ({ ...prev, name: e.target.value }))}
                        required
                        className="bg-primary/10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={talentFormData.email}
                        onChange={(e) => setTalentFormData((prev) => ({ ...prev, email: e.target.value }))}
                        disabled={!!user?.email}
                        required
                        className="bg-primary/10"
                      />
                      {user?.email && <p className="text-sm text-muted-foreground">Using your account email</p>}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={talentFormData.phone}
                        onChange={(e) => setTalentFormData((prev) => ({ ...prev, phone: e.target.value }))}
                        className="bg-primary/10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        placeholder="City, Country"
                        value={talentFormData.location}
                        onChange={(e) => setTalentFormData((prev) => ({ ...prev, location: e.target.value }))}
                        className="bg-primary/10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currentRole">Current Role</Label>
                    <Input
                      id="currentRole"
                      placeholder="e.g., Senior Software Engineer, Climate Researcher"
                      value={talentFormData.currentRole}
                      onChange={(e) => setTalentFormData((prev) => ({ ...prev, currentRole: e.target.value }))}
                      className="bg-primary/10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">Years of Experience *</Label>
                    <Input
                      id="experience"
                      placeholder="e.g., 5 years"
                      value={talentFormData.experience}
                      onChange={(e) => setTalentFormData((prev) => ({ ...prev, experience: e.target.value }))}
                      required
                      className="bg-primary/10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Industries of Interest *</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {industries.map((industry) => (
                        <Button
                          key={industry}
                          type="button"
                          variant={talentFormData.industries.includes(industry) ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleTalentIndustryToggle(industry)}
                          className="text-xs"
                        >
                          {industry}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skills">Key Skills *</Label>
                    <Textarea
                      id="skills"
                      placeholder="List your key skills, technologies, or areas of expertise..."
                      value={talentFormData.skills}
                      onChange={(e) => setTalentFormData((prev) => ({ ...prev, skills: e.target.value }))}
                      required
                      className="bg-primary/10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="availability">Availability</Label>
                    <Input
                      id="availability"
                      placeholder="e.g., Immediately, 2 weeks notice, 1 month"
                      value={talentFormData.availability}
                      onChange={(e) => setTalentFormData((prev) => ({ ...prev, availability: e.target.value }))}
                      className="bg-primary/10"
                    />
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      🔒 <strong>Privacy Notice:</strong> Your information is only used for job matching and is never
                      sold or shared publicly. Only vetted recruiters with relevant opportunities can contact you. You
                      can request removal at any time.
                    </p>
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    Join Exclusive Talent Network
                  </Button>
                </form>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            {/* Recruiter Info Section */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Find Specialized Talent
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Access professionals who may not be on LinkedIn, actively looking, or responsive to typical
                    outreach. We help you reach talent in niche fields with expertise-based vetting to determine if
                    they'll be a good fit for your role.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5" />
                    Expert Vetting & Time Savings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Shield className="h-4 w-4 mt-1 text-primary" />
                      <div>
                        <p className="font-medium">Field Expertise Vetting</p>
                        <p className="text-sm text-muted-foreground">
                          We use domain expertise to actually vet whether talent will be a good fit for your specific
                          role
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users className="h-4 w-4 mt-1 text-primary" />
                      <div>
                        <p className="font-medium">Save Time, Money & Effort</p>
                        <p className="text-sm text-muted-foreground">
                          Guided by experts to reduce time wasted and connect directly with vetted talent that may not
                          be on common networking apps
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recruiter Signup Form */}
            <Card>
              <CardHeader>
                <CardTitle>Join as a Recruiter</CardTitle>
                <CardDescription>Apply to access our exclusive talent network for specialized roles</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRecruiterSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="recruiter-name">Full Name *</Label>
                      <Input
                        id="recruiter-name"
                        value={recruiterFormData.name}
                        onChange={(e) => setRecruiterFormData((prev) => ({ ...prev, name: e.target.value }))}
                        required
                        className="bg-primary/10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="recruiter-email">Email Address *</Label>
                      <Input
                        id="recruiter-email"
                        type="email"
                        value={recruiterFormData.email}
                        onChange={(e) => setRecruiterFormData((prev) => ({ ...prev, email: e.target.value }))}
                        disabled={!!user?.email}
                        required
                        className="bg-primary/10"
                      />
                      {user?.email && <p className="text-sm text-muted-foreground">Using your account email</p>}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company">Company/Agency *</Label>
                      <Input
                        id="company"
                        value={recruiterFormData.company}
                        onChange={(e) => setRecruiterFormData((prev) => ({ ...prev, company: e.target.value }))}
                        required
                        className="bg-primary/10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="recruiter-phone">Phone Number</Label>
                      <Input
                        id="recruiter-phone"
                        value={recruiterFormData.phone}
                        onChange={(e) => setRecruiterFormData((prev) => ({ ...prev, phone: e.target.value }))}
                        className="bg-primary/10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Company Website</Label>
                    <Input
                      id="website"
                      placeholder="https://yourcompany.com"
                      value={recruiterFormData.website}
                      onChange={(e) => setRecruiterFormData((prev) => ({ ...prev, website: e.target.value }))}
                      className="bg-primary/10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recruiter-experience">Years in Recruitment *</Label>
                    <Input
                      id="recruiter-experience"
                      placeholder="e.g., 3 years"
                      value={recruiterFormData.experience}
                      onChange={(e) => setRecruiterFormData((prev) => ({ ...prev, experience: e.target.value }))}
                      required
                      className="bg-primary/10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Specialization Areas *</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {industries.map((specialization) => (
                        <Button
                          key={specialization}
                          type="button"
                          variant={recruiterFormData.specializations.includes(specialization) ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleRecruiterSpecializationToggle(specialization)}
                          className="text-xs"
                        >
                          {specialization}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="clientTypes">Typical Client Types</Label>
                    <Input
                      id="clientTypes"
                      placeholder="e.g., Startups, Fortune 500, Research Institutions"
                      value={recruiterFormData.clientTypes}
                      onChange={(e) => setRecruiterFormData((prev) => ({ ...prev, clientTypes: e.target.value }))}
                      className="bg-primary/10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">About Your Recruitment Practice *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your experience, approach, and what makes you successful in specialized recruitment..."
                      value={recruiterFormData.description}
                      onChange={(e) => setRecruiterFormData((prev) => ({ ...prev, description: e.target.value }))}
                      required
                      className="bg-primary/10"
                    />
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      🔒 <strong>Verification Process:</strong> All recruiter applications are reviewed manually. We
                      verify company credentials and recruitment experience before granting access to our talent
                      network. This process typically takes 24-48 hours.
                    </p>
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    Apply for Recruiter Access
                  </Button>
                </form>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}

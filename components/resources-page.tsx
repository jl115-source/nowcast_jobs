"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp, ExternalLink, BookOpen, Award, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface ResourceItem {
  name: string
  provider?: string
  institution?: string
  description: string
  link: string
}

interface IndustryResources {
  certifications: ResourceItem[]
  education: ResourceItem[]
  links: ResourceItem[]
}

interface ResourcesData {
  resources: Record<string, IndustryResources>
}

export function ResourcesPage() {
  const [resourcesData, setResourcesData] = useState<ResourcesData | null>(null)
  const [loading, setLoading] = useState(true)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})
  const [showNavigation, setShowNavigation] = useState(false)

  useEffect(() => {
    const loadResources = async () => {
      try {
        const response = await fetch("/data/resources.json")
        const data = await response.json()
        setResourcesData(data)
      } catch (error) {
        console.error("Failed to load resources:", error)
      } finally {
        setLoading(false)
      }
    }
    loadResources()
  }, [])

  const toggleSection = (sectionKey: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }))
  }

  const scrollToIndustry = (industry: string) => {
    const element = document.getElementById(`industry-${industry.replace(/\s+/g, "-").toLowerCase()}`)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
      setShowNavigation(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading resources...</p>
        </div>
      </div>
    )
  }

  if (!resourcesData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Failed to load resources</p>
        </div>
      </div>
    )
  }

  const industries = Object.keys(resourcesData.resources).sort()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative h-48 bg-gradient-to-r from-primary/20 to-accent/20 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/sky-clouds.png')" }} />
        <div className="absolute inset-0 bg-primary/60"></div>
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="text-center w-full">
            <h1 className="text-4xl font-bold text-white mb-2">Professional Resources</h1>
            <p className="text-xl text-white/90">Certifications By Industry</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          <div className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Menu className="h-5 w-5" />
                    Quick Navigation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {industries.map((industry) => (
                    <Button
                      key={industry}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-left h-auto py-2 px-3"
                      onClick={() => scrollToIndustry(industry)}
                    >
                      <span className="text-sm leading-tight">{industry}</span>
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="lg:hidden fixed top-20 right-4 z-50">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowNavigation(!showNavigation)}
              className="bg-background shadow-lg"
            >
              <Menu className="h-4 w-4" />
            </Button>

            {showNavigation && (
              <Card className="absolute top-12 right-0 w-64 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-sm">Jump to Industry</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 max-h-64 overflow-y-auto">
                  {industries.map((industry) => (
                    <Button
                      key={industry}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-left h-auto py-2 px-3"
                      onClick={() => scrollToIndustry(industry)}
                    >
                      <span className="text-xs leading-tight">{industry}</span>
                    </Button>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {Object.entries(resourcesData.resources).map(([industry, resources]) => (
              <Card
                key={industry}
                className="overflow-hidden"
                id={`industry-${industry.replace(/\s+/g, "-").toLowerCase()}`}
              >
                <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
                  <CardTitle className="text-xl">{industry}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  {/* Certifications */}
                  <Collapsible
                    open={openSections[`${industry}-cert`]}
                    onOpenChange={() => toggleSection(`${industry}-cert`)}
                  >
                    <CollapsibleTrigger asChild>
                      <Button variant="outline" className="w-full justify-between bg-transparent">
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4" />
                          Certifications ({resources.certifications.length})
                        </div>
                        {openSections[`${industry}-cert`] ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-3 space-y-3">
                      {resources.certifications.map((cert, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium">{cert.name}</h4>
                              {cert.provider && <p className="text-sm text-muted-foreground">{cert.provider}</p>}
                              <p className="text-sm mt-1">{cert.description}</p>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                              <a href={cert.link} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

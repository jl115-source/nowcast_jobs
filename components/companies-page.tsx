"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, MapPin, Users, ExternalLink, Search, ZoomIn, ZoomOut, Move } from "lucide-react"

// Company data organized by industry
const companiesData = {
  climate: [
    {
      name: "Climate Solutions Inc",
      location: "San Francisco, CA",
      coordinates: { x: 120, y: 180 },
      employees: "500-1000",
      description: "Leading climate technology solutions",
      website: "https://climatesolutions.com",
      jobs: 12,
    },
    {
      name: "Carbon Capture Co",
      location: "Austin, TX",
      coordinates: { x: 280, y: 220 },
      employees: "100-500",
      description: "Direct air capture technology",
      website: "https://carboncapture.com",
      jobs: 8,
    },
    {
      name: "Green Future Labs",
      location: "Boston, MA",
      coordinates: { x: 380, y: 160 },
      employees: "50-100",
      description: "Climate research and development",
      website: "https://greenfuture.com",
      jobs: 5,
    },
  ],
  weather: [
    {
      name: "WeatherTech Systems",
      location: "Denver, CO",
      coordinates: { x: 240, y: 200 },
      employees: "200-500",
      description: "Advanced weather forecasting",
      website: "https://weathertech.com",
      jobs: 15,
    },
    {
      name: "Storm Analytics",
      location: "Miami, FL",
      coordinates: { x: 350, y: 280 },
      employees: "100-200",
      description: "Hurricane and storm prediction",
      website: "https://stormanalytics.com",
      jobs: 7,
    },
  ],
  energy: [
    {
      name: "Renewable Power Corp",
      location: "Phoenix, AZ",
      coordinates: { x: 180, y: 240 },
      employees: "1000+",
      description: "Solar and wind energy solutions",
      website: "https://renewablepower.com",
      jobs: 25,
    },
    {
      name: "Grid Innovations",
      location: "Seattle, WA",
      coordinates: { x: 80, y: 120 },
      employees: "500-1000",
      description: "Smart grid technology",
      website: "https://gridinnovations.com",
      jobs: 18,
    },
    {
      name: "Energy Storage Solutions",
      location: "Atlanta, GA",
      coordinates: { x: 340, y: 240 },
      employees: "200-500",
      description: "Battery and storage systems",
      website: "https://energystorage.com",
      jobs: 11,
    },
  ],
  academia: [
    {
      name: "Climate Research Institute",
      location: "Cambridge, MA",
      coordinates: { x: 390, y: 150 },
      employees: "100-200",
      description: "University climate research",
      website: "https://climateresearch.edu",
      jobs: 6,
    },
    {
      name: "Environmental Studies Center",
      location: "Berkeley, CA",
      coordinates: { x: 100, y: 190 },
      employees: "50-100",
      description: "Environmental science research",
      website: "https://envstudies.edu",
      jobs: 4,
    },
  ],
  geospatial: [
    {
      name: "GeoMapping Technologies",
      location: "Washington, DC",
      coordinates: { x: 370, y: 200 },
      employees: "300-500",
      description: "Satellite and mapping solutions",
      website: "https://geomapping.com",
      jobs: 14,
    },
    {
      name: "Spatial Analytics Corp",
      location: "Portland, OR",
      coordinates: { x: 60, y: 140 },
      employees: "100-300",
      description: "GIS and spatial data analysis",
      website: "https://spatialanalytics.com",
      jobs: 9,
    },
  ],
  insurance: [
    {
      name: "Climate Risk Insurance",
      location: "New York, NY",
      coordinates: { x: 380, y: 170 },
      employees: "1000+",
      description: "Climate risk assessment and insurance",
      website: "https://climaterisk.com",
      jobs: 22,
    },
    {
      name: "Weather Insurance Group",
      location: "Chicago, IL",
      coordinates: { x: 300, y: 180 },
      employees: "500-1000",
      description: "Weather-related insurance products",
      website: "https://weatherinsurance.com",
      jobs: 16,
    },
  ],
}

const industryColors = {
  climate: "#10b981",
  weather: "#3b82f6",
  energy: "#f59e0b",
  academia: "#8b5cf6",
  geospatial: "#ef4444",
  insurance: "#06b6d4",
}

export function CompaniesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"list" | "map">("list")
  const [selectedCompany, setSelectedCompany] = useState<any>(null)
  const [mapTransform, setMapTransform] = useState({ x: 0, y: 0, scale: 1 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const mapRef = useRef<HTMLDivElement>(null)

  // Get all companies
  const allCompanies = Object.entries(companiesData).flatMap(([industry, companies]) =>
    companies.map((company) => ({ ...company, industry })),
  )

  // Filter companies
  const filteredCompanies = allCompanies.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesIndustry = selectedIndustries.length === 0 || selectedIndustries.includes(company.industry)
    return matchesSearch && matchesIndustry
  })

  const toggleIndustry = (industry: string) => {
    setSelectedIndustries((prev) =>
      prev.includes(industry) ? prev.filter((i) => i !== industry) : [...prev, industry],
    )
  }

  const handleMapMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - mapTransform.x, y: e.clientY - mapTransform.y })
  }

  const handleMapMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    setMapTransform((prev) => ({
      ...prev,
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    }))
  }

  const handleMapMouseUp = () => {
    setIsDragging(false)
  }

  const handleZoom = (direction: "in" | "out") => {
    setMapTransform((prev) => ({
      ...prev,
      scale: direction === "in" ? Math.min(prev.scale * 1.2, 3) : Math.max(prev.scale / 1.2, 0.5),
    }))
  }

  const resetMap = () => {
    setMapTransform({ x: 0, y: 0, scale: 1 })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative h-48 bg-gradient-to-r from-primary/20 to-accent/20 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/sky-clouds.png')" }} />
        <div className="absolute inset-0 bg-primary/40"></div>
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="text-center w-full">
            <h1 className="text-4xl font-bold text-white mb-2">Discover top companies in your field</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                onClick={() => setViewMode("list")}
                size="sm"
              >
                List View
              </Button>
              <Button variant={viewMode === "map" ? "default" : "outline"} onClick={() => setViewMode("map")} size="sm">
                Map View
              </Button>
            </div>
          </div>

          {/* Industry Filters */}
          <div className="flex flex-wrap gap-2">
            {Object.keys(companiesData).map((industry) => (
              <Button
                key={industry}
                variant={selectedIndustries.includes(industry) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleIndustry(industry)}
                className="capitalize"
              >
                {industry}
              </Button>
            ))}
            {selectedIndustries.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setSelectedIndustries([])}>
                Clear All
              </Button>
            )}
          </div>
        </div>

        {viewMode === "list" ? (
          /* List View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">{company.name}</CardTitle>
                    </div>
                    <Badge
                      variant="secondary"
                      style={{
                        backgroundColor: `${industryColors[company.industry as keyof typeof industryColors]}20`,
                        color: industryColors[company.industry as keyof typeof industryColors],
                      }}
                    >
                      {company.industry}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {company.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {company.employees} employees
                  </div>
                  <p className="text-sm">{company.description}</p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm font-medium text-primary">{company.jobs} open positions</span>
                    <Button variant="outline" size="sm" asChild>
                      <a href={company.website} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Visit
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Map View */
          <div className="relative">
            <div className="mb-4 flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleZoom("in")}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleZoom("out")}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={resetMap}>
                <Move className="h-4 w-4" />
                Reset
              </Button>
            </div>

            <div
              ref={mapRef}
              className="relative w-full h-96 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden cursor-move border"
              onMouseDown={handleMapMouseDown}
              onMouseMove={handleMapMouseMove}
              onMouseUp={handleMapMouseUp}
              onMouseLeave={handleMapMouseUp}
            >
              {/* US Map Background */}
              <div
                className="absolute inset-0"
                style={{
                  transform: `translate(${mapTransform.x}px, ${mapTransform.y}px) scale(${mapTransform.scale})`,
                  transformOrigin: "center center",
                }}
              >
                {/* Simple US outline */}
                <svg viewBox="0 0 500 300" className="w-full h-full opacity-20" fill="currentColor">
                  <path d="M50 150 Q100 100 200 120 Q300 110 450 130 Q480 150 470 200 Q400 250 300 240 Q200 250 100 230 Q50 200 50 150 Z" />
                </svg>

                {/* Company Markers */}
                {filteredCompanies.map((company, index) => (
                  <div
                    key={index}
                    className="absolute w-4 h-4 rounded-full cursor-pointer transform -translate-x-2 -translate-y-2 hover:scale-125 transition-transform"
                    style={{
                      left: company.coordinates.x,
                      top: company.coordinates.y,
                      backgroundColor: industryColors[company.industry as keyof typeof industryColors],
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedCompany(company)
                    }}
                    title={company.name}
                  />
                ))}
              </div>

              {/* Company Info Popup */}
              {selectedCompany && (
                <div className="absolute top-4 right-4 bg-background border rounded-lg p-4 shadow-lg max-w-xs z-10">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold">{selectedCompany.name}</h3>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedCompany(null)} className="h-6 w-6 p-0">
                      ×
                    </Button>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      {selectedCompany.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-3 w-3" />
                      {selectedCompany.employees}
                    </div>
                    <p className="text-muted-foreground">{selectedCompany.description}</p>
                    <div className="flex items-center justify-between pt-2">
                      <Badge variant="secondary">{selectedCompany.industry}</Badge>
                      <span className="text-primary font-medium">{selectedCompany.jobs} jobs</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Map Legend */}
            <div className="mt-4 flex flex-wrap gap-4">
              {Object.entries(industryColors).map(([industry, color]) => (
                <div key={industry} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-sm capitalize">{industry}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {filteredCompanies.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No companies found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, MapPin, Users, ExternalLink, Search } from "lucide-react"

const companiesData = {
  academia: [
    {
      name: "Climate Research Institute",
      location: "Cambridge, MA",
      coordinates: { x: 390, y: 150 },
      employees: "100-200",
      description: "University climate research",
      website: "https://climateresearch.edu",
      jobs: 6,
      categories: ["academia", "climate"],
    },
    {
      name: "Environmental Studies Center",
      location: "Berkeley, CA",
      coordinates: { x: 100, y: 190 },
      employees: "50-100",
      description: "Environmental science research",
      website: "https://envstudies.edu",
      jobs: 4,
      categories: ["academia", "climate"],
    },
  ],
  banking: [
    {
      name: "Green Finance Corp",
      location: "New York, NY",
      coordinates: { x: 380, y: 170 },
      employees: "1000+",
      description: "Sustainable finance and green bonds",
      website: "https://greenfinance.com",
      jobs: 20,
      categories: ["banking", "climate"],
    },
    {
      name: "Climate Investment Bank",
      location: "London, UK",
      coordinates: { x: 450, y: 120 },
      employees: "500-1000",
      description: "Climate-focused investment banking",
      website: "https://climateinvestment.com",
      jobs: 15,
      categories: ["banking", "energy"],
    },
  ],
  climate: [
    {
      name: "Climate Solutions Inc",
      location: "San Francisco, CA",
      coordinates: { x: 120, y: 180 },
      employees: "500-1000",
      description: "Leading climate technology solutions",
      website: "https://climatesolutions.com",
      jobs: 12,
      categories: ["climate", "tech"],
    },
    {
      name: "Carbon Capture Co",
      location: "Austin, TX",
      coordinates: { x: 280, y: 220 },
      employees: "100-500",
      description: "Direct air capture technology",
      website: "https://carboncapture.com",
      jobs: 8,
      categories: ["climate", "energy"],
    },
    {
      name: "Green Future Labs",
      location: "Boston, MA",
      coordinates: { x: 380, y: 160 },
      employees: "50-100",
      description: "Climate research and development",
      website: "https://greenfuture.com",
      jobs: 5,
      categories: ["climate", "academia"],
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
      categories: ["energy", "climate"],
    },
    {
      name: "Grid Innovations",
      location: "Seattle, WA",
      coordinates: { x: 80, y: 120 },
      employees: "500-1000",
      description: "Smart grid technology",
      website: "https://gridinnovations.com",
      jobs: 18,
      categories: ["energy", "tech"],
    },
    {
      name: "Energy Storage Solutions",
      location: "Atlanta, GA",
      coordinates: { x: 340, y: 240 },
      employees: "200-500",
      description: "Battery and storage systems",
      website: "https://energystorage.com",
      jobs: 11,
      categories: ["energy", "tech"],
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
      categories: ["geospatial", "tech"],
    },
    {
      name: "Spatial Analytics Corp",
      location: "Portland, OR",
      coordinates: { x: 60, y: 140 },
      employees: "100-300",
      description: "GIS and spatial data analysis",
      website: "https://spatialanalytics.com",
      jobs: 9,
      categories: ["geospatial", "tech"],
    },
  ],
  geophysics: [
    {
      name: "Earth Sciences Institute",
      location: "Denver, CO",
      coordinates: { x: 240, y: 200 },
      employees: "200-500",
      description: "Geological and geophysical research",
      website: "https://earthsciences.com",
      jobs: 12,
      categories: ["geophysics", "academia"],
    },
    {
      name: "Seismic Solutions Ltd",
      location: "Houston, TX",
      coordinates: { x: 260, y: 260 },
      employees: "100-300",
      description: "Seismic data analysis and interpretation",
      website: "https://seismicsolutions.com",
      jobs: 8,
      categories: ["geophysics", "energy"],
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
      categories: ["insurance", "climate"],
    },
    {
      name: "Weather Insurance Group",
      location: "Chicago, IL",
      coordinates: { x: 300, y: 180 },
      employees: "500-1000",
      description: "Weather-related insurance products",
      website: "https://weatherinsurance.com",
      jobs: 16,
      categories: ["insurance", "weather"],
    },
  ],
  tech: [
    {
      name: "Climate Data Analytics",
      location: "San Francisco, CA",
      coordinates: { x: 120, y: 180 },
      employees: "200-500",
      description: "AI and ML for climate data analysis",
      website: "https://climatedata.com",
      jobs: 18,
      categories: ["tech", "climate"],
    },
    {
      name: "Weather AI Systems",
      location: "Seattle, WA",
      coordinates: { x: 80, y: 120 },
      employees: "100-200",
      description: "Machine learning for weather prediction",
      website: "https://weatherai.com",
      jobs: 10,
      categories: ["tech", "weather"],
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
      categories: ["weather", "tech"],
    },
    {
      name: "Storm Analytics",
      location: "Miami, FL",
      coordinates: { x: 350, y: 280 },
      employees: "100-200",
      description: "Hurricane and storm prediction",
      website: "https://stormanalytics.com",
      jobs: 7,
      categories: ["weather", "climate"],
    },
  ],
}

const industryColors = {
  academia: "#8b5cf6",
  banking: "#10b981",
  climate: "#059669",
  energy: "#f59e0b",
  geospatial: "#ef4444",
  geophysics: "#78716c",
  insurance: "#06b6d4",
  tech: "#3b82f6",
  weather: "#0ea5e9",
}

const industryDisplayNames = {
  academia: "Academia & Research",
  banking: "Banking & Finance",
  climate: "Climate Science",
  energy: "Energy & Renewables",
  geospatial: "Geospatial & GIS",
  geophysics: "Geophysics & Geology",
  insurance: "Insurance & Reinsurance",
  tech: "Tech (Data Science & ML)",
  weather: "Weather & Meteorology",
}

export function CompaniesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([])

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative h-48 bg-gradient-to-r from-primary/20 to-accent/20 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/sky-clouds.png')" }} />
        <div className="absolute inset-0 bg-primary/40"></div>
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="text-center w-full">
            <h1 className="text-4xl font-bold text-white mb-2">Discover Top Companies & Institutes In Your Field</h1>
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
          </div>

          {/* Industry Filters */}
          <div className="flex flex-wrap gap-2">
            {Object.keys(companiesData).map((industry) => (
              <Button
                key={industry}
                variant={selectedIndustries.includes(industry) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleIndustry(industry)}
              >
                {industryDisplayNames[industry as keyof typeof industryDisplayNames]}
              </Button>
            ))}
            {selectedIndustries.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setSelectedIndustries([])}>
                Clear All
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{company.name}</CardTitle>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {company.categories.map((category) => (
                      <Badge
                        key={category}
                        variant="secondary"
                        className="text-xs"
                        style={{
                          backgroundColor: `${industryColors[category as keyof typeof industryColors]}20`,
                          color: industryColors[category as keyof typeof industryColors],
                        }}
                      >
                        {industryDisplayNames[category as keyof typeof industryDisplayNames]}
                      </Badge>
                    ))}
                  </div>
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
                  <div></div>
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

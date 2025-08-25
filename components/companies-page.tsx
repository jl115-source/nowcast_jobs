"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, MapPin, Users, ExternalLink, Search, ChevronLeft, ChevronRight } from "lucide-react"

interface Company {
  id: number
  name: string
  location: string
  employees: string
  description: string
  website: string
  categories: string[]
  isHiring: boolean
}

const industryColors = {
  "Academia & Research": "#8b5cf6",
  "Banking & Finance": "#10b981",
  "Climate Science": "#059669",
  "Energy & Renewables": "#f59e0b",
  "Geospatial & GIS": "#ef4444",
  "Geophysics & Geology": "#78716c",
  "Insurance & Reinsurance": "#06b6d4",
  "Tech (Data Science & ML)": "#3b82f6",
  "Weather & Meteorology": "#0ea5e9",
}

const COMPANIES_PER_PAGE = 30

export function CompaniesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const response = await fetch("/data/companies.json")
        const data = await response.json()
        setCompanies(data.companies)
      } catch (error) {
        console.error("Failed to load companies:", error)
      } finally {
        setLoading(false)
      }
    }
    loadCompanies()
  }, [])

  // Get unique industries from companies data
  const allIndustries = Array.from(new Set(companies.flatMap((company) => company.categories))).sort()

  // Filter companies
  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesIndustry =
      selectedIndustries.length === 0 || selectedIndustries.some((industry) => company.categories.includes(industry))
    return matchesSearch && matchesIndustry
  })

  const totalPages = Math.ceil(filteredCompanies.length / COMPANIES_PER_PAGE)
  const startIndex = (currentPage - 1) * COMPANIES_PER_PAGE
  const endIndex = startIndex + COMPANIES_PER_PAGE
  const paginatedCompanies = filteredCompanies.slice(startIndex, endIndex)

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedIndustries])

  const toggleIndustry = (industry: string) => {
    setSelectedIndustries((prev) =>
      prev.includes(industry) ? prev.filter((i) => i !== industry) : [...prev, industry],
    )
  }

  const goToPage = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const renderPaginationButtons = () => {
    const buttons = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <Button key={i} variant={currentPage === i ? "default" : "outline"} size="sm" onClick={() => goToPage(i)}>
            {i}
          </Button>,
        )
      }
    } else {
      buttons.push(
        <Button key={1} variant={currentPage === 1 ? "default" : "outline"} size="sm" onClick={() => goToPage(1)}>
          1
        </Button>,
      )

      if (currentPage > 3) {
        buttons.push(
          <span key="ellipsis1" className="px-2">
            ...
          </span>,
        )
      }

      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        buttons.push(
          <Button key={i} variant={currentPage === i ? "default" : "outline"} size="sm" onClick={() => goToPage(i)}>
            {i}
          </Button>,
        )
      }

      if (currentPage < totalPages - 2) {
        buttons.push(
          <span key="ellipsis2" className="px-2">
            ...
          </span>,
        )
      }

      if (totalPages > 1) {
        buttons.push(
          <Button
            key={totalPages}
            variant={currentPage === totalPages ? "default" : "outline"}
            size="sm"
            onClick={() => goToPage(totalPages)}
          >
            {totalPages}
          </Button>,
        )
      }
    }

    return buttons
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading companies...</p>
        </div>
      </div>
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
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredCompanies.length)} of {filteredCompanies.length}{" "}
              companies
            </div>
          </div>

          {/* Industry Filters */}
          <div className="flex flex-wrap gap-2">
            {allIndustries.map((industry) => (
              <Button
                key={industry}
                variant={selectedIndustries.includes(industry) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleIndustry(industry)}
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedCompanies.map((company) => (
            <Card key={company.id} className="hover:shadow-lg transition-shadow">
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
                        {category}
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
                <div className="flex items-center justify-end pt-2">
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

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <Button variant="outline" size="sm" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            <div className="flex items-center gap-1">{renderPaginationButtons()}</div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
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

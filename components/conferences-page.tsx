"use client"

import { useState } from "react"
import { Calendar, MapPin, Globe, ExternalLink, Users, Tag, Filter, SortAsc, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import conferencesData from "@/data/conferences.json"

interface Conference {
  id: string
  title: string
  description: string
  category: string
  location: string
  country: string
  startDate: string
  endDate: string
  website: string
  type: string
  isVirtual: boolean
  linkedJobs: string[]
  tags: string[]
}

export function ConferencesPage() {
  const [conferences] = useState<Conference[]>(conferencesData.conferences)
  const [filteredConferences, setFilteredConferences] = useState<Conference[]>(conferences)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [countryFilter, setCountryFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("date")

  const applyFiltersAndSort = (term: string, category: string, country: string, type: string, sort: string) => {
    let filtered = conferences

    if (term.trim()) {
      filtered = filtered.filter(
        (conf) =>
          conf.title.toLowerCase().includes(term.toLowerCase()) ||
          conf.description.toLowerCase().includes(term.toLowerCase()) ||
          conf.tags.some((tag) => tag.toLowerCase().includes(term.toLowerCase())),
      )
    }

    if (category !== "all") {
      filtered = filtered.filter((conf) => conf.category.toLowerCase() === category.toLowerCase())
    }

    if (country !== "all") {
      filtered = filtered.filter((conf) => conf.country.toLowerCase() === country.toLowerCase())
    }

    if (type !== "all") {
      filtered = filtered.filter((conf) => conf.type.toLowerCase() === type.toLowerCase())
    }

    switch (sort) {
      case "date":
        filtered.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
        break
      case "title":
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "location":
        filtered.sort((a, b) => a.location.localeCompare(b.location))
        break
    }

    setFilteredConferences(filtered)
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    applyFiltersAndSort(term, categoryFilter, countryFilter, typeFilter, sortBy)
  }

  const handleCategoryFilter = (category: string) => {
    setCategoryFilter(category)
    applyFiltersAndSort(searchTerm, category, countryFilter, typeFilter, sortBy)
  }

  const handleCountryFilter = (country: string) => {
    setCountryFilter(country)
    applyFiltersAndSort(searchTerm, categoryFilter, country, typeFilter, sortBy)
  }

  const handleTypeFilter = (type: string) => {
    setTypeFilter(type)
    applyFiltersAndSort(searchTerm, categoryFilter, countryFilter, type, sortBy)
  }

  const handleSort = (sort: string) => {
    setSortBy(sort)
    applyFiltersAndSort(searchTerm, categoryFilter, countryFilter, typeFilter, sort)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "climate":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "weather":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "energy":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "academia":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "geospatial":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "insurance":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const uniqueCategories = Array.from(new Set(conferences.map((conf) => conf.category)))
  const uniqueCountries = Array.from(new Set(conferences.map((conf) => conf.country)))
  const uniqueTypes = Array.from(new Set(conferences.map((conf) => conf.type)))

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
              <Calendar className="h-7 w-7" />
            </div>
            <h1 className="text-5xl font-bold">Conferences & Events</h1>
          </div>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Discover upcoming conferences, summits, and networking events in climate, weather, energy, academia,
            geospatial, and insurance fields
          </p>

          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search conferences, topics, or locations..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-12 h-14 text-lg bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/70"
              />
            </div>
          </div>
        </div>
      </div>

      <Card className="mb-8 bg-gradient-to-r from-card to-muted/30">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Filters:</span>
            </div>

            <Select value={categoryFilter} onValueChange={handleCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {uniqueCategories.map((category) => (
                  <SelectItem key={category} value={category.toLowerCase()}>
                    <div className="flex items-center gap-2">
                      {category.toLowerCase() === "insurance" && <Shield className="h-4 w-4" />}
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={countryFilter} onValueChange={handleCountryFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {uniqueCountries.map((country) => (
                  <SelectItem key={country} value={country.toLowerCase()}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={handleTypeFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Event Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {uniqueTypes.map((type) => (
                  <SelectItem key={type} value={type.toLowerCase()}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2 ml-auto">
              <SortAsc className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Sort by:</span>
              <Select value={sortBy} onValueChange={handleSort}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="location">Location</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold mb-6">
          {searchTerm ? `Search Results (${filteredConferences.length})` : "Upcoming Events"}
        </h2>

        {filteredConferences.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-muted-foreground">No conferences found matching your search criteria.</div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {filteredConferences.map((conference) => (
              <Card key={conference.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-primary/30">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2 flex items-center gap-3">
                        {conference.title}
                        <Badge className={getCategoryColor(conference.category)}>
                          {conference.category.charAt(0).toUpperCase() + conference.category.slice(1)}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="text-base">{conference.description}</CardDescription>
                    </div>
                    <div className="flex gap-2 items-start">
                      <Badge variant="outline">{conference.type}</Badge>
                      {conference.isVirtual && <Badge variant="secondary">Virtual</Badge>}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {formatDate(conference.startDate)}
                        {conference.startDate !== conference.endDate && ` - ${formatDate(conference.endDate)}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{conference.location}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {conference.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {conference.linkedJobs.length > 0 && (
                    <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Related Job Opportunities</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {conference.linkedJobs.length} job{conference.linkedJobs.length > 1 ? "s" : ""} available from
                        companies attending this event
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      {new Date(conference.startDate) > new Date() ? "Upcoming" : "Past"} • {conference.country}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <a href={conference.website} target="_blank" rel="noopener noreferrer">
                          <Globe className="mr-2 h-4 w-4" />
                          Visit Website
                        </a>
                      </Button>
                      {conference.linkedJobs.length > 0 && (
                        <Button size="sm">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View Jobs
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

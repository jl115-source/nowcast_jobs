"use client"

import { useState } from "react"
import {
  Search,
  Filter,
  SortAsc,
  CheckCircle,
  Target,
  Map,
  Building2,
  Users,
  BriefcaseIcon,
  GraduationCapIcon,
  ZapIcon,
  MountainIcon,
  ShieldIcon,
  CodeIcon,
  GlobeIcon as GlobeIcon2,
  MapPin,
  DollarSign,
  Briefcase,
  CloudRain,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import jobsData from "@/data/jobs.json"

interface Job {
  id: string
  title: string
  company: string
  location: string
  type: string
  salary: string
  categories: string[] | string
  description: string
  requirements: string[]
  skills: string[]
  posted: string
  remote: boolean
  contact?: string
  applicationLink?: string
  coordinates: {
    lat: number
    lng: number
  }
}

interface CVData {
  fileName: string
  fileSize: number
  uploadDate: string
  extractedText: string
  skills: string[]
  experience: string[]
  education: string[]
  summary: string
  yearsOfExperience: number
  jobTitles: string[]
}

interface JobMatch {
  jobId: string
  matchScore: number
  matchReasons: string[]
  skillsMatch: number
  experienceMatch: number
  titleMatch: number
  job: Job
}

interface JobBoardProps {
  onPageChange: (page: string) => void // Added prop for navigation
}

export function JobBoard({ onPageChange }: JobBoardProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [jobs] = useState<Job[]>(jobsData.jobs)
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(jobs)
  const [locationFilter, setLocationFilter] = useState<string>("all")
  const [countryFilter, setCountryFilter] = useState<string>("all") // Added country filter state
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [remoteFilter, setRemoteFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("newest")
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [cvData, setCvData] = useState<CVData | null>(null)
  const [jobMatches, setJobMatches] = useState<JobMatch[]>([])
  const [isMatching, setIsMatching] = useState(false)
  const [showMatches, setShowMatches] = useState(false)
  const [expandedJobs, setExpandedJobs] = useState<Set<string>>(new Set()) // Added state for expanded job cards
  const [columnLayout, setColumnLayout] = useState<number>(2) // Set default to 2 columns and remove 3-column option

  const standardIndustries = [
    "academia",
    "banking",
    "climate",
    "energy",
    "geospatial",
    "geophysics",
    "insurance",
    "tech",
    "weather",
  ]

  const applyFiltersAndSort = (
    search: string,
    location: string,
    country: string,
    type: string,
    category: string,
    remote: string,
    sort: string,
    mapFilteredJobs?: Job[],
  ) => {
    let filtered = mapFilteredJobs || jobs

    if (search) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(search.toLowerCase()) ||
          job.company.toLowerCase().includes(search.toLowerCase()) ||
          job.skills.some((skill) => skill.toLowerCase().includes(search.toLowerCase())),
      )
    }

    if (location !== "all") {
      filtered = filtered.filter((job) => job.location.toLowerCase().includes(location.toLowerCase()))
    }

    if (country !== "all") {
      filtered = filtered.filter((job) => job.location.toLowerCase().includes(country.toLowerCase()))
    }

    if (type !== "all") {
      filtered = filtered.filter((job) => job.type.toLowerCase() === type.toLowerCase())
    }

    if (category !== "all") {
      filtered = filtered.filter((job) =>
        Array.isArray(job.categories)
          ? job.categories.some((cat) => cat.toLowerCase() === category.toLowerCase())
          : job.category?.toLowerCase() === category.toLowerCase(),
      )
    }

    if (remote !== "all") {
      if (remote === "remote") {
        filtered = filtered.filter((job) => job.remote === true)
      } else if (remote === "onsite") {
        filtered = filtered.filter((job) => job.remote === false)
      }
    }

    if (!showMatches || !mapFilteredJobs) {
      switch (sort) {
        case "newest":
          filtered.sort((a, b) => new Date(b.posted).getTime() - new Date(a.posted).getTime())
          break
        case "oldest":
          filtered.sort((a, b) => new Date(a.posted).getTime() - new Date(b.posted).getTime())
          break
        case "company":
          filtered.sort((a, b) => a.company.localeCompare(b.company))
          break
        case "title":
          filtered.sort((a, b) => a.title.localeCompare(b.title))
          break
      }
    }

    setFilteredJobs(filtered)
  }

  const getSelectedCategories = () => {
    return categoryFilter === "all" ? [] : [categoryFilter]
  }

  const getSelectedCountries = () => {
    return countryFilter === "all" ? [] : [countryFilter]
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    applyFiltersAndSort(
      term,
      locationFilter,
      countryFilter,
      typeFilter,
      categoryFilter,
      remoteFilter,
      sortBy,
      jobMatches,
    )
  }

  const handleLocationFilter = (location: string) => {
    setLocationFilter(location)
    applyFiltersAndSort(
      searchTerm,
      location,
      countryFilter,
      typeFilter,
      categoryFilter,
      remoteFilter,
      sortBy,
      jobMatches,
    )
  }

  const handleCountryFilter = (country: string) => {
    setCountryFilter(country)
    applyFiltersAndSort(
      searchTerm,
      locationFilter,
      country,
      typeFilter,
      categoryFilter,
      remoteFilter,
      sortBy,
      jobMatches,
    )
  }

  const handleTypeFilter = (type: string) => {
    setTypeFilter(type)
    applyFiltersAndSort(
      searchTerm,
      locationFilter,
      countryFilter,
      type,
      categoryFilter,
      remoteFilter,
      sortBy,
      jobMatches,
    )
  }

  const handleCategoryFilter = (category: string) => {
    setCategoryFilter(category)
    applyFiltersAndSort(
      searchTerm,
      locationFilter,
      countryFilter,
      typeFilter,
      category,
      remoteFilter,
      sortBy,
      jobMatches,
    )
  }

  const handleRemoteFilter = (remote: string) => {
    setRemoteFilter(remote)
    applyFiltersAndSort(
      searchTerm,
      locationFilter,
      countryFilter,
      typeFilter,
      categoryFilter,
      remote,
      sortBy,
      jobMatches,
    )
  }

  const handleSort = (sort: string) => {
    setSortBy(sort)
    applyFiltersAndSort(
      searchTerm,
      locationFilter,
      countryFilter,
      typeFilter,
      categoryFilter,
      remoteFilter,
      sort,
      jobMatches,
    )
  }

  const toggleJobExpansion = (jobId: string) => {
    const newExpanded = new Set(expandedJobs)
    if (newExpanded.has(jobId)) {
      newExpanded.delete(jobId)
    } else {
      newExpanded.add(jobId)
    }
    setExpandedJobs(newExpanded)
  }

  const handleCVUploadComplete = async (uploadedCvData: CVData) => {
    setCvData(uploadedCvData)
    setIsMatching(true)

    try {
      const response = await fetch("/api/match-jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cvData: uploadedCvData }),
      })

      if (response.ok) {
        const { matches } = await response.json()
        setJobMatches(matches)
        setShowMatches(true)
        applyFiltersAndSort(
          searchTerm,
          locationFilter,
          countryFilter,
          typeFilter,
          categoryFilter,
          remoteFilter,
          sortBy,
          matches,
        ) // Updated function call with category parameter
      }
    } catch (error) {
      console.error("Job matching failed:", error)
    } finally {
      setIsMatching(false)
    }
  }

  const getJobMatch = (jobId: string): JobMatch | undefined => {
    return jobMatches.find((match) => match.jobId === jobId)
  }

  const getMatchColor = (score: number): string => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getMatchBadgeVariant = (score: number): "default" | "secondary" | "destructive" => {
    if (score >= 80) return "default"
    if (score >= 60) return "secondary"
    return "destructive"
  }

  const uniqueLocations = Array.from(new Set(jobs.map((job) => job.location.split(",")[0].trim())))
  const uniqueCountries = Array.from(new Set(jobs.map((job) => job.location.split(",").pop()?.trim()).filter(Boolean)))
  const uniqueTypes = Array.from(new Set(jobs.map((job) => job.type)))
  const uniqueCategories = Array.from(
    new Set(jobs.flatMap((job) => (Array.isArray(job.categories) ? job.categories : [job.category])).filter(Boolean)),
  )

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "academia":
        return <GraduationCapIcon className="h-4 w-4" />
      case "banking":
        return <Building2 className="h-4 w-4" />
      case "climate":
        return <GlobeIcon2 className="h-4 w-4" />
      case "energy":
        return <ZapIcon className="h-4 w-4" />
      case "geospatial":
        return <Map className="h-4 w-4" />
      case "geophysics":
        return <MountainIcon className="h-4 w-4" />
      case "insurance":
        return <ShieldIcon className="h-4 w-4" />
      case "tech":
        return <CodeIcon className="h-4 w-4" />
      case "weather":
        return <CloudRain className="h-4 w-4" />
      default:
        return <BriefcaseIcon className="h-4 w-4" />
    }
  }

  const getCategoryDisplayName = (category: string) => {
    switch (category.toLowerCase()) {
      case "academia":
        return "Academia & Research"
      case "banking":
        return "Banking & Finance"
      case "climate":
        return "Climate Science"
      case "energy":
        return "Energy & Renewables"
      case "geospatial":
        return "Geospatial & GIS"
      case "geophysics":
        return "Geophysics & Geology"
      case "insurance":
        return "Insurance & Reinsurance"
      case "tech":
        return "Tech (Data Science & ML)"
      case "weather":
        return "Weather & Meteorology"
      default:
        return category.charAt(0).toUpperCase() + category.slice(1)
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
          <h1 className="text-4xl font-bold mb-4">🌧️ Jobs for your niche</h1>
          <p className="text-xl mb-6 opacity-90">
            Specialist jobs in weather, climate, energy, commodities, geophysics and geospatial fields
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => onPageChange?.("job-notifications")} // Use proper navigation instead of local state
              className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg transition-colors duration-200 backdrop-blur-sm border border-white/20"
            >
              🌧️ Get Job Notifications
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="bg-card rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search jobs, companies, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Filters:</span>
            </div>

            <Select value={categoryFilter} onValueChange={handleCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                {standardIndustries.map((industry) => (
                  <SelectItem key={industry} value={industry.toLowerCase()}>
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(industry)}
                      {getCategoryDisplayName(industry)}
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
                  <SelectItem key={country} value={country!.toLowerCase()}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={locationFilter} onValueChange={handleLocationFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {uniqueLocations.map((location) => (
                  <SelectItem key={location} value={location.toLowerCase()}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={handleTypeFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Job Type" />
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

            <Select value={remoteFilter} onValueChange={handleRemoteFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Work Style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="onsite">On-site</SelectItem>
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
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="company">Company</SelectItem>
                  <SelectItem value="title">Job Title</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2 ml-4">
                <span className="text-sm font-medium">Layout:</span>
                <div className="flex border rounded-lg overflow-hidden">
                  <Button
                    variant={columnLayout === 1 ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setColumnLayout(1)}
                    className="rounded-none border-0"
                  >
                    <Users className="h-4 w-4 mr-1" />1 Column
                  </Button>
                  <Button
                    variant={columnLayout === 2 ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setColumnLayout(2)}
                    className="rounded-none border-0"
                  >
                    <Users className="h-4 w-4 mr-1" />2 Columns
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {cvData && (
          <Card className="mb-8 border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                CV Analysis Complete
              </CardTitle>
              <CardDescription>
                Found {cvData.skills.length} skills and {cvData.experience.length} work experiences.
                {isMatching && " Analyzing job matches..."}
                {showMatches && !isMatching && ` Found ${jobMatches.length} job matches.`}
              </CardDescription>
            </CardHeader>
            {showMatches && !isMatching && (
              <CardContent>
                <div className="flex gap-4 items-center">
                  <Button
                    variant={showMatches ? "default" : "outline"}
                    onClick={() => {
                      setShowMatches(true)
                      applyFiltersAndSort(
                        searchTerm,
                        locationFilter,
                        countryFilter,
                        typeFilter,
                        categoryFilter,
                        remoteFilter,
                        sortBy,
                        jobMatches,
                      ) // Updated function call
                    }}
                  >
                    <Target className="mr-2 h-4 w-4" />
                    Show Matched Jobs
                  </Button>
                  <Button
                    variant={!showMatches ? "default" : "outline"}
                    onClick={() => {
                      setShowMatches(false)
                      applyFiltersAndSort(
                        searchTerm,
                        locationFilter,
                        countryFilter,
                        typeFilter,
                        categoryFilter,
                        remoteFilter,
                        sortBy,
                      ) // Updated function call
                    }}
                  >
                    Show All Jobs
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    Best match: {jobMatches[0]?.matchScore}% • {jobMatches.filter((m) => m.matchScore >= 70).length}{" "}
                    good matches
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        )}

        <div className={`grid gap-4 ${columnLayout === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}>
          {filteredJobs.map((job) => {
            const jobMatch = getJobMatch(job.id)
            const isExpanded = expandedJobs.has(job.id)

            return (
              <Card key={job.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{job.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        {job.company}
                      </CardDescription>
                    </div>
                    {jobMatch && (
                      <Badge variant={getMatchBadgeVariant(jobMatch.matchScore)} className="ml-2">
                        {jobMatch.matchScore}% match
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      {job.salary}
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-3 w-3" />
                      {job.type}
                    </div>
                    {job.remote && (
                      <Badge variant="secondary" className="text-xs">
                        Remote
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {Array.isArray(job.categories)
                      ? job.categories.map((category) => (
                          <Badge key={category} variant="outline" className="text-xs">
                            {getCategoryDisplayName(category)}
                          </Badge>
                        ))
                      : job.category && (
                          <Badge variant="outline" className="text-xs">
                            {getCategoryDisplayName(job.category)}
                          </Badge>
                        )}
                  </div>

                  {jobMatch && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Skills Match</span>
                        <span className={getMatchColor(jobMatch.skillsMatch)}>{jobMatch.skillsMatch}%</span>
                      </div>
                      <Progress value={jobMatch.skillsMatch} className="h-1" />
                      <div className="text-xs text-muted-foreground">
                        {jobMatch.matchReasons.slice(0, 2).join(", ")}
                      </div>
                    </div>
                  )}

                  {isExpanded && (
                    <div className="space-y-3 pt-3 border-t">
                      <div>
                        <h4 className="font-medium text-sm mb-2">Description</h4>
                        <p className="text-sm text-muted-foreground">{job.description}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-2">Requirements</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {job.requirements.map((req, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-2">Skills</h4>
                        <div className="flex flex-wrap gap-1">
                          {job.skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      {job.contact && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={`mailto:${job.contact}`}>Contact</a>
                        </Button>
                      )}
                      {job.applicationLink && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={job.applicationLink} target="_blank" rel="noopener noreferrer">
                            Apply
                          </a>
                        </Button>
                      )}
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => toggleJobExpansion(job.id)}>
                      {isExpanded ? (
                        <>
                          <ChevronUp className="h-4 w-4 mr-1" />
                          Less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4 mr-1" />
                          Details
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}

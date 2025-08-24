"use client"

import { useState } from "react"
import {
  Search,
  MapPin,
  Clock,
  DollarSign,
  Briefcase,
  Filter,
  SortAsc,
  Eye,
  CheckCircle,
  Target,
  TrendingUp,
  Globe,
  Zap,
  CloudRain,
  GraduationCap,
  Map,
  ChevronDown,
  ChevronUp,
  Shield,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import jobsData from "@/data/jobs.json"

interface Job {
  id: string
  title: string
  company: string
  location: string
  type: string
  salary: string
  category: string
  description: string
  requirements: string[]
  skills: string[]
  posted: string
  remote: boolean
  contact?: string
  applicationLink?: string
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
  showMatcherOnly?: boolean
}

export function JobBoard({ showMatcherOnly = false }: JobBoardProps) {
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
  const [layoutColumns, setLayoutColumns] = useState<number>(2) // Set default to 2 columns and remove 3-column option

  const applyFiltersAndSort = (
    term: string,
    location: string,
    country: string, // Added country parameter
    type: string,
    category: string,
    remote: string,
    sort: string,
    matches?: JobMatch[],
  ) => {
    let filtered = showMatches && matches ? matches.map((m) => m.job) : jobs

    if (term.trim()) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(term.toLowerCase()) ||
          job.company.toLowerCase().includes(term.toLowerCase()) ||
          job.skills.some((skill) => skill.toLowerCase().includes(term.toLowerCase())) ||
          job.description.toLowerCase().includes(term.toLowerCase()),
      )
    }

    if (location !== "all") {
      filtered = filtered.filter((job) => job.location.toLowerCase().includes(location.toLowerCase()))
    }

    if (country !== "all") {
      filtered = filtered.filter((job) => {
        const jobCountry = job.location.split(",").pop()?.trim().toLowerCase()
        return jobCountry?.includes(country.toLowerCase())
      })
    }

    if (type !== "all") {
      filtered = filtered.filter((job) => job.type.toLowerCase() === type.toLowerCase())
    }

    if (category !== "all") {
      filtered = filtered.filter((job) => job.category.toLowerCase() === category.toLowerCase())
    }

    if (remote !== "all") {
      const isRemote = remote === "remote"
      filtered = filtered.filter((job) => job.remote === isRemote)
    }

    if (!showMatches || !matches) {
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
  const uniqueCategories = Array.from(new Set(jobs.map((job) => job.category)))

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "climate":
        return <Globe className="h-4 w-4" />
      case "weather":
        return <CloudRain className="h-4 w-4" />
      case "energy":
        return <Zap className="h-4 w-4" />
      case "academia":
        return <GraduationCap className="h-4 w-4" />
      case "geospatial":
        return <Map className="h-4 w-4" />
      case "insurance":
        return <Shield className="h-4 w-4" />
      default:
        return <Briefcase className="h-4 w-4" />
    }
  }

  const getCategoryDisplayName = (category: string) => {
    switch (category.toLowerCase()) {
      case "climate":
        return "Climate Science"
      case "weather":
        return "Weather & Meteorology"
      case "energy":
        return "Energy & Renewables"
      case "academia":
        return "Academia & Research"
      case "geospatial":
        return "Geospatial & GIS"
      case "insurance":
        return "Insurance & Reinsurance"
      default:
        return category.charAt(0).toUpperCase() + category.slice(1)
    }
  }

  if (showMatcherOnly) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">CV Matcher Results</h2>
          <p className="text-muted-foreground">
            This page shows your AI-matched jobs. Upload a CV on the CV Matcher page to see personalized results.
          </p>
        </div>
        {cvData && jobMatches.length > 0 ? (
          <div className="space-y-6">
            {jobMatches.map((match) => {
              const job = match.job
              return (
                <Card key={job.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl mb-2 flex items-center gap-2">
                          {job.title}
                          {match && (
                            <Badge variant={getMatchBadgeVariant(match.matchScore)} className="ml-2">
                              {match.matchScore}% match
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="text-base font-medium text-foreground">
                          {job.company}
                        </CardDescription>
                      </div>
                      <Badge variant={job.remote ? "default" : "secondary"}>{job.remote ? "Remote" : "On-site"}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {match && (
                      <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">Match Analysis</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mb-2">
                          <div>
                            <div className="text-xs text-muted-foreground">Skills</div>
                            <div className="flex items-center gap-1">
                              <Progress value={match.skillsMatch} className="h-2 flex-1" />
                              <span className="text-xs font-medium">{match.skillsMatch}%</span>
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Experience</div>
                            <div className="flex items-center gap-1">
                              <Progress value={match.experienceMatch} className="h-2 flex-1" />
                              <span className="text-xs font-medium">{match.experienceMatch}%</span>
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Role Fit</div>
                            <div className="flex items-center gap-1">
                              <Progress value={match.titleMatch} className="h-2 flex-1" />
                              <span className="text-xs font-medium">{match.titleMatch}%</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {match.matchReasons.slice(0, 2).join(" • ")}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {job.type}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {job.salary}
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-4 line-clamp-2">{job.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skills.slice(0, 6).map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {job.skills.length > 6 && (
                        <Badge variant="outline" className="text-xs">
                          +{job.skills.length - 6} more
                        </Badge>
                      )}
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Posted {new Date(job.posted).toLocaleDateString()}
                      </span>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedJob(job)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="text-2xl flex items-center gap-2">
                                {job.title}
                                {match && (
                                  <Badge variant={getMatchBadgeVariant(match.matchScore)}>
                                    {match.matchScore}% match
                                  </Badge>
                                )}
                              </DialogTitle>
                              <DialogDescription className="text-lg font-medium text-foreground">
                                {job.company} • {job.location}
                              </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6">
                              {match && (
                                <div className="p-4 bg-muted/50 rounded-lg">
                                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                                    <Target className="h-4 w-4" />
                                    Match Analysis
                                  </h3>
                                  <div className="grid grid-cols-3 gap-4 mb-3">
                                    <div>
                                      <div className="text-sm font-medium mb-1">Skills Match</div>
                                      <Progress value={match.skillsMatch} className="h-2" />
                                      <div className="text-xs text-muted-foreground mt-1">{match.skillsMatch}%</div>
                                    </div>
                                    <div>
                                      <div className="text-sm font-medium mb-1">Experience Match</div>
                                      <Progress value={match.experienceMatch} className="h-2" />
                                      <div className="text-xs text-muted-foreground mt-1">{match.experienceMatch}%</div>
                                    </div>
                                    <div>
                                      <div className="text-sm font-medium mb-1">Role Fit</div>
                                      <Progress value={match.titleMatch} className="h-2" />
                                      <div className="text-xs text-muted-foreground mt-1">{match.titleMatch}%</div>
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium mb-1">Why this matches:</div>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                      {match.matchReasons.map((reason, index) => (
                                        <li key={index}>• {reason}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              )}

                              <Separator />

                              <div>
                                <h3 className="font-semibold mb-2">Job Description</h3>
                                <p className="text-muted-foreground">{job.description}</p>
                              </div>

                              <div>
                                <h3 className="font-semibold mb-2">Requirements</h3>
                                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                  {job.requirements.map((req, index) => (
                                    <li key={index}>{req}</li>
                                  ))}
                                </ul>
                              </div>

                              <div>
                                <h3 className="font-semibold mb-2">Required Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                  {job.skills.map((skill) => (
                                    <Badge key={skill} variant="outline">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              <div className="flex justify-between items-center pt-4">
                                <span className="text-sm text-muted-foreground">
                                  Posted {new Date(job.posted).toLocaleDateString()}
                                </span>
                                <Button size="lg">Apply Now</Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button>Apply Now</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No CV uploaded yet</h3>
              <p className="text-muted-foreground mb-4">
                Go to the CV Matcher page to upload your CV and get AI-powered job matches.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    )
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
          <p className="text-xl opacity-90">Specialized opportunities in climate, weather, energy & more</p>
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
                {uniqueCategories.map((category) => (
                  <SelectItem key={category} value={category.toLowerCase()}>
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(category)}
                      {getCategoryDisplayName(category)}
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
                <Select
                  value={layoutColumns.toString()}
                  onValueChange={(value) => setLayoutColumns(Number.parseInt(value))}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Column</SelectItem>
                    <SelectItem value="2">2 Columns</SelectItem>
                  </SelectContent>
                </Select>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="lg:col-span-2">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-6">
                {searchTerm ? `Search Results (${filteredJobs.length})` : "Latest Jobs"}
              </h2>

              {filteredJobs.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="text-muted-foreground">No jobs found matching your search criteria.</div>
                  </CardContent>
                </Card>
              ) : (
                <div className={`grid gap-4 ${layoutColumns === 1 ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"}`}>
                  {filteredJobs.map((job) => {
                    const match = getJobMatch(job.id)
                    const isExpanded = expandedJobs.has(job.id)
                    return (
                      <Card
                        key={job.id}
                        className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary/30"
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-foreground text-lg">{job.title}</h3>
                                {match && (
                                  <Badge variant={getMatchBadgeVariant(match.matchScore)} className="text-xs">
                                    {match.matchScore}%
                                  </Badge>
                                )}
                              </div>
                              <p className="font-medium text-primary mb-2 text-base">{job.company}</p>
                              <div className="flex flex-wrap gap-3 text-muted-foreground text-sm">
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {job.location}
                                </div>
                                <div className="flex items-center gap-1">
                                  <DollarSign className="h-3 w-3" />
                                  {job.salary}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {job.type}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col gap-1 items-end">
                              <Badge variant="outline" className="flex items-center gap-1 text-xs">
                                {getCategoryIcon(job.category)}
                                {getCategoryDisplayName(job.category)}
                              </Badge>
                              <Badge variant={job.remote ? "default" : "secondary"} className="text-xs">
                                {job.remote ? "Remote" : "On-site"}
                              </Badge>
                            </div>
                          </div>

                          <div className="flex justify-between items-center">
                            <div className="flex gap-2">
                              {job.contact && (
                                <Button variant="outline" size="sm" asChild>
                                  <a href={`mailto:${job.contact}`}>Contact</a>
                                </Button>
                              )}
                              <Button variant="outline" size="sm" onClick={() => toggleJobExpansion(job.id)}>
                                {isExpanded ? (
                                  <>
                                    <ChevronUp className="mr-1 h-3 w-3" />
                                    Hide
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown className="mr-1 h-3 w-3" />
                                    Details
                                  </>
                                )}
                              </Button>
                            </div>
                            {job.applicationLink ? (
                              <Button size="sm" asChild>
                                <a href={job.applicationLink} target="_blank" rel="noopener noreferrer">
                                  Apply
                                </a>
                              </Button>
                            ) : (
                              <Button size="sm">Apply</Button>
                            )}
                          </div>

                          {isExpanded && (
                            <div className="mt-4 pt-4 border-t border-border space-y-3">
                              {match && (
                                <div className="p-4 bg-muted/50 rounded-lg">
                                  <div className="flex items-center gap-2 mb-3">
                                    <TrendingUp className="h-4 w-4 text-primary" />
                                    <span className="text-sm font-medium">Match Analysis</span>
                                  </div>
                                  <div className="grid grid-cols-3 gap-4 mb-3">
                                    <div>
                                      <div className="text-xs text-muted-foreground mb-1">Skills</div>
                                      <div className="flex items-center gap-1">
                                        <Progress value={match.skillsMatch} className="h-2 flex-1" />
                                        <span className="text-xs font-medium">{match.skillsMatch}%</span>
                                      </div>
                                    </div>
                                    <div>
                                      <div className="text-xs text-muted-foreground mb-1">Experience</div>
                                      <div className="flex items-center gap-1">
                                        <Progress value={match.experienceMatch} className="h-2 flex-1" />
                                        <span className="text-xs font-medium">{match.experienceMatch}%</span>
                                      </div>
                                    </div>
                                    <div>
                                      <div className="text-xs text-muted-foreground mb-1">Role Fit</div>
                                      <div className="flex items-center gap-1">
                                        <Progress value={match.titleMatch} className="h-2 flex-1" />
                                        <span className="text-xs font-medium">{match.titleMatch}%</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {match.matchReasons.slice(0, 2).join(" • ")}
                                  </div>
                                </div>
                              )}

                              <div>
                                <h4 className="font-semibold mb-2">Job Description</h4>
                                <p className="text-muted-foreground text-sm">{job.description}</p>
                              </div>

                              <div>
                                <h4 className="font-semibold mb-2">Requirements</h4>
                                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                  {job.requirements.map((req, index) => (
                                    <li key={index}>{req}</li>
                                  ))}
                                </ul>
                              </div>

                              <div>
                                <h4 className="font-semibold mb-2">Required Skills</h4>
                                <div className="flex flex-wrap gap-2">
                                  {job.skills.map((skill) => (
                                    <Badge key={skill} variant="outline" className="text-xs">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              <div className="flex justify-between items-center pt-2 text-sm text-muted-foreground">
                                <span>Posted {new Date(job.posted).toLocaleDateString()}</span>
                                <div className="flex gap-2">
                                  {job.contact && (
                                    <Button variant="outline" size="sm" asChild>
                                      <a href={`mailto:${job.contact}`}>Contact</a>
                                    </Button>
                                  )}
                                  {job.applicationLink ? (
                                    <Button size="sm" asChild>
                                      <a href={job.applicationLink} target="_blank" rel="noopener noreferrer">
                                        Apply
                                      </a>
                                    </Button>
                                  ) : (
                                    <Button size="sm">Apply</Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

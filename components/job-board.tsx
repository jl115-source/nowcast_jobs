"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Filter,
  SortAsc,
  CheckCircle,
  Target,
  Map,
  Building2,
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
  ChevronLeft,
  ChevronRight,
  Heart,
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
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("newest")
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [cvData, setCvData] = useState<CVData | null>(null)
  const [jobMatches, setJobMatches] = useState<JobMatch[]>([])
  const [isMatching, setIsMatching] = useState(false)
  const [showMatches, setShowMatches] = useState(false)
  const [expandedJobs, setExpandedJobs] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [jobsPerPage] = useState(20)
  const [favoriteJobs, setFavoriteJobs] = useState<Set<string>>(new Set())
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

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

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const jobId = urlParams.get("job")

    if (jobId) {
      setExpandedJobs(new Set([jobId]))

      setTimeout(() => {
        const jobElement = document.getElementById(`job-${jobId}`)
        if (jobElement) {
          jobElement.scrollIntoView({ behavior: "smooth", block: "center" })
        }
      }, 100)
    }
  }, [])

  useEffect(() => {
    const savedFavorites = localStorage.getItem("favoriteJobs")
    if (savedFavorites) {
      setFavoriteJobs(new Set(JSON.parse(savedFavorites)))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("favoriteJobs", JSON.stringify(Array.from(favoriteJobs)))
  }, [favoriteJobs])

  useEffect(() => {
    applyFiltersAndSort(searchTerm, locationFilter, categoryFilter, sortBy, jobMatches)
  }, [favoriteJobs, showFavoritesOnly])

  const applyFiltersAndSort = (
    search: string,
    location: string,
    category: string,
    sort: string,
    mapFilteredJobs?: Job[],
  ) => {
    let filtered = mapFilteredJobs || jobs

    if (showFavoritesOnly) {
      filtered = filtered.filter((job) => favoriteJobs.has(job.id))
    }

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

    if (category !== "all") {
      filtered = filtered.filter((job) =>
        Array.isArray(job.categories)
          ? job.categories.some((cat) => cat.toLowerCase() === category.toLowerCase())
          : job.category?.toLowerCase() === category.toLowerCase(),
      )
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
    setCurrentPage(1)
  }

  const getSelectedCategories = () => {
    return categoryFilter === "all" ? [] : [categoryFilter]
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    applyFiltersAndSort(term, locationFilter, categoryFilter, sortBy, jobMatches)
  }

  const handleLocationFilter = (location: string) => {
    setLocationFilter(location)
    applyFiltersAndSort(searchTerm, location, categoryFilter, sortBy, jobMatches)
  }

  const handleCategoryFilter = (category: string) => {
    setCategoryFilter(category)
    applyFiltersAndSort(searchTerm, locationFilter, category, sortBy, jobMatches)
  }

  const handleSort = (sort: string) => {
    setSortBy(sort)
    applyFiltersAndSort(searchTerm, locationFilter, categoryFilter, sort, jobMatches)
  }

  const handleFavoritesFilter = (showFavorites: boolean) => {
    setShowFavoritesOnly(showFavorites)
    applyFiltersAndSort(searchTerm, locationFilter, categoryFilter, sortBy, jobMatches)
  }

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage)
  const startIndex = (currentPage - 1) * jobsPerPage
  const endIndex = startIndex + jobsPerPage
  const currentJobs = filteredJobs.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1)
    }
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1)
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

  const toggleJobExpansion = (jobId: string) => {
    const newExpanded = new Set(expandedJobs)
    if (newExpanded.has(jobId)) {
      newExpanded.delete(jobId)
      const url = new URL(window.location.href)
      url.searchParams.delete("job")
      window.history.replaceState({}, "", url.toString())
    } else {
      newExpanded.add(jobId)
      const url = new URL(window.location.href)
      url.searchParams.set("job", jobId)
      window.history.replaceState({}, "", url.toString())
    }
    setExpandedJobs(newExpanded)
  }

  const copyJobLink = (jobId: string) => {
    const url = new URL(window.location.href)
    url.searchParams.set("job", jobId)
    navigator.clipboard.writeText(url.toString()).then(() => {
      console.log("Job link copied to clipboard")
    })
  }

  const toggleFavorite = (jobId: string) => {
    const newFavorites = new Set(favoriteJobs)
    if (newFavorites.has(jobId)) {
      newFavorites.delete(jobId)
    } else {
      newFavorites.add(jobId)
    }
    setFavoriteJobs(newFavorites)
  }

  return (
    <div className="min-h-screen bg-background">
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
            Specialist jobs in weather, climate, energy, commodities, insurance, banking and geoscience fields
          </p>
        </div>
        <div className="absolute bottom-4 left-4">
          <button
            onClick={() => onPageChange?.("job-notifications")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-lg"
          >
            🌧️ Get Job Notifications
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
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

            <div className="flex items-center gap-2">
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

            <div className="flex items-center gap-2">
              <Button
                variant={showFavoritesOnly ? "default" : "outline"}
                size="sm"
                onClick={() => handleFavoritesFilter(!showFavoritesOnly)}
                className="flex items-center gap-2"
              >
                <Heart className={`h-4 w-4 ${showFavoritesOnly ? "fill-current" : ""}`} />
                {showFavoritesOnly ? "Favorites Only" : "Show Favorites"}
                {favoriteJobs.size > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {favoriteJobs.size}
                  </Badge>
                )}
              </Button>
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
                      applyFiltersAndSort(searchTerm, locationFilter, categoryFilter, sortBy, jobMatches)
                    }}
                  >
                    <Target className="mr-2 h-4 w-4" />
                    Show Matched Jobs
                  </Button>
                  <Button
                    variant={!showMatches ? "default" : "outline"}
                    onClick={() => {
                      setShowMatches(false)
                      applyFiltersAndSort(searchTerm, locationFilter, categoryFilter, sortBy)
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

        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredJobs.length)} of {filteredJobs.length} jobs
          </div>
          {totalPages > 1 && (
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
          )}
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {currentJobs.map((job) => {
            const jobMatch = getJobMatch(job.id)
            const isExpanded = expandedJobs.has(job.id)
            const isFavorited = favoriteJobs.has(job.id)

            return (
              <Card key={job.id} id={`job-${job.id}`} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{job.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        {job.company}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => toggleFavorite(job.id)} className="p-2">
                        <Heart
                          className={`h-4 w-4 ${isFavorited ? "fill-red-500 text-red-500" : "text-muted-foreground hover:text-red-500"}`}
                        />
                      </Button>
                      {jobMatch && (
                        <Badge
                          variant={
                            jobMatch.matchScore >= 80
                              ? "default"
                              : jobMatch.matchScore >= 60
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {jobMatch.matchScore}% match
                        </Badge>
                      )}
                    </div>
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
                        <span className={getMatchColor(jobMatch.matchScore)}>{jobMatch.matchScore}%</span>
                      </div>
                      <Progress value={jobMatch.matchScore} className="h-1" />
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
                      <Button variant="outline" size="sm" onClick={() => copyJobLink(job.id)}>
                        Share
                      </Button>
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

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <Button variant="outline" size="sm" onClick={goToPreviousPage} disabled={currentPage === 1}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            <div className="flex items-center gap-1">
              {currentPage > 3 && (
                <>
                  <Button variant={1 === currentPage ? "default" : "outline"} size="sm" onClick={() => goToPage(1)}>
                    1
                  </Button>
                  {currentPage > 4 && <span className="px-2 text-muted-foreground">...</span>}
                </>
              )}

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                if (pageNum > totalPages) return null

                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                )
              })}

              {currentPage < totalPages - 2 && (
                <>
                  {currentPage < totalPages - 3 && <span className="px-2 text-muted-foreground">...</span>}
                  <Button
                    variant={totalPages === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage(totalPages)}
                  >
                    {totalPages}
                  </Button>
                </>
              )}
            </div>

            <Button variant="outline" size="sm" onClick={goToNextPage} disabled={currentPage === totalPages}>
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

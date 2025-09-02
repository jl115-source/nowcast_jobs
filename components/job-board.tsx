"use client"

import { useState, useEffect } from "react"
import {
  Search,
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
  dateAdded: string // Added dateAdded field
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
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<string>("newest")
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [cvData, setCvData] = useState<CVData | null>(null)
  const [jobMatches, setJobMatches] = useState<JobMatch[]>([])
  const [isMatching, setIsMatching] = useState(false)
  const [showMatches, setShowMatches] = useState(false)
  const [expandedJobs, setExpandedJobs] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [jobsPerPage] = useState(21) // Changed jobs per page to 21 (divisible by 3) for 3-column layout
  const [favoriteJobs, setFavoriteJobs] = useState<Set<string>>(new Set())
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

  const standardIndustries = [
    { key: "academia", name: "Academia & Research" },
    { key: "banking", name: "Banking & Finance" },
    { key: "climate", name: "Climate Science" },
    { key: "energy", name: "Energy & Renewables" },
    { key: "geospatial", name: "Geospatial & GIS" },
    { key: "geophysics", name: "Geophysics & Geology" },
    { key: "insurance", name: "Insurance & Reinsurance" },
    { key: "postdoc", name: "Post-doc" },
    { key: "professor", name: "Professor" },
    { key: "tech", name: "Tech (Data Science & ML)" },
    { key: "trading", name: "Trading (Commodities, Weather, Energy)" },
    { key: "weather", name: "Weather & Meteorology" },
  ]

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
    Professor: "#7c3aed",
    "Trading (Commodities, Weather, Energy)": "#ea580c",
    "Post-doc": "#0891b2",
  }

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
    applyFiltersAndSort()
  }, [searchTerm, locationFilter, selectedIndustries, sortBy, showFavoritesOnly])

  const extractSalaryValue = (salary: string): number => {
    if (!salary || typeof salary !== "string") {
      return 0
    }

    // Remove currency symbols and common text
    const cleanSalary = salary.replace(/[$£€,]/g, "").toLowerCase()

    // Look for salary ranges (e.g., "50000-70000" or "50000 - 70000")
    const rangeMatch = cleanSalary.match(/(\d+)\s*[-–]\s*(\d+)/)
    if (rangeMatch) {
      const min = Number.parseInt(rangeMatch[1])
      const max = Number.parseInt(rangeMatch[2])
      return (min + max) / 2 // Use average of range
    }

    // Look for single salary values
    const singleMatch = cleanSalary.match(/(\d+)/)
    if (singleMatch) {
      const value = Number.parseInt(singleMatch[1])

      // Handle hourly rates (convert to annual assuming 40h/week, 52 weeks)
      if (cleanSalary.includes("hour") || cleanSalary.includes("hr")) {
        return value * 40 * 52
      }

      // Handle monthly rates (convert to annual)
      if (cleanSalary.includes("month") || cleanSalary.includes("monthly")) {
        return value * 12
      }

      // Assume annual if no specific period mentioned
      return value
    }

    return 0
  }

  const applyFiltersAndSort = () => {
    let baseJobs = showMatches ? jobMatches.map((match) => match.job) : jobs

    // Apply favorites filter first if enabled
    if (showFavoritesOnly) {
      baseJobs = baseJobs.filter((job) => favoriteJobs.has(job.id))
    }

    let filtered = baseJobs

    if (searchTerm) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (job.skills &&
            Array.isArray(job.skills) &&
            job.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))),
      )
    }

    if (locationFilter !== "all") {
      filtered = filtered.filter((job) => job.location.toLowerCase().includes(locationFilter.toLowerCase()))
    }

    if (selectedIndustries.length > 0) {
      filtered = filtered.filter((job) => {
        const jobCategories = Array.isArray(job.categories) ? job.categories : []
        return selectedIndustries.some((industryKey) => {
          const industryName = getCategoryDisplayName(industryKey)
          return jobCategories.some((category) => category === industryName)
        })
      })
    }

    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
        break
      case "salary-high":
        filtered.sort((a, b) => extractSalaryValue(b.salary) - extractSalaryValue(a.salary))
        break
      case "salary-low":
        filtered.sort((a, b) => extractSalaryValue(a.salary) - extractSalaryValue(b.salary))
        break
    }

    setFilteredJobs(filtered)
    setCurrentPage(1)
  }

  const getSelectedCategories = () => {
    return selectedIndustries
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  const handleLocationFilter = (location: string) => {
    setLocationFilter(location)
  }

  const handleSort = (sort: string) => {
    setSortBy(sort)
  }

  const handlePageChange = (newPage: number) => {
    console.log("[v0] Page changing from", currentPage, "to", newPage)
    setCurrentPage(newPage)

    setTimeout(() => {
      const scrollPosition = window.innerHeight * 0.35

      // Custom slower scroll animation
      const startPosition = window.pageYOffset
      const distance = scrollPosition - startPosition
      const duration = 800 // Slower animation duration (800ms instead of default)
      let start: number | null = null

      function step(timestamp: number) {
        if (!start) start = timestamp
        const progress = Math.min((timestamp - start) / duration, 1)

        // Easing function for smoother animation
        const easeInOutCubic =
          progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2

        window.scrollTo(0, startPosition + distance * easeInOutCubic)

        if (progress < 1) {
          requestAnimationFrame(step)
        }
      }

      requestAnimationFrame(step)

      console.log(
        "[v0] Scrolled to 35% down page, target position:",
        scrollPosition,
        "current position:",
        window.pageYOffset,
      )
    }, 50)
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

  const uniqueLocations = Array.from(new Set(jobs.map((job) => job.location.split(",")[0].trim()))).sort()
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
      case "postdoc":
        return <GraduationCapIcon className="h-4 w-4" />
      case "professor":
        return <BriefcaseIcon className="h-4 w-4" />
      case "trading":
        return <BriefcaseIcon className="h-4 w-4" />
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
      case "postdoc":
        return "Post-doc"
      case "professor":
        return "Professor"
      case "trading":
        return "Trading (Commodities, Weather, Energy)"
      default:
        return category.charAt(0).toUpperCase() + category.slice(1)
    }
  }

  const toggleJobExpansion = (jobId: string) => {
    console.log("[v0] Toggling job expansion for ID:", jobId)
    console.log("[v0] Current expanded jobs:", Array.from(expandedJobs))

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
    console.log("[v0] New expanded jobs:", Array.from(newExpanded))
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

  const toggleIndustry = (industryKey: string) => {
    setSelectedIndustries((prev) =>
      prev.includes(industryKey) ? prev.filter((i) => i !== industryKey) : [...prev, industryKey],
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div
        className="relative h-64 bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center"
        style={{
          backgroundImage: `url("/sky-clouds.png")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-primary/60"></div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Applied Science Jobs</h1>
          <p className="text-xl mb-6 opacity-90">
            Fresh updates at least twice a week, so you’re never late to the party.
          </p>
        </div>
        <div className="absolute bottom-4 right-4">
          <button
            onClick={() => onPageChange?.("job-notifications")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-lg flex items-center gap-2"
          >
            ☁️ Speed Matters → Get Job Notifications
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

          <div className="flex flex-wrap gap-4 items-center mb-4">
            <div className="flex items-center gap-2">
              <SortAsc className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Sort by:</span>
              <Select value={sortBy} onValueChange={handleSort}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="salary-high">Salary (High to Low)</SelectItem>
                  <SelectItem value="salary-low">Salary (Low to High)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Select value={locationFilter} onValueChange={handleLocationFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {uniqueLocations.map((location) => (
                  <SelectItem key={location} value={location.toLowerCase()}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant={showFavoritesOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className="flex items-center gap-2"
            >
              <Heart className={`h-4 w-4 ${showFavoritesOnly ? "fill-current" : ""}`} />
              {showFavoritesOnly ? "Show All" : `Favorites (${favoriteJobs.size})`}
            </Button>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">Industries:</div>
            <div className="flex flex-wrap gap-2">
              {standardIndustries.map((industry) => (
                <Button
                  key={industry.key}
                  variant={selectedIndustries.includes(industry.key) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleIndustry(industry.key)}
                  className="flex items-center gap-2"
                >
                  {getCategoryIcon(industry.key)}
                  {industry.name}
                </Button>
              ))}
              {selectedIndustries.length > 0 && (
                <Button variant="ghost" size="sm" onClick={() => setSelectedIndustries([])}>
                  Clear All
                </Button>
              )}
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
                    size="sm"
                    onClick={() => {
                      setShowMatches(true)
                      applyFiltersAndSort()
                    }}
                  >
                    <Target className="mr-2 h-4 w-4" />
                    Show Matched Jobs
                  </Button>
                  <Button
                    variant={!showMatches ? "default" : "outline"}
                    onClick={() => {
                      setShowMatches(false)
                      applyFiltersAndSort()
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
            Showing {currentPage * jobsPerPage - jobsPerPage + 1}-
            {Math.min(currentPage * jobsPerPage, filteredJobs.length)} of {filteredJobs.length} jobs
          </div>
          {filteredJobs.length > jobsPerPage && (
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {Math.ceil(filteredJobs.length / jobsPerPage)}
            </div>
          )}
        </div>

        <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {" "}
          {/* Changed grid from 4 columns back to 3 columns for proper layout */}
          {filteredJobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage).map((job) => {
            const jobMatch = getJobMatch(job.id)
            const isExpanded = expandedJobs.has(job.id)
            const isFavorited = favoriteJobs.has(job.id)

            return (
              <Card key={job.id} id={`job-${job.id}`} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base mb-1 leading-tight">{job.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2 text-xs">
                        <Building2 className="h-3 w-3" />
                        {job.company}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" onClick={() => toggleFavorite(job.id)} className="p-1 h-6 w-6">
                        <Heart
                          className={`h-3 w-3 ${isFavorited ? "fill-red-500 text-red-500" : "text-muted-foreground hover:text-red-500"}`}
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
                          className="text-xs"
                        >
                          {jobMatch.matchScore}% match
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 pt-0">
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
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
                      {job.dateAdded}
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
                          <Badge
                            key={category}
                            variant="secondary"
                            className="text-xs"
                            style={{
                              backgroundColor: `${industryColors[category as keyof typeof industryColors]}20`,
                              color: industryColors[category as keyof typeof industryColors],
                            }}
                          >
                            {getCategoryDisplayName(category)}
                          </Badge>
                        ))
                      : job.category && (
                          <Badge
                            variant="secondary"
                            className="text-xs"
                            style={{
                              backgroundColor: `${industryColors[job.category as keyof typeof industryColors]}20`,
                              color: industryColors[job.category as keyof typeof industryColors],
                            }}
                          >
                            {getCategoryDisplayName(job.category)}
                          </Badge>
                        )}
                  </div>

                  {jobMatch && (
                    <div className="space-y-1">
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
                    <div className="space-y-2 pt-2 border-t">
                      <div>
                        <h4 className="font-medium text-xs mb-1">Description</h4>
                        <p className="text-xs text-muted-foreground">{job.description}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-xs mb-1">Requirements</h4>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {job.requirements.map((req, index) => (
                            <li key={index} className="flex items-start gap-1">
                              <span className="text-primary mt-0.5">•</span>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-xs mb-1">Skills</h4>
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

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1">
                      {job.contact && (
                        <Button variant="outline" size="sm" className="text-xs h-7 bg-transparent" asChild>
                          <a href={`mailto:${job.contact}`}>Contact</a>
                        </Button>
                      )}
                      {job.applicationLink && (
                        <Button variant="outline" size="sm" className="text-xs h-7 bg-transparent" asChild>
                          <a href={job.applicationLink} target="_blank" rel="noopener noreferrer">
                            Apply
                          </a>
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-7 bg-transparent"
                        onClick={() => copyJobLink(job.id)}
                      >
                        Share
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-7"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        toggleJobExpansion(job.id)
                      }}
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="h-3 w-3 mr-1" />
                          Less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-3 w-3 mr-1" />
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

        {filteredJobs.length > jobsPerPage && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            <div className="flex items-center gap-1">
              {currentPage > 3 && (
                <>
                  <Button
                    variant={1 === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(1)}
                  >
                    1
                  </Button>
                  {currentPage > 4 && <span className="px-2 text-muted-foreground">...</span>}
                </>
              )}

              {Array.from({ length: Math.min(5, Math.ceil(filteredJobs.length / jobsPerPage)) }, (_, i) => {
                const pageNum =
                  Math.max(1, Math.min(Math.ceil(filteredJobs.length / jobsPerPage) - 4, currentPage - 2)) + i
                if (pageNum > Math.ceil(filteredJobs.length / jobsPerPage)) return null

                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </Button>
                )
              })}

              {currentPage < Math.ceil(filteredJobs.length / jobsPerPage) - 2 && (
                <>
                  {currentPage < Math.ceil(filteredJobs.length / jobsPerPage) - 3 && (
                    <span className="px-2 text-muted-foreground">...</span>
                  )}
                  <Button
                    variant={Math.ceil(filteredJobs.length / jobsPerPage) === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(Math.ceil(filteredJobs.length / jobsPerPage))}
                  >
                    {Math.ceil(filteredJobs.length / jobsPerPage)}
                  </Button>
                </>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === Math.ceil(filteredJobs.length / jobsPerPage)}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

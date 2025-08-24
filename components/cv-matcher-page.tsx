"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CVUpload } from "@/components/cv-upload"
import {
  Shield,
  Target,
  TrendingUp,
  CheckCircle,
  Eye,
  MapPin,
  Clock,
  DollarSign,
  ExternalLink,
  Mail,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

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

export function CVMatcherPage() {
  const [cvData, setCvData] = useState<CVData | null>(null)
  const [jobMatches, setJobMatches] = useState<JobMatch[]>([])
  const [isMatching, setIsMatching] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)

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
      }
    } catch (error) {
      console.error("Job matching failed:", error)
    } finally {
      setIsMatching(false)
    }
  }

  const getMatchBadgeVariant = (score: number): "default" | "secondary" | "destructive" => {
    if (score >= 80) return "default"
    if (score >= 60) return "secondary"
    return "destructive"
  }

  const getMatchColor = (score: number): string => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Target className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-bold text-foreground">Match Maker CV</h1>
        </div>
        <p className="text-xl text-muted-foreground mb-6">
          Upload your CV and get AI-powered job matches in climate, weather, energy, academia, and geospatial fields
        </p>

        <Alert className="max-w-2xl mx-auto mb-8 border-primary/20 bg-primary/5">
          <Shield className="h-4 w-4" />
          <AlertDescription className="text-base font-medium">
            🔒 we do not keep your data :) your cv is processed securely and deleted immediately after analysis
          </AlertDescription>
        </Alert>
      </div>

      {/* CV Upload Section */}
      <div className="mb-12">
        <CVUpload onUploadComplete={handleCVUploadComplete} />
      </div>

      {/* CV Analysis Results */}
      {cvData && (
        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-primary" />
              CV Analysis Complete
            </CardTitle>
            <CardDescription className="text-base">
              Analyzed your CV and found {cvData.skills.length} skills, {cvData.experience.length} work experiences, and{" "}
              {cvData.yearsOfExperience} years of total experience.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Detected Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {cvData.skills.slice(0, 10).map((skill) => (
                    <Badge key={skill} variant="outline" className="text-sm">
                      {skill}
                    </Badge>
                  ))}
                  {cvData.skills.length > 10 && (
                    <Badge variant="outline" className="text-sm">
                      +{cvData.skills.length - 10} more
                    </Badge>
                  )}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Professional Summary</h3>
                <p className="text-sm text-muted-foreground line-clamp-3">{cvData.summary}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Matching Status */}
      {isMatching && (
        <Card className="mb-8">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
              <span className="text-lg font-medium">Analyzing job matches with AI...</span>
            </div>
            <p className="text-muted-foreground">
              This may take a few moments while we compare your profile with available positions.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Job Matches Results */}
      {jobMatches.length > 0 && !isMatching && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              Your AI-Matched Jobs ({jobMatches.length})
            </h2>
            <div className="text-sm text-muted-foreground">
              Best match: {jobMatches[0]?.matchScore}% • {jobMatches.filter((m) => m.matchScore >= 70).length} strong
              matches
            </div>
          </div>

          <div className="grid gap-6">
            {jobMatches.map((match) => {
              const job = match.job
              return (
                <Card key={job.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-primary/20">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl mb-2 flex items-center gap-2">
                          {job.title}
                          <Badge variant={getMatchBadgeVariant(match.matchScore)} className="text-sm">
                            {match.matchScore}% match
                          </Badge>
                        </CardTitle>
                        <CardDescription className="text-base font-medium text-foreground">
                          {job.company}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {job.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Match Analysis */}
                    <div className="mb-4 p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Target className="h-4 w-4 text-primary" />
                        <span className="font-medium">Match Analysis</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Skills Match</div>
                          <div className="flex items-center gap-2">
                            <Progress value={match.skillsMatch} className="h-2 flex-1" />
                            <span className="text-xs font-medium">{match.skillsMatch}%</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Experience Match</div>
                          <div className="flex items-center gap-2">
                            <Progress value={match.experienceMatch} className="h-2 flex-1" />
                            <span className="text-xs font-medium">{match.experienceMatch}%</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Role Fit</div>
                          <div className="flex items-center gap-2">
                            <Progress value={match.titleMatch} className="h-2 flex-1" />
                            <span className="text-xs font-medium">{match.titleMatch}%</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium mb-1">Why this matches:</div>
                        <div className="text-sm text-muted-foreground">
                          {match.matchReasons.slice(0, 2).join(" • ")}
                        </div>
                      </div>
                    </div>

                    {/* Job Details */}
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
                      {job.remote && (
                        <Badge variant="secondary" className="text-xs">
                          Remote
                        </Badge>
                      )}
                    </div>

                    <p className="text-muted-foreground mb-4 line-clamp-2">{job.description}</p>

                    {/* Skills */}
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

                    {/* Actions */}
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
                                <Badge variant={getMatchBadgeVariant(match.matchScore)}>
                                  {match.matchScore}% match
                                </Badge>
                              </DialogTitle>
                              <DialogDescription className="text-lg font-medium text-foreground">
                                {job.company} • {job.location}
                              </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6">
                              {/* Match Analysis in Modal */}
                              <div className="p-4 bg-muted/50 rounded-lg">
                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                  <Target className="h-4 w-4" />
                                  Detailed Match Analysis
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
                                  <div className="text-sm font-medium mb-1">Match reasons:</div>
                                  <ul className="text-sm text-muted-foreground space-y-1">
                                    {match.matchReasons.map((reason, index) => (
                                      <li key={index}>• {reason}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>

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
                                <div className="flex gap-2">
                                  {job.contact && (
                                    <Button variant="outline" size="sm" asChild>
                                      <a href={`mailto:${job.contact}`}>
                                        <Mail className="mr-2 h-4 w-4" />
                                        Contact
                                      </a>
                                    </Button>
                                  )}
                                  {job.applicationLink && (
                                    <Button size="sm" asChild>
                                      <a href={job.applicationLink} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="mr-2 h-4 w-4" />
                                        Apply Now
                                      </a>
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        {job.contact && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={`mailto:${job.contact}`}>
                              <Mail className="mr-2 h-4 w-4" />
                              Contact
                            </a>
                          </Button>
                        )}
                        {job.applicationLink && (
                          <Button size="sm" asChild>
                            <a href={job.applicationLink} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Apply Now
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* No matches state */}
      {cvData && !isMatching && jobMatches.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No matches found</h3>
            <p className="text-muted-foreground">
              We couldn't find any strong matches for your profile. Try uploading a different CV or check back later for
              new job postings.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

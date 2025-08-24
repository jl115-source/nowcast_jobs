"use client"

import type React from "react"

import { useState } from "react"
import { Upload, FileText, Sparkles, Download, CheckCircle, AlertCircle, Loader2, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface CVImprovementSuggestion {
  section: string
  priority: "high" | "medium" | "low"
  issue: string
  suggestion: string
  example?: string
}

interface CVAnalysis {
  fileName: string
  overallScore: number
  strengths: string[]
  weaknesses: string[]
  suggestions: CVImprovementSuggestion[]
  atsScore: number
  industryAlignment: number
  improvedVersion: string
  keywordSuggestions: string[]
}

export function CVImproverPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<CVAnalysis | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileSelect(files[0])
    }
  }

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.type === "application/pdf" || selectedFile.name.endsWith(".pdf")) {
      setFile(selectedFile)
      setAnalysis(null)
    } else {
      alert("Please select a PDF file")
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      handleFileSelect(files[0])
    }
  }

  const analyzeCV = async () => {
    if (!file) return

    setIsAnalyzing(true)
    try {
      // First extract text from PDF
      const formData = new FormData()
      formData.append("file", file)

      const extractResponse = await fetch("/api/extract-pdf", {
        method: "POST",
        body: formData,
      })

      if (!extractResponse.ok) {
        throw new Error("Failed to extract text from PDF")
      }

      const { text } = await extractResponse.json()

      // Then analyze and improve CV
      const improveResponse = await fetch("/api/improve-cv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cvText: text,
          fileName: file.name,
        }),
      })

      if (!improveResponse.ok) {
        throw new Error("Failed to analyze CV")
      }

      const analysisResult = await improveResponse.json()
      setAnalysis(analysisResult)
    } catch (error) {
      console.error("CV analysis failed:", error)
      alert("Failed to analyze CV. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

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
        <div className="absolute inset-0 bg-primary/40"></div>
        <div className="relative z-10 py-16 px-8 text-white">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Sparkles className="h-7 w-7" />
            </div>
            <h1 className="text-5xl font-bold">CV Improver</h1>
          </div>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            AI-powered CV analysis and improvement for climate, weather, energy, academia, and geospatial careers
          </p>
        </div>
      </div>

      <Alert className="mb-8 border-primary/20 bg-primary/5">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          🔒 we do not keep your data :) your cv is processed securely and deleted immediately after analysis.
        </AlertDescription>
      </Alert>

      {!analysis ? (
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Your CV
              </CardTitle>
              <CardDescription>
                Upload your CV in PDF format for AI-powered analysis and improvement suggestions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">{file ? file.name : "Drag and drop your CV here"}</p>
                <p className="text-muted-foreground mb-4">
                  {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "or click to browse files"}
                </p>
                <input type="file" accept=".pdf" onChange={handleFileInput} className="hidden" id="cv-upload" />
                <label htmlFor="cv-upload">
                  <Button variant="outline" className="cursor-pointer bg-transparent">
                    Choose File
                  </Button>
                </label>
              </div>

              {file && (
                <div className="mt-6">
                  <Button onClick={analyzeCV} disabled={isAnalyzing} className="w-full">
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing CV...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Analyze & Improve CV
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-8">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                CV Analysis Complete
              </CardTitle>
              <CardDescription>
                Your CV has been analyzed and improved using AI. Review the suggestions below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                    {analysis.overallScore}%
                  </div>
                  <div className="text-sm text-muted-foreground">Overall Score</div>
                  <Progress value={analysis.overallScore} className="mt-2" />
                </div>
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getScoreColor(analysis.atsScore)}`}>{analysis.atsScore}%</div>
                  <div className="text-sm text-muted-foreground">ATS Compatibility</div>
                  <Progress value={analysis.atsScore} className="mt-2" />
                </div>
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getScoreColor(analysis.industryAlignment)}`}>
                    {analysis.industryAlignment}%
                  </div>
                  <div className="text-sm text-muted-foreground">Industry Alignment</div>
                  <Progress value={analysis.industryAlignment} className="mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="suggestions" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
              <TabsTrigger value="strengths">Strengths</TabsTrigger>
              <TabsTrigger value="keywords">Keywords</TabsTrigger>
              <TabsTrigger value="improved">Improved Version</TabsTrigger>
            </TabsList>

            <TabsContent value="suggestions" className="space-y-4">
              <h3 className="text-xl font-semibold mb-4">Improvement Suggestions</h3>
              {analysis.suggestions.map((suggestion, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{suggestion.section}</CardTitle>
                      <Badge className={getPriorityColor(suggestion.priority)}>{suggestion.priority} priority</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-red-600 mb-1">Issue:</h4>
                        <p className="text-sm text-muted-foreground">{suggestion.issue}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-green-600 mb-1">Suggestion:</h4>
                        <p className="text-sm">{suggestion.suggestion}</p>
                      </div>
                      {suggestion.example && (
                        <div>
                          <h4 className="font-medium text-blue-600 mb-1">Example:</h4>
                          <p className="text-sm italic bg-muted/50 p-2 rounded">{suggestion.example}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="strengths" className="space-y-4">
              <h3 className="text-xl font-semibold mb-4">Your CV Strengths</h3>
              <div className="grid gap-4">
                {analysis.strengths.map((strength, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm">{strength}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="keywords" className="space-y-4">
              <h3 className="text-xl font-semibold mb-4">Recommended Keywords</h3>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Industry-Specific Keywords
                  </CardTitle>
                  <CardDescription>
                    Add these keywords to improve ATS compatibility and industry relevance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {analysis.keywordSuggestions.map((keyword, index) => (
                      <Badge key={index} variant="outline" className="text-sm">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="improved" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">AI-Improved Version</h3>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download Improved CV
                </Button>
              </div>
              <Card>
                <CardContent className="p-6">
                  <div className="prose max-w-none">
                    <pre className="whitespace-pre-wrap text-sm bg-muted/50 p-4 rounded-lg overflow-auto max-h-96">
                      {analysis.improvedVersion}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-center">
            <Button
              onClick={() => {
                setFile(null)
                setAnalysis(null)
              }}
              variant="outline"
            >
              Analyze Another CV
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

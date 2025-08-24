"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Upload, FileText, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface CVUploadProps {
  onUploadComplete?: (cvData: CVData) => void
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

export function CVUpload({ onUploadComplete }: CVUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [cvData, setCvData] = useState<CVData | null>(null)
  const [currentStep, setCurrentStep] = useState("")

  const validateFile = (file: File): string | null => {
    if (file.type !== "application/pdf") {
      return "Please upload a PDF file only."
    }
    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      return "File size must be less than 10MB."
    }
    return null
  }

  const processFileWithAI = async (file: File): Promise<CVData> => {
    // Step 1: Extract text from PDF
    setCurrentStep("Extracting text from PDF...")
    setUploadProgress(20)

    const formData = new FormData()
    formData.append("file", file)

    const extractResponse = await fetch("/api/extract-pdf", {
      method: "POST",
      body: formData,
    })

    if (!extractResponse.ok) {
      const error = await extractResponse.json()
      throw new Error(error.error || "Failed to extract PDF text")
    }

    const { text } = await extractResponse.json()
    setUploadProgress(50)

    // Step 2: Analyze CV with AI
    setCurrentStep("Analyzing CV with AI...")
    setUploadProgress(70)

    const analysisResponse = await fetch("/api/analyze-cv", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    })

    if (!analysisResponse.ok) {
      const error = await analysisResponse.json()
      throw new Error(error.error || "Failed to analyze CV")
    }

    const { analysis } = await analysisResponse.json()
    setUploadProgress(90)

    setCurrentStep("Finalizing analysis...")
    setUploadProgress(100)

    return {
      fileName: file.name,
      fileSize: file.size,
      uploadDate: new Date().toISOString(),
      extractedText: text,
      skills: analysis.skills,
      experience: analysis.experience,
      education: analysis.education,
      summary: analysis.summary,
      yearsOfExperience: analysis.yearsOfExperience,
      jobTitles: analysis.jobTitles,
    }
  }

  const handleFileUpload = async (file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      setErrorMessage(validationError)
      setUploadStatus("error")
      return
    }

    setUploadedFile(file)
    setIsUploading(true)
    setUploadStatus("idle")
    setUploadProgress(0)
    setErrorMessage("")
    setCurrentStep("Starting analysis...")

    try {
      const processedData = await processFileWithAI(file)
      setCvData(processedData)
      setUploadStatus("success")
      setCurrentStep("Analysis complete!")
      onUploadComplete?.(processedData)
    } catch (error) {
      console.error("CV processing error:", error)
      setErrorMessage(error instanceof Error ? error.message : "Failed to process CV. Please try again.")
      setUploadStatus("error")
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const resetUpload = () => {
    setUploadedFile(null)
    setUploadProgress(0)
    setIsUploading(false)
    setUploadStatus("idle")
    setErrorMessage("")
    setCvData(null)
    setCurrentStep("")
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
          <Upload className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-lg">Upload Your CV</CardTitle>
        <CardDescription>Get AI-powered job matches based on your experience</CardDescription>
      </CardHeader>
      <CardContent>
        {!uploadedFile && uploadStatus !== "success" && (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
              isDragOver
                ? "border-primary bg-primary/5"
                : "border-primary/30 hover:border-primary/50 hover:bg-primary/5"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => document.getElementById("cv-file-input")?.click()}
          >
            <FileText className="h-12 w-12 text-primary/60 mx-auto mb-4" />
            <p className="text-sm text-muted-foreground mb-2">
              {isDragOver ? "Drop your CV here" : "Drag and drop your CV here, or click to browse"}
            </p>
            <p className="text-xs text-muted-foreground">PDF files only, max 10MB</p>
            <input id="cv-file-input" type="file" accept=".pdf" onChange={handleFileSelect} className="hidden" />
          </div>
        )}

        {uploadedFile && uploadStatus !== "success" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium text-sm">{uploadedFile.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(uploadedFile.size)}</p>
                </div>
              </div>
              {!isUploading && (
                <Button variant="ghost" size="sm" onClick={resetUpload}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {isUploading && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-sm">{currentStep}</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-xs text-muted-foreground text-center">{uploadProgress}% complete</p>
              </div>
            )}
          </div>
        )}

        {uploadStatus === "success" && cvData && (
          <div className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>CV uploaded and processed successfully!</AlertDescription>
            </Alert>

            <div className="p-4 bg-muted rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="font-medium text-sm">{cvData.fileName}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={resetUpload}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Detected Skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {cvData.skills.slice(0, 4).map((skill) => (
                      <span key={skill} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md">
                        {skill}
                      </span>
                    ))}
                    {cvData.skills.length > 4 && (
                      <span className="px-2 py-1 bg-muted-foreground/10 text-muted-foreground text-xs rounded-md">
                        +{cvData.skills.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Experience:</p>
                  <p className="text-xs text-muted-foreground">
                    {cvData.yearsOfExperience} years • {cvData.experience.length} positions
                  </p>
                </div>

                {cvData.summary && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Summary:</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{cvData.summary}</p>
                  </div>
                )}
              </div>
            </div>

            <Button className="w-full" size="lg">
              Find Matching Jobs
            </Button>
          </div>
        )}

        {uploadStatus === "error" && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, ExternalLink, Mail, Square, Trash2, ZoomIn, ZoomOut } from "lucide-react"

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
  contact: string
  applicationLink: string
  coordinates: {
    lat: number
    lng: number
  }
}

interface JobMapProps {
  jobs: Job[]
  selectedCategories: string[]
  selectedCountries: string[]
  onJobSelect?: (job: Job) => void
  onBoundsChange?: (bounds: any) => void
}

export function JobMap({ jobs, selectedCategories, selectedCountries, onJobSelect }: JobMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [drawMode, setDrawMode] = useState(false)
  const [drawnArea, setDrawnArea] = useState<{ x: number; y: number; width: number; height: number } | null>(null)
  const [filteredByArea, setFilteredByArea] = useState<Job[]>([])
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawStart, setDrawStart] = useState({ x: 0, y: 0 })

  // Filter jobs based on selected categories and countries
  const filteredJobs = jobs.filter((job) => {
    const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(job.category)
    const countryMatch =
      selectedCountries.length === 0 ||
      selectedCountries.some((country) => job.location.toLowerCase().includes(country.toLowerCase()))
    return categoryMatch && countryMatch
  })

  // Convert lat/lng to screen coordinates
  const latLngToScreen = (lat: number, lng: number) => {
    const mapWidth = 800
    const mapHeight = 400

    // Simple mercator projection
    const x = ((lng + 180) / 360) * mapWidth
    const y = ((90 - lat) / 180) * mapHeight

    return {
      x: x * zoom + pan.x,
      y: y * zoom + pan.y,
    }
  }

  // Check if point is in drawn area
  const isPointInArea = (job: Job) => {
    if (!drawnArea) return true

    const point = latLngToScreen(job.coordinates.lat, job.coordinates.lng)
    return (
      point.x >= drawnArea.x &&
      point.x <= drawnArea.x + drawnArea.width &&
      point.y >= drawnArea.y &&
      point.y <= drawnArea.y + drawnArea.height
    )
  }

  // Get jobs to display (filtered by area if drawn)
  const jobsToShow = drawnArea ? filteredJobs.filter(isPointInArea) : filteredJobs

  // Group nearby jobs for clustering
  const clusterJobs = (jobs: Job[]) => {
    const clusters: { jobs: Job[]; x: number; y: number }[] = []
    const processed = new Set<string>()

    jobs.forEach((job) => {
      if (processed.has(job.id)) return

      const point = latLngToScreen(job.coordinates.lat, job.coordinates.lng)
      const cluster = { jobs: [job], x: point.x, y: point.y }
      processed.add(job.id)

      // Find nearby jobs (within 30px)
      jobs.forEach((otherJob) => {
        if (processed.has(otherJob.id)) return

        const otherPoint = latLngToScreen(otherJob.coordinates.lat, otherJob.coordinates.lng)
        const distance = Math.sqrt(Math.pow(point.x - otherPoint.x, 2) + Math.pow(point.y - otherPoint.y, 2))

        if (distance < 30) {
          cluster.jobs.push(otherJob)
          processed.add(otherJob.id)
        }
      })

      clusters.push(cluster)
    })

    return clusters
  }

  const clusters = clusterJobs(jobsToShow)

  const getCategoryColor = (category: string) => {
    const colors = {
      climate: "#3b82f6",
      weather: "#06b6d4",
      energy: "#10b981",
      academia: "#8b5cf6",
      geospatial: "#f59e0b",
      insurance: "#ef4444",
    }
    return colors[category as keyof typeof colors] || "#6b7280"
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = mapContainer.current?.getBoundingClientRect()
    if (!rect) return

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (drawMode) {
      setIsDrawing(true)
      setDrawStart({ x, y })
      setDrawnArea({ x, y, width: 0, height: 0 })
    } else {
      setIsDragging(true)
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDrawing && drawMode) {
      const rect = mapContainer.current?.getBoundingClientRect()
      if (!rect) return

      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      setDrawnArea({
        x: Math.min(drawStart.x, x),
        y: Math.min(drawStart.y, y),
        width: Math.abs(x - drawStart.x),
        height: Math.abs(y - drawStart.y),
      })
    } else if (isDragging && !drawMode) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }

  const handleMouseUp = () => {
    if (isDrawing) {
      setIsDrawing(false)
      setDrawMode(false)
      setFilteredByArea(jobsToShow)
    }
    setIsDragging(false)
  }

  const startDrawing = () => {
    setDrawMode(true)
  }

  const clearDrawing = () => {
    setDrawnArea(null)
    setFilteredByArea([])
    setDrawMode(false)
  }

  const zoomIn = () => {
    setZoom((prev) => Math.min(prev * 1.2, 3))
  }

  const zoomOut = () => {
    setZoom((prev) => Math.max(prev / 1.2, 0.5))
  }

  return (
    <div className="relative w-full h-full">
      <div
        ref={mapContainer}
        className="w-full h-full bg-slate-900 rounded-lg overflow-hidden cursor-move relative"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, #1e40af 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, #059669 0%, transparent 50%),
            linear-gradient(135deg, #0f172a 0%, #1e293b 100%)
          `,
          backgroundSize: "400px 400px, 400px 400px, 100% 100%",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
            transform: `translate(${pan.x % 50}px, ${pan.y % 50}px)`,
          }}
        />

        {/* Job clusters */}
        {clusters.map((cluster, index) => (
          <div
            key={index}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            style={{
              left: cluster.x,
              top: cluster.y,
              zIndex: 10,
            }}
            onClick={() => {
              if (cluster.jobs.length === 1) {
                setSelectedJob(cluster.jobs[0])
                onJobSelect?.(cluster.jobs[0])
              }
            }}
          >
            {cluster.jobs.length > 1 ? (
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium border-2 border-white shadow-lg">
                {cluster.jobs.length}
              </div>
            ) : (
              <div
                className="w-4 h-4 rounded-full border-2 border-white shadow-lg"
                style={{ backgroundColor: getCategoryColor(cluster.jobs[0].category) }}
              />
            )}
          </div>
        ))}

        {/* Drawn area */}
        {drawnArea && (
          <div
            className="absolute border-2 border-primary bg-primary/10 pointer-events-none"
            style={{
              left: drawnArea.x,
              top: drawnArea.y,
              width: drawnArea.width,
              height: drawnArea.height,
            }}
          />
        )}
      </div>

      {/* Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={zoomIn}
            className="bg-card/95 backdrop-blur-sm border-border w-8 h-8 p-0"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={zoomOut}
            className="bg-card/95 backdrop-blur-sm border-border w-8 h-8 p-0"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
        </div>
        <Button
          size="sm"
          variant={drawMode ? "default" : "outline"}
          onClick={startDrawing}
          disabled={drawMode}
          className="bg-card/95 backdrop-blur-sm border-border"
        >
          <Square className="h-4 w-4 mr-1" />
          {drawMode ? "Drawing..." : "Draw Area"}
        </Button>
        {drawnArea && (
          <Button
            size="sm"
            variant="outline"
            onClick={clearDrawing}
            className="bg-card/95 backdrop-blur-sm border-border"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {drawnArea && (
        <div className="absolute top-4 left-4 bg-primary/90 backdrop-blur-sm rounded-lg p-2 text-xs text-primary-foreground z-20">
          Showing {jobsToShow.length} jobs in selected area
        </div>
      )}

      {/* Job popup */}
      {selectedJob && (
        <Card className="absolute top-16 left-4 w-80 p-4 bg-card/95 backdrop-blur-sm border-border z-20">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-sm">{selectedJob.title}</h3>
                <p className="text-muted-foreground text-xs">{selectedJob.company}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedJob(null)} className="h-6 w-6 p-0">
                ×
              </Button>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {selectedJob.location}
              {selectedJob.remote && (
                <Badge variant="secondary" className="text-xs">
                  Remote
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Badge className="text-xs" style={{ backgroundColor: getCategoryColor(selectedJob.category) }}>
                {selectedJob.category}
              </Badge>
              <span className="text-xs font-medium">{selectedJob.salary}</span>
            </div>

            <p className="text-xs text-muted-foreground line-clamp-2">{selectedJob.description}</p>

            <div className="flex gap-2">
              <Button size="sm" className="flex-1 h-8 text-xs" asChild>
                <a href={selectedJob.applicationLink} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Apply
                </a>
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-xs bg-transparent" asChild>
                <a href={`mailto:${selectedJob.contact}`}>
                  <Mail className="h-3 w-3" />
                </a>
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Map controls info */}
      <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-sm rounded-lg p-2 text-xs text-muted-foreground">
        Drag to pan • Click markers for details • Draw area to filter jobs • Use zoom controls
      </div>
    </div>
  )
}

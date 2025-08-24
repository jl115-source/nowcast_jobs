"use client"
import { useEffect, useRef, useState } from "react"

interface Job {
  id: string
  title: string
  company: string
  location: string
  type: string
  salary: string
  categories: string[]
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
}

export function JobMap({ jobs, selectedCategories, selectedCountries, onJobSelect }: JobMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const filteredJobs = jobs.filter((job) => {
    const categoryMatch =
      selectedCategories.length === 0 || selectedCategories.some((selectedCat) => job.categories.includes(selectedCat))
    const countryMatch =
      selectedCountries.length === 0 ||
      selectedCountries.some((country) => job.location.toLowerCase().includes(country.toLowerCase()))
    return categoryMatch && countryMatch
  })

  const getCategoryColor = (category: string) => {
    const colors = {
      "Academia & Research": "#8b5cf6",
      "Banking & Finance": "#ec4899",
      "Climate Science": "#3b82f6",
      "Energy & Renewables": "#10b981",
      "Geophysics & Geology": "#f97316",
      "Geospatial & GIS": "#f59e0b",
      "Insurance & Reinsurance": "#ef4444",
      "Tech (Data Science & ML)": "#8b5cf6",
      "Weather & Meteorology": "#06b6d4",
    }
    return colors[category as keyof typeof colors] || "#6b7280"
  }

  useEffect(() => {
    const initializeMap = async () => {
      try {
        // Load Leaflet CSS
        if (!document.querySelector('link[href*="leaflet"]')) {
          const link = document.createElement("link")
          link.rel = "stylesheet"
          link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          document.head.appendChild(link)
        }

        // Load Leaflet JS
        if (!(window as any).L) {
          await new Promise((resolve, reject) => {
            const script = document.createElement("script")
            script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
            script.onload = resolve
            script.onerror = reject
            document.head.appendChild(script)
          })
        }

        const L = (window as any).L
        if (!L || !mapRef.current) return

        // Initialize map
        mapInstanceRef.current = L.map(mapRef.current).setView([40.0, 0.0], 2)

        // Add OpenStreetMap tiles
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
        }).addTo(mapInstanceRef.current)

        setIsLoading(false)
      } catch (error) {
        console.error("Failed to load map:", error)
        setIsLoading(false)
      }
    }

    initializeMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!mapInstanceRef.current || isLoading) return

    const L = (window as any).L
    if (!L) return

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current = []

    // Add new markers
    filteredJobs.forEach((job) => {
      const marker = L.circleMarker([job.coordinates.lat, job.coordinates.lng], {
        radius: 8,
        fillColor: getCategoryColor(job.categories[0]),
        color: "#ffffff",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8,
      }).addTo(mapInstanceRef.current)

      // Add popup
      const popupContent = `
        <div class="p-2 min-w-[200px]">
          <h3 class="font-semibold text-sm mb-1">${job.title}</h3>
          <p class="text-xs text-gray-600 mb-2">${job.company}</p>
          <p class="text-xs mb-2">${job.location}</p>
          <p class="text-xs font-medium mb-2">${job.salary}</p>
          <div class="flex gap-1 mb-2">
            ${job.categories.map((cat) => `<span class="text-xs px-1 py-0.5 bg-blue-100 rounded">${cat}</span>`).join("")}
          </div>
          <div class="flex gap-2">
            <a href="${job.applicationLink}" target="_blank" class="text-xs bg-blue-500 text-white px-2 py-1 rounded">Apply</a>
            <a href="mailto:${job.contact}" class="text-xs bg-gray-500 text-white px-2 py-1 rounded">Contact</a>
          </div>
        </div>
      `

      marker.bindPopup(popupContent)

      marker.on("click", () => {
        setSelectedJob(job)
        onJobSelect?.(job)
      })

      markersRef.current.push(marker)
    })
  }, [filteredJobs, isLoading])

  if (isLoading) {
    return (
      <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading map...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full rounded-lg" />

      {/* Info panel */}
      <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-sm rounded-lg p-2 text-xs text-muted-foreground border">
        Click markers to view job details • Showing {filteredJobs.length} jobs
      </div>
    </div>
  )
}

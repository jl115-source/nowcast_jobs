"use client"
import { useState } from "react"

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
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)

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

  const getRegionPosition = (location: string) => {
    const regions = {
      london: { x: 52, y: 35 },
      "new york": { x: 25, y: 40 },
      "san francisco": { x: 15, y: 45 },
      boston: { x: 28, y: 42 },
      houston: { x: 22, y: 55 },
      denver: { x: 20, y: 48 },
      chicago: { x: 25, y: 45 },
      washington: { x: 28, y: 45 },
      paris: { x: 52, y: 38 },
      berlin: { x: 55, y: 35 },
      zurich: { x: 54, y: 38 },
      singapore: { x: 75, y: 70 },
      tokyo: { x: 85, y: 45 },
      sydney: { x: 85, y: 80 },
      toronto: { x: 25, y: 38 },
      vancouver: { x: 18, y: 35 },
    }

    const locationKey = location.toLowerCase().split(",")[0].trim()
    return regions[locationKey as keyof typeof regions] || { x: 50, y: 50 }
  }

  return (
    <div className="relative w-full h-full bg-blue-50 dark:bg-blue-900 rounded-lg overflow-hidden border">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-200 to-blue-100 dark:from-blue-800 dark:to-blue-700">
        {/* Continents as simple colored shapes */}
        <div
          className="absolute top-[30%] left-[15%] w-[25%] h-[35%] bg-green-300 dark:bg-green-600 rounded-lg opacity-60"
          title="North America"
        />
        <div
          className="absolute top-[60%] left-[20%] w-[15%] h-[25%] bg-green-300 dark:bg-green-600 rounded-lg opacity-60"
          title="South America"
        />
        <div
          className="absolute top-[25%] left-[45%] w-[20%] h-[40%] bg-green-300 dark:bg-green-600 rounded-lg opacity-60"
          title="Europe & Africa"
        />
        <div
          className="absolute top-[20%] left-[70%] w-[25%] h-[45%] bg-green-300 dark:bg-green-600 rounded-lg opacity-60"
          title="Asia"
        />
        <div
          className="absolute top-[75%] left-[80%] w-[15%] h-[15%] bg-green-300 dark:bg-green-600 rounded-lg opacity-60"
          title="Australia"
        />
      </div>

      {/* Job markers */}
      {filteredJobs.map((job) => {
        const position = getRegionPosition(job.location)
        return (
          <div
            key={job.id}
            className="absolute w-6 h-6 rounded-full cursor-pointer transform -translate-x-3 -translate-y-3 hover:scale-125 transition-all duration-200 border-2 border-white shadow-lg z-10 flex items-center justify-center text-white text-xs font-bold"
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
              backgroundColor: getCategoryColor(job.categories[0]),
            }}
            onClick={() => {
              setSelectedJob(job)
              onJobSelect?.(job)
            }}
            title={`${job.title} at ${job.company}`}
          >
            {job.categories.length}
          </div>
        )
      })}

      {/* Job details popup */}
      {selectedJob && (
        <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 border rounded-lg p-4 shadow-xl max-w-xs z-20">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-sm">{selectedJob.title}</h3>
            <button
              onClick={() => setSelectedJob(null)}
              className="text-gray-500 hover:text-gray-700 ml-2 text-lg leading-none"
            >
              ×
            </button>
          </div>
          <div className="space-y-2 text-sm">
            <p className="text-gray-600 dark:text-gray-300 font-medium">{selectedJob.company}</p>
            <p className="text-xs text-gray-500">{selectedJob.location}</p>
            <p className="text-xs font-medium text-green-600">{selectedJob.salary}</p>
            <div className="flex flex-wrap gap-1">
              {selectedJob.categories.map((cat, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: `${getCategoryColor(cat)}20`,
                    color: getCategoryColor(cat),
                  }}
                >
                  {cat}
                </span>
              ))}
            </div>
            <div className="flex gap-2 pt-2">
              {selectedJob.applicationLink && (
                <a
                  href={selectedJob.applicationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                >
                  Apply
                </a>
              )}
              {selectedJob.contact && (
                <a
                  href={`mailto:${selectedJob.contact}`}
                  className="text-xs bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition-colors"
                >
                  Contact
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Map info */}
      <div className="absolute bottom-4 left-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg p-3 text-sm border shadow-lg">
        <p className="text-gray-600 dark:text-gray-300">
          🗺️ Showing {filteredJobs.length} jobs • Click markers for details
        </p>
      </div>

      {/* Legend */}
      <div className="absolute top-4 left-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg p-3 text-xs border shadow-lg max-w-48">
        <h4 className="font-semibold mb-2">Industries</h4>
        <div className="space-y-1">
          {Array.from(new Set(filteredJobs.flatMap((job) => job.categories)))
            .slice(0, 5)
            .map((category) => (
              <div key={category} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: getCategoryColor(category) }}
                />
                <span className="text-gray-600 dark:text-gray-300 text-xs truncate">{category}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

"use client"
import { Button } from "@/components/ui/button"

interface NavigationProps {
  currentPage: string
  onPageChange: (page: string) => void
}

export function Navigation({ currentPage, onPageChange }: NavigationProps) {
  const pages = [
    { id: "jobs", label: "Job Board" },
    { id: "matcher", label: "Match Maker CV" },
    { id: "contact", label: "Contact" },
  ]

  return (
    <nav className="border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex-shrink-0">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-primary-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.4 4.4 0 003 15z"
                    />
                  </svg>
                </div>
                <h1 className="text-xl font-bold text-foreground">Nowcast Jobs</h1>
              </div>
            </div>
            <div className="flex space-x-4">
              {pages.map((page) => (
                <Button
                  key={page.id}
                  variant={currentPage === page.id ? "default" : "ghost"}
                  onClick={() => onPageChange(page.id)}
                  className="text-sm font-medium"
                >
                  {page.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

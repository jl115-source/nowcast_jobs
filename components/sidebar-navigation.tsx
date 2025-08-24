"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Zap,
  Phone,
  Calendar,
  Users,
  ChevronDown,
  ChevronUp,
  EyeOff,
  Building2,
} from "lucide-react"

interface SidebarNavigationProps {
  currentPage: string
  onPageChange: (page: string) => void
}

export function SidebarNavigation({ currentPage, onPageChange }: SidebarNavigationProps) {
  const [isMinimized, setIsMinimized] = useState(false)
  const [isJobDropdownOpen, setIsJobDropdownOpen] = useState(true) // Set Jobs dropdown to be open by default

  const pages = [
    { id: "conferences", label: "Conferences & Events", icon: Calendar },
    { id: "companies", label: "Companies", icon: Building2 },
    { id: "mentor-matching", label: "Mentor Matching", icon: Users },
  ]

  const jobPages = [
    { id: "job-board", label: "Job Board", icon: Briefcase },
    { id: "job-notifications", label: "Job Notifications", icon: Zap },
    { id: "off-market", label: "Off-Market Jobs", icon: EyeOff }, // Capitalized "Market" in Off-Market Jobs
  ]

  return (
    <div
      className={`bg-sidebar border-r border-sidebar-border transition-all duration-300 ${
        isMinimized ? "w-16" : "w-64"
      } flex flex-col`}
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
        {!isMinimized && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">N</span>
            </div>
            <span className="font-bold text-sidebar-foreground">Nowcast Jobs</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMinimized(!isMinimized)}
          className="text-sidebar-foreground hover:bg-sidebar-accent/10"
        >
          {isMinimized ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <div className="space-y-1">
          {/* Job dropdown section */}
          <div>
            <Button
              variant="ghost"
              className={`w-full justify-between gap-3 text-sidebar-foreground hover:bg-sidebar-accent/10 ${
                isMinimized ? "px-2" : "px-3"
              }`}
              onClick={() => !isMinimized && setIsJobDropdownOpen(!isJobDropdownOpen)}
            >
              <div className="flex items-center gap-3">
                <Briefcase className="h-4 w-4 flex-shrink-0" />
                {!isMinimized && <span>Jobs</span>}
              </div>
              {!isMinimized &&
                (isJobDropdownOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
            </Button>

            {/* Job Dropdown Items */}
            {!isMinimized && isJobDropdownOpen && (
              <div className="ml-4 mt-1 space-y-1">
                {jobPages.map((page) => {
                  const Icon = page.icon
                  const isActive = currentPage === page.id

                  return (
                    <Button
                      key={page.id}
                      variant={isActive ? "default" : "ghost"}
                      className={`w-full justify-start gap-3 text-sm ${
                        isActive
                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/10"
                      }`}
                      onClick={() => onPageChange(page.id)}
                    >
                      <Icon className="h-3 w-3 flex-shrink-0" />
                      <span>{page.label}</span>
                    </Button>
                  )
                })}
              </div>
            )}
          </div>

          {pages.map((page) => {
            const Icon = page.icon
            const isActive = currentPage === page.id

            return (
              <Button
                key={page.id}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start gap-3 ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/10"
                } ${isMinimized ? "px-2" : "px-3"}`}
                onClick={() => onPageChange(page.id)}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {!isMinimized && <span>{page.label}</span>}
              </Button>
            )
          })}

          <div className="pt-4 border-t border-sidebar-border/50">
            <Button
              variant={currentPage === "contact" ? "default" : "ghost"}
              className={`w-full justify-start gap-3 ${
                currentPage === "contact"
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/10"
              } ${isMinimized ? "px-2" : "px-3"}`}
              onClick={() => onPageChange("contact")}
            >
              <Phone className="h-4 w-4 flex-shrink-0" />
              {!isMinimized && <span>Contact</span>}
            </Button>
          </div>
        </div>
      </nav>

      {/* Footer */}
      {!isMinimized && (
        <div className="p-4 border-t border-sidebar-border">
          <div className="text-xs text-sidebar-foreground/60">
            Climate • Weather • Energy
            <br />
            Academia • Geospatial • Insurance
          </div>
        </div>
      )}
    </div>
  )
}

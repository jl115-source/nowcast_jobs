"use client"

import { useState } from "react"
import { JobBoard } from "@/components/job-board"
import { ContactPage } from "@/components/contact-page"
import { CVMatcherPage } from "@/components/cv-matcher-page"
import { ConferencesPage } from "@/components/conferences-page"
import { CVImproverPage } from "@/components/cv-improver-page"
import { MentorMatchingPage } from "@/components/mentor-matching-page"
import { JobNotificationsPage } from "@/components/job-notifications-page"
import { OffMarketJobsPage } from "@/components/off-market-jobs-page"
import { CompaniesPage } from "@/components/companies-page" // Added companies page import
import { SidebarNavigation } from "@/components/sidebar-navigation"

export default function Home() {
  const [currentPage, setCurrentPage] = useState("job-board")

  const renderPage = () => {
    switch (currentPage) {
      case "job-board":
        return <JobBoard />
      case "job-notifications":
        return <JobNotificationsPage />
      case "cv-matcher":
        return <CVMatcherPage />
      case "conferences":
        return <ConferencesPage />
      case "companies": // Added companies page routing
        return <CompaniesPage />
      case "cv-improver":
        return <CVImproverPage />
      case "mentor-matching":
        return <MentorMatchingPage />
      case "off-market":
        return <OffMarketJobsPage />
      case "contact":
        return <ContactPage />
      default:
        return <JobBoard />
    }
  }

  return (
    <main className="min-h-screen bg-background flex">
      <SidebarNavigation currentPage={currentPage} onPageChange={setCurrentPage} />
      <div className="flex-1">{renderPage()}</div>
    </main>
  )
}

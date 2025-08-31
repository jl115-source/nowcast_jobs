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
import { CompaniesPage } from "@/components/companies-page"
import { ResourcesPage } from "@/components/resources-page"
import { AccountPage } from "@/components/account-page"
import { SidebarNavigation } from "@/components/sidebar-navigation"
import { AuthButtons } from "@/components/auth-buttons"
import dynamic from "next/dynamic"

const LoginPage = dynamic(() => import("@/app/auth/login/page"), { ssr: false })
const SignUpPage = dynamic(() => import("@/app/auth/sign-up/page"), { ssr: false })
const SignUpSuccessPage = dynamic(() => import("@/app/auth/sign-up-success/page"), { ssr: false })

export default function Home() {
  const [currentPage, setCurrentPage] = useState("job-board")

  const renderPage = () => {
    switch (currentPage) {
      case "job-board":
        return <JobBoard onPageChange={setCurrentPage} />
      case "job-notifications":
        return <JobNotificationsPage />
      case "cv-matcher":
        return <CVMatcherPage />
      case "conferences":
        return <ConferencesPage />
      case "companies":
        return <CompaniesPage />
      case "resources":
        return <ResourcesPage />
      case "cv-improver":
        return <CVImproverPage />
      case "mentor-matching":
        return <MentorMatchingPage />
      case "off-market":
        return <OffMarketJobsPage />
      case "contact":
        return <ContactPage />
      case "account":
        return <AccountPage />
      case "login":
        return <LoginPage />
      case "sign-up":
        return <SignUpPage />
      case "sign-up-success":
        return <SignUpSuccessPage />
      default:
        return <JobBoard />
    }
  }

  return (
    <main className="min-h-screen bg-background flex">
      <SidebarNavigation currentPage={currentPage} onPageChange={setCurrentPage} />
      <div className="flex-1">{renderPage()}</div>
      <AuthButtons onPageChange={setCurrentPage} />
    </main>
  )
}

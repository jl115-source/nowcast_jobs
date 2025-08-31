"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, Mail, Users, Briefcase } from "lucide-react"

interface UserSubscription {
  id: string
  email: string
  type: "job_notifications" | "mentor_matching" | "off_market_jobs"
  categories: string[]
  created_at: string
}

export default function AccountPage() {
  const [user, setUser] = useState<any>(null)
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      if (user?.email) {
        await fetchSubscriptions(user.email)
      }
      setLoading(false)
    }

    getUser()
  }, [])

  const fetchSubscriptions = async (email: string) => {
    try {
      // Fetch job notifications
      const { data: jobNotifications } = await supabase.from("job_notifications").select("*").eq("email", email)

      // Fetch mentor matching
      const { data: mentorMatching } = await supabase.from("mentor_matching").select("*").eq("email", email)

      // Fetch off-market jobs
      const { data: offMarketJobs } = await supabase.from("off_market_jobs").select("*").eq("email", email)

      const allSubscriptions: UserSubscription[] = []

      // Process job notifications
      if (jobNotifications) {
        jobNotifications.forEach((sub) => {
          const categories = []
          if (sub.academia_research) categories.push("Academia & Research")
          if (sub.banking_finance) categories.push("Banking & Finance")
          if (sub.climate_science) categories.push("Climate Science")
          if (sub.energy_renewables) categories.push("Energy & Renewables")
          if (sub.geospatial_gis) categories.push("Geospatial & GIS")
          if (sub.geophysics_geology) categories.push("Geophysics & Geology")
          if (sub.insurance_reinsurance) categories.push("Insurance & Reinsurance")
          if (sub.tech_data_science) categories.push("Tech (Data Science & ML)")
          if (sub.weather_meteorology) categories.push("Weather & Meteorology")
          if (sub.phd) categories.push("PhD")
          if (sub.professor) categories.push("Professor")
          if (sub.trading) categories.push("Trading (Commodities, weather, energy)")
          if (sub.postdoc) categories.push("Post-doc")

          allSubscriptions.push({
            id: sub.id,
            email: sub.email,
            type: "job_notifications",
            categories,
            created_at: sub.created_at,
          })
        })
      }

      // Process mentor matching
      if (mentorMatching) {
        mentorMatching.forEach((sub) => {
          allSubscriptions.push({
            id: sub.id,
            email: sub.email,
            type: "mentor_matching",
            categories: [sub.industry, sub.experience_level].filter(Boolean),
            created_at: sub.created_at,
          })
        })
      }

      // Process off-market jobs
      if (offMarketJobs) {
        offMarketJobs.forEach((sub) => {
          const categories = []
          if (sub.academia_research) categories.push("Academia & Research")
          if (sub.banking_finance) categories.push("Banking & Finance")
          if (sub.climate_science) categories.push("Climate Science")
          if (sub.energy_renewables) categories.push("Energy & Renewables")
          if (sub.geospatial_gis) categories.push("Geospatial & GIS")
          if (sub.geophysics_geology) categories.push("Geophysics & Geology")
          if (sub.insurance_reinsurance) categories.push("Insurance & Reinsurance")
          if (sub.tech_data_science) categories.push("Tech (Data Science & ML)")
          if (sub.weather_meteorology) categories.push("Weather & Meteorology")
          if (sub.phd) categories.push("PhD")
          if (sub.professor) categories.push("Professor")
          if (sub.trading) categories.push("Trading (Commodities, weather, energy)")
          if (sub.postdoc) categories.push("Post-doc")

          allSubscriptions.push({
            id: sub.id,
            email: sub.email,
            type: "off_market_jobs",
            categories,
            created_at: sub.created_at,
          })
        })
      }

      setSubscriptions(allSubscriptions)
    } catch (error) {
      console.error("Error fetching subscriptions:", error)
    }
  }

  const handleUnsubscribe = async (subscription: UserSubscription) => {
    try {
      let tableName = ""
      switch (subscription.type) {
        case "job_notifications":
          tableName = "job_notifications"
          break
        case "mentor_matching":
          tableName = "mentor_matching"
          break
        case "off_market_jobs":
          tableName = "off_market_jobs"
          break
      }

      const { error } = await supabase.from(tableName).delete().eq("id", subscription.id)

      if (error) throw error

      // Refresh subscriptions
      if (user?.email) {
        await fetchSubscriptions(user.email)
      }
    } catch (error) {
      console.error("Error unsubscribing:", error)
    }
  }

  const getSubscriptionIcon = (type: string) => {
    switch (type) {
      case "job_notifications":
        return <Mail className="h-4 w-4" />
      case "mentor_matching":
        return <Users className="h-4 w-4" />
      case "off_market_jobs":
        return <Briefcase className="h-4 w-4" />
      default:
        return <Mail className="h-4 w-4" />
    }
  }

  const getSubscriptionTitle = (type: string) => {
    switch (type) {
      case "job_notifications":
        return "Job Notifications"
      case "mentor_matching":
        return "Mentor Matching"
      case "off_market_jobs":
        return "Off-Market Jobs"
      default:
        return type
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading your account...</h2>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Please sign in to view your account</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Account</h1>
          <p className="text-muted-foreground">Manage your subscriptions and preferences</p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{user.email}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Subscriptions</CardTitle>
              <CardDescription>
                {subscriptions.length === 0
                  ? "You haven't signed up for any services yet"
                  : `You have ${subscriptions.length} active subscription${subscriptions.length !== 1 ? "s" : ""}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {subscriptions.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No subscriptions found. Start by signing up for job notifications or mentor matching!
                </p>
              ) : (
                <div className="space-y-4">
                  {subscriptions.map((subscription) => (
                    <div key={subscription.id} className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="flex items-start gap-3">
                        {getSubscriptionIcon(subscription.type)}
                        <div>
                          <h3 className="font-medium">{getSubscriptionTitle(subscription.type)}</h3>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {subscription.categories.map((category, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {category}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            Subscribed on {new Date(subscription.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUnsubscribe(subscription)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Unsubscribe
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

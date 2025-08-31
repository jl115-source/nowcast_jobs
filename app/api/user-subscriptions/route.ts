import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()

    // Get the authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch user's subscriptions from all tables
    const [jobNotifications, mentorMatching, offMarketJobs] = await Promise.all([
      // Job notifications
      supabase
        .from("job_notifications")
        .select("*")
        .eq("email", user.email),

      // Mentor matching
      supabase
        .from("mentor_matching")
        .select("*")
        .eq("email", user.email),

      // Off-market jobs
      supabase
        .from("off_market_signups")
        .select("*")
        .eq("email", user.email),
    ])

    return NextResponse.json({
      jobNotifications: jobNotifications.data || [],
      mentorMatching: mentorMatching.data || [],
      offMarketJobs: offMarketJobs.data || [],
    })
  } catch (error) {
    console.error("Error fetching user subscriptions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

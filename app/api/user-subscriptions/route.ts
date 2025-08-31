import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    console.log("[v0] Supabase client created successfully")

    // Get the authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    console.log("[v0] Auth user:", user?.email, "Auth error:", authError)

    if (authError || !user) {
      console.log("[v0] Authentication failed:", authError?.message)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] User authenticated, fetching subscriptions for:", user.email)

    // Fetch user's subscriptions from all tables
    const [jobNotifications, mentorMatching, offMarketJobs] = await Promise.all([
      // Job notifications - using email_subscribers table
      supabase
        .from("email_subscribers")
        .select("*")
        .eq("email", user.email),

      // Mentor matching - using mentor_profiles table
      supabase
        .from("mentor_profiles")
        .select("*")
        .eq("email", user.email),

      // Off-market jobs - table name is correct
      supabase
        .from("off_market_signups")
        .select("*")
        .eq("email", user.email),
    ])

    console.log("[v0] Job notifications query:", jobNotifications.error, "Data count:", jobNotifications.data?.length)
    console.log("[v0] Mentor matching query:", mentorMatching.error, "Data count:", mentorMatching.data?.length)
    console.log("[v0] Off-market jobs query:", offMarketJobs.error, "Data count:", offMarketJobs.data?.length)

    if (jobNotifications.error) console.log("[v0] Job notifications error:", jobNotifications.error)
    if (mentorMatching.error) console.log("[v0] Mentor matching error:", mentorMatching.error)
    if (offMarketJobs.error) console.log("[v0] Off-market jobs error:", offMarketJobs.error)

    return NextResponse.json({
      jobNotifications: jobNotifications.data || [],
      mentorMatching: mentorMatching.data || [],
      offMarketJobs: offMarketJobs.data || [],
      errors: {
        jobNotifications: jobNotifications.error?.message,
        mentorMatching: mentorMatching.error?.message,
        offMarketJobs: offMarketJobs.error?.message,
      },
    })
  } catch (error) {
    console.error("[v0] Error fetching user subscriptions:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

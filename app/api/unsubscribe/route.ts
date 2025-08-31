import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { table, id } = await request.json()

    console.log("[v0] Unsubscribe request:", { table, id })

    // Get the authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.log("[v0] Authentication failed:", authError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] Authenticated user:", user.email)

    // Delete the subscription based on table and id
    let result
    switch (table) {
      case "job_notifications":
        console.log("[v0] Deleting from email_subscribers table")
        result = await supabase.from("email_subscribers").delete().eq("id", id).eq("email", user.email)
        break

      case "mentor_matching":
        console.log("[v0] Deleting from mentor_profiles table")
        result = await supabase.from("mentor_profiles").delete().eq("id", id).eq("email", user.email)
        break

      case "off_market_signups":
        console.log("[v0] Deleting from off_market_signups table")
        result = await supabase.from("off_market_signups").delete().eq("id", id).eq("email", user.email)
        break

      default:
        console.log("[v0] Invalid table:", table)
        return NextResponse.json({ error: "Invalid table" }, { status: 400 })
    }

    console.log("[v0] Delete result:", {
      error: result.error,
      data: result.data,
      status: result.status,
      statusText: result.statusText,
      count: result.count,
    })

    if (result.error) {
      console.log("[v0] Delete operation failed:", result.error.message, result.error.details, result.error.code)
      return NextResponse.json(
        {
          error: result.error.message,
          details: result.error.details,
          code: result.error.code,
        },
        { status: 500 },
      )
    }

    if (result.count === 0) {
      console.log("[v0] No rows were deleted - record not found or permission denied")
      return NextResponse.json(
        {
          error: "Record not found or permission denied",
          details: "The subscription may not exist or you don't have permission to delete it",
        },
        { status: 404 },
      )
    }

    console.log("[v0] Successfully deleted", result.count, "record(s)")
    return NextResponse.json({ success: true, deletedCount: result.count })
  } catch (error) {
    console.error("[v0] Unsubscribe error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

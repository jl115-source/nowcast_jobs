import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient()
    const { table, id } = await request.json()

    // Get the authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Delete the subscription based on table and id
    let result
    switch (table) {
      case "job_notifications":
        result = await supabase.from("email_subscribers").delete().eq("id", id).eq("email", user.email)
        break

      case "mentor_matching":
        result = await supabase.from("mentor_profiles").delete().eq("id", id).eq("email", user.email)
        break

      case "off_market_signups":
        result = await supabase.from("off_market_signups").delete().eq("id", id).eq("email", user.email)
        break

      default:
        return NextResponse.json({ error: "Invalid table" }, { status: 400 })
    }

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error unsubscribing:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

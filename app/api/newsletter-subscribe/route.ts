import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Newsletter API called")
    const requestData = await request.json()
    console.log("[v0] Newsletter request data:", requestData)

    const { email, frequency, ...categoryColumns } = requestData

    // Validate input
    if (!email || !frequency) {
      console.log("[v0] Newsletter validation failed")
      return NextResponse.json({ error: "Email and frequency are required" }, { status: 400 })
    }

    // Check if at least one category is selected
    const hasSelectedCategory = Object.values(categoryColumns).some((value) => value === true)
    if (!hasSelectedCategory) {
      console.log("[v0] No categories selected")
      return NextResponse.json({ error: "At least one category must be selected" }, { status: 400 })
    }

    const supabase = await createClient()
    console.log("[v0] Newsletter Supabase client created")

    const insertData = {
      email,
      frequency,
      ...categoryColumns,
    }
    console.log("[v0] Newsletter insert data:", insertData)

    const { data: testData, error: testError } = await supabase.from("email_subscribers").select("id").limit(1)
    console.log("[v0] Test connection result:", { testData, testError })

    const { data, error } = await supabase.from("email_subscribers").insert([insertData]).select()

    if (error) {
      console.error("[v0] Newsletter database error:", error)
      console.error("[v0] Error details:", JSON.stringify(error, null, 2))
      return NextResponse.json(
        {
          error: "Failed to save subscription",
          details: error.message,
        },
        { status: 500 },
      )
    }

    console.log("[v0] Newsletter subscription saved successfully:", data)

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to job alerts",
      data: data[0],
    })
  } catch (error) {
    console.error("[v0] Newsletter subscription error:", error)
    console.error("[v0] Error stack:", error instanceof Error ? error.stack : "No stack trace")
    return NextResponse.json(
      {
        error: "Failed to subscribe to newsletter",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

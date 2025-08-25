import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { email, categories, frequency } = await request.json()

    // Validate input
    if (!email || !categories || categories.length === 0 || !frequency) {
      return NextResponse.json({ error: "Email, frequency, and at least one category are required" }, { status: 400 })
    }

    const supabase = createClient()

    const { data, error } = await supabase
      .from("email_subscribers")
      .insert([
        {
          email,
          frequency,
          industries: categories,
          is_active: true,
        },
      ])
      .select()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to save subscription" }, { status: 500 })
    }

    console.log("[v0] Newsletter subscription saved:", { email, categories, frequency })

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to job alerts",
      data: data[0],
    })
  } catch (error) {
    console.error("Newsletter subscription error:", error)
    return NextResponse.json({ error: "Failed to subscribe to newsletter" }, { status: 500 })
  }
}

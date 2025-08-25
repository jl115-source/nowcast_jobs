import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Mentor API route called")
    const { name, email, signupType, industry, experience } = await request.json()
    console.log("[v0] Received data:", { name, email, signupType, industry, experience })

    // Validate input
    if (!name || !email || !signupType || !industry) {
      console.log("[v0] Validation failed - missing required fields")
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const supabase = createClient()
    console.log("[v0] Supabase client created")

    const { data, error } = await supabase
      .from("mentor_profiles")
      .insert([
        {
          name,
          email,
          role_type: signupType,
          industry,
          bio: experience || null,
        },
      ])
      .select()

    if (error) {
      console.error("[v0] Database error:", error)
      return NextResponse.json({ error: "Failed to save mentor signup", details: error.message }, { status: 500 })
    }

    console.log("[v0] Mentor signup saved successfully:", data)

    return NextResponse.json({
      success: true,
      message: "Successfully joined mentor matching waitlist",
      data: data[0],
    })
  } catch (error) {
    console.error("[v0] Mentor signup error:", error)
    return NextResponse.json({ error: "Failed to process mentor signup" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { name, email, signupType, industry, experience } = await request.json()

    // Validate input
    if (!name || !email || !signupType || !industry) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const supabase = createClient()

    const { data, error } = await supabase
      .from("mentor_profiles")
      .insert([
        {
          name,
          email,
          role_type: signupType,
          industry,
          experience_goals: experience,
          is_active: true,
        },
      ])
      .select()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to save mentor signup" }, { status: 500 })
    }

    console.log("[v0] Mentor signup saved:", { name, email, signupType, industry })

    return NextResponse.json({
      success: true,
      message: "Successfully joined mentor matching waitlist",
      data: data[0],
    })
  } catch (error) {
    console.error("Mentor signup error:", error)
    return NextResponse.json({ error: "Failed to process mentor signup" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Mentor API route called")
    const { name, email, signupType, industry, experience, role_type, bio } = await request.json()
    console.log("[v0] Received data:", { name, email, signupType, industry, experience, role_type, bio })

    // Use the mapped fields from the form if available
    const finalRoleType = role_type || signupType
    const finalBio = bio || experience

    // Validate input
    if (!name || !email || !finalRoleType || !industry) {
      console.log("[v0] Validation failed - missing required fields")
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const supabase = await createClient()
    console.log("[v0] Supabase client created")

    const industryColumns = {
      climate_science: industry === "climate",
      tech_data_science: industry === "tech",
      energy_renewables: industry === "energy",
      weather_meteorology: industry === "weather",
      academia_research: industry === "academia",
      geospatial_gis: industry === "geospatial",
      geophysics_geology: industry === "geophysics",
      insurance_reinsurance: industry === "insurance",
      banking_finance: industry === "banking",
    }

    console.log("[v0] Industry columns mapping:", industryColumns)

    const insertData = {
      name,
      email,
      role_type: finalRoleType,
      bio: finalBio || null,
      ...industryColumns,
    }

    console.log("[v0] Data to insert:", insertData)

    const { data, error } = await supabase.from("mentor_profiles").insert([insertData]).select()

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

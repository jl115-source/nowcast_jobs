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
      climate_science: industry === "Climate Science",
      tech_data_science: industry === "Tech (Data Science & ML)",
      energy_renewables: industry === "Energy & Renewables",
      weather_meteorology: industry === "Weather & Meteorology",
      academia_research: industry === "Academia & Research",
      geospatial_gis: industry === "Geospatial & GIS",
      geophysics_geology: industry === "Geophysics & Geology",
      insurance_reinsurance: industry === "Insurance & Reinsurance",
      banking_finance: industry === "Banking & Finance",
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

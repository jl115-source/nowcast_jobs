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

    const supabase = await createClient()
    console.log("[v0] Supabase client created")

    const industryColumns = {
      climate_science: industry.includes("Climate Science"),
      tech_data_science: industry.includes("Tech (Data Science & ML)"),
      energy_renewables: industry.includes("Energy & Renewables"),
      weather_meteorology: industry.includes("Weather & Meteorology"),
      academia_research: industry.includes("Academia & Research"),
      geospatial_gis: industry.includes("Geospatial & GIS"),
      geophysics_geology: industry.includes("Geophysics & Geology"),
      insurance_reinsurance: industry.includes("Insurance & Reinsurance"),
      banking_finance: industry.includes("Banking & Finance"),
    }

    const { data, error } = await supabase
      .from("mentor_profiles")
      .insert([
        {
          name,
          email,
          role_type: signupType,
          bio: experience || null,
          ...industryColumns, // Spread individual industry columns
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

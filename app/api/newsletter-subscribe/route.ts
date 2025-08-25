import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { email, categories, frequency } = await request.json()

    // Validate input
    if (!email || !categories || categories.length === 0 || !frequency) {
      return NextResponse.json({ error: "Email, frequency, and at least one category are required" }, { status: 400 })
    }

    const supabase = await createClient()

    const industryColumns = {
      climate_science: categories.includes("Climate Science"),
      tech_data_science: categories.includes("Tech (Data Science & ML)"),
      energy_renewables: categories.includes("Energy & Renewables"),
      weather_meteorology: categories.includes("Weather & Meteorology"),
      academia_research: categories.includes("Academia & Research"),
      geospatial_gis: categories.includes("Geospatial & GIS"),
      geophysics_geology: categories.includes("Geophysics & Geology"),
      insurance_reinsurance: categories.includes("Insurance & Reinsurance"),
      banking_finance: categories.includes("Banking & Finance"),
    }

    const { data, error } = await supabase
      .from("email_subscribers")
      .insert([
        {
          email,
          frequency,
          ...industryColumns,
        },
      ])
      .select()

    if (error) {
      console.error("[v0] Database error:", error)
      return NextResponse.json({ error: "Failed to save subscription" }, { status: 500 })
    }

    console.log("[v0] Newsletter subscription saved:", { email, categories, frequency })

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to job alerts",
      data: data[0],
    })
  } catch (error) {
    console.error("[v0] Newsletter subscription error:", error)
    return NextResponse.json({ error: "Failed to subscribe to newsletter" }, { status: 500 })
  }
}

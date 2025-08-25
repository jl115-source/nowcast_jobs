import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Newsletter API called")
    const { email, categories, frequency } = await request.json()
    console.log("[v0] Newsletter request data:", { email, categories, frequency })

    // Validate input
    if (!email || !categories || categories.length === 0 || !frequency) {
      console.log("[v0] Newsletter validation failed")
      return NextResponse.json({ error: "Email, frequency, and at least one category are required" }, { status: 400 })
    }

    const supabase = await createClient()
    console.log("[v0] Newsletter Supabase client created")

    console.log("[v0] Categories received:", categories)
    console.log("[v0] Category type:", typeof categories, Array.isArray(categories))

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

    console.log("[v0] Newsletter industry columns:", industryColumns)

    const insertData = {
      email,
      frequency,
      ...industryColumns,
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

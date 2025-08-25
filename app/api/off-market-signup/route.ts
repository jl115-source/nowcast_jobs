import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Off-market API route called")
    const { type, ...formData } = await request.json()
    console.log("[v0] Received data:", { type, formData })

    // Validate input
    if (!type || (type !== "talent" && type !== "recruiter")) {
      console.log("[v0] Invalid signup type:", type)
      return NextResponse.json({ error: "Invalid signup type" }, { status: 400 })
    }

    const supabase = await createClient()
    console.log("[v0] Supabase client created")

    if (type === "talent") {
      const { name, email, experience, skills, industries } = formData

      if (!name || !email || !experience || !skills || !industries || industries.length === 0) {
        console.log("[v0] Missing required fields for talent signup")
        return NextResponse.json({ error: "Missing required fields for talent signup" }, { status: 400 })
      }

      // <CHANGE> Map industries array to individual boolean columns
      const industryColumns = {
        climate_science: industries.includes('Climate Science'),
        tech_data_science: industries.includes('Tech (Data Science & ML)'),
        energy_renewables: industries.includes('Energy & Renewables'),
        weather_meteorology: industries.includes('Weather & Meteorology'),
        academia_research: industries.includes('Academia & Research'),
        geospatial_gis: industries.includes('Geospatial & GIS'),
        geophysics_geology: industries.includes('Geophysics & Geology'),
        insurance_reinsurance: industries.includes('Insurance & Reinsurance'),
        banking_finance: industries.includes('Banking & Finance'),
      }

      const { data, error } = await supabase
        .from("off_market_signups")
        .insert([
          {
            type: "talent",
            name,
            email,
            skills: Array.isArray(skills) ? skills.join(', ') : skills,
            bio: experience,
            ...industryColumns,
          },
        ])
        .select()

      if (error) {
        console.error("[v0] Database error for talent:", error)
        return NextResponse.json({ error: "Failed to save talent signup", details: error.message }, { status: 500 })
      }

      console.log("[v0] Talent signup saved successfully:", data)
      return NextResponse.json({
        success: true,
        message: "Talent profile successfully added to exclusive network",
        data: data[0],
      })
    } else {
      const { name, email, company, specializations, description } = formData

      if (!name || !email || !company || !specializations || specializations.length === 0 || !description) {
        console.log("[v0] Missing required fields for recruiter signup")
        return NextResponse.json({ error: "Missing required fields for recruiter signup" }, { status: 400 })
      }

      // <CHANGE> Map specializations array to individual boolean columns
      const industryColumns = {
        climate_science: specializations.includes('Climate Science'),
        tech_data_science: specializations.includes('Tech (Data Science & ML)'),
        energy_renewables: specializations.includes('Energy & Renewables'),
        weather_meteorology: specializations.includes('Weather & Meteorology'),
        academia_research: specializations.includes('Academia & Research'),
        geospatial_gis: specializations.includes('Geospatial & GIS'),
        geophysics_geology: specializations.includes('Geophysics & Geology'),
        insurance_reinsurance: specializations.includes('Insurance & Reinsurance'),
        banking_finance: specializations.includes('Banking & Finance'),
      }

      const { data, error } = await supabase
        .from("off_market_signups")
        .insert([
          {
            type: "recruiter",
            name,
            email,
            company,
            bio: description,
            ...industryColumns,
          },
        ])
        .select()

      if (error) {
        console.error("[v0] Database error for recruiter:", error)
        return NextResponse.json({ error: "Failed to save recruiter signup", details: error.message }, { status: 500 })
      }

      console.log("[v0] Recruiter signup saved successfully:", data)
      return NextResponse.json({
        success: true,
        message: "Recruiter application submitted for review",
        data: data[0],
      })
    }
  } catch (error) {
    console.error("[v0] Off-market signup error:", error)
    return NextResponse.json({ error: "Failed to process signup" }, { status: 500 })
  }
}

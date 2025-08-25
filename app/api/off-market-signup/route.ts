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

    const supabase = createClient()
    console.log("[v0] Supabase client created")

    if (type === "talent") {
      const { name, email, phone, experience, skills, industries, currentRole, location, availability } = formData

      if (!name || !email || !experience || !skills || !industries || industries.length === 0) {
        console.log("[v0] Missing required fields for talent signup")
        return NextResponse.json({ error: "Missing required fields for talent signup" }, { status: 400 })
      }

      const { data, error } = await supabase
        .from("off_market_signups")
        .insert([
          {
            type: "talent",
            name,
            email,
            phone,
            experience_level: experience, // Map to correct column
            skills: Array.isArray(skills) ? skills : [skills], // Ensure array format
            industries: Array.isArray(industries) ? industries : [industries], // Ensure array format
            additional_info: currentRole, // Map currentRole to additional_info
            location,
            status: "active",
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
      const { name, email, company, phone, website, specializations, experience, clientTypes, description } = formData

      if (
        !name ||
        !email ||
        !company ||
        !specializations ||
        specializations.length === 0 ||
        !experience ||
        !description
      ) {
        console.log("[v0] Missing required fields for recruiter signup")
        return NextResponse.json({ error: "Missing required fields for recruiter signup" }, { status: 400 })
      }

      const { data, error } = await supabase
        .from("off_market_signups")
        .insert([
          {
            type: "recruiter",
            name,
            email,
            phone,
            company,
            website_url: website, // Map to correct column
            industries: Array.isArray(specializations) ? specializations : [specializations], // Map specializations to industries
            experience_level: experience, // Map to correct column
            additional_info: description, // Map description to additional_info
            status: "pending", // Recruiters need approval
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

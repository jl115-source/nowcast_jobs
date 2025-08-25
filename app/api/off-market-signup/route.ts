import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { type, ...formData } = await request.json()

    // Validate input
    if (!type || (type !== "talent" && type !== "recruiter")) {
      return NextResponse.json({ error: "Invalid signup type" }, { status: 400 })
    }

    const supabase = createClient()

    if (type === "talent") {
      const { name, email, phone, experience, skills, industries, currentRole, location, availability } = formData

      if (!name || !email || !experience || !skills || !industries || industries.length === 0) {
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
            experience,
            skills,
            industries,
            current_role: currentRole,
            location,
            availability,
            is_active: true,
          },
        ])
        .select()

      if (error) {
        console.error("Database error:", error)
        return NextResponse.json({ error: "Failed to save talent signup" }, { status: 500 })
      }

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
            website,
            specializations,
            experience,
            client_types: clientTypes,
            description,
            is_active: false, // Recruiters need approval
          },
        ])
        .select()

      if (error) {
        console.error("Database error:", error)
        return NextResponse.json({ error: "Failed to save recruiter signup" }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        message: "Recruiter application submitted for review",
        data: data[0],
      })
    }
  } catch (error) {
    console.error("Off-market signup error:", error)
    return NextResponse.json({ error: "Failed to process signup" }, { status: 500 })
  }
}

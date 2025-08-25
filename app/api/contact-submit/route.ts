import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Contact API route called")
    const { firstName, lastName, email, subject, message } = await request.json()
    console.log("[v0] Received contact data:", { firstName, lastName, email, subject })

    // Validate input
    if (!firstName || !lastName || !email || !subject || !message) {
      console.log("[v0] Contact validation failed - missing required fields")
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const supabase = await createClient()
    console.log("[v0] Contact Supabase client created")

    const { data, error } = await supabase
      .from("contact_submissions")
      .insert([
        {
          name: `${firstName} ${lastName}`,
          email,
          subject,
          message,
        },
      ])
      .select()

    if (error) {
      console.error("[v0] Contact database error:", error)
      return NextResponse.json({ error: "Failed to save contact submission", details: error.message }, { status: 500 })
    }

    console.log("[v0] Contact submission saved successfully:", data)

    return NextResponse.json({
      success: true,
      message: "Message sent successfully! We'll get back to you within 24 hours.",
      data: data[0],
    })
  } catch (error) {
    console.error("[v0] Contact submission error:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}

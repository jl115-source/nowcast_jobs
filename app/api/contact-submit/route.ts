import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Contact API route called")
    const body = await request.json()
    console.log("[v0] Raw request body:", body)

    const { firstName, lastName, email, subject, message } = body
    console.log("[v0] Received contact data:", {
      firstName,
      lastName,
      email,
      subject,
      message: message?.substring(0, 50) + "...",
    })

    // Validate input
    if (!firstName || !lastName || !email || !subject || !message) {
      console.log("[v0] Contact validation failed - missing required fields")
      console.log("[v0] Field check:", {
        firstName: !!firstName,
        lastName: !!lastName,
        email: !!email,
        subject: !!subject,
        message: !!message,
      })
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    console.log("[v0] Creating Supabase client...")
    const supabase = await createClient()
    console.log("[v0] Contact Supabase client created successfully")

    const insertData = {
      name: `${firstName} ${lastName}`,
      email,
      subject,
      message,
    }

    console.log("[v0] Data to insert:", insertData)

    const { data, error } = await supabase.from("contact_submissions").insert([insertData]).select()

    if (error) {
      console.error("[v0] Contact database error:", error)
      console.error("[v0] Error details:", error.message, error.code, error.hint)
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
    console.error("[v0] Error stack:", error instanceof Error ? error.stack : "No stack trace")
    return NextResponse.json(
      { error: "Failed to send message", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

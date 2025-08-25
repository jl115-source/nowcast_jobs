import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, subject, message } = await request.json()

    // Validate input
    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const supabase = createClient()

    const { data, error } = await supabase
      .from("contact_submissions")
      .insert([
        {
          name: `${firstName} ${lastName}`,
          email,
          message: `Subject: ${subject}\n\n${message}`,
        },
      ])
      .select()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to save contact submission" }, { status: 500 })
    }

    console.log("[v0] Contact submission saved:", { firstName, lastName, email, subject })

    return NextResponse.json({
      success: true,
      message: "Message sent successfully! We'll get back to you within 24 hours.",
      data: data[0],
    })
  } catch (error) {
    console.error("Contact submission error:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}

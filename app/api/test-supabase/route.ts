import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] Testing Supabase connection...")
    const supabase = await createClient()

    // Test basic connection by querying table info
    const { data: tables, error } = await supabase.from("mentor_profiles").select("*").limit(1)

    if (error) {
      console.error("[v0] Supabase test error:", error)
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          code: error.code,
        },
        { status: 500 },
      )
    }

    console.log("[v0] Supabase connection successful")
    return NextResponse.json({
      success: true,
      message: "Supabase connection working",
      tableExists: true,
    })
  } catch (error) {
    console.error("[v0] Test error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

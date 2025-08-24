import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "File must be a PDF" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    const pdfParse = (await import("pdf-parse")).default
    const pdfData = await pdfParse(buffer)

    return NextResponse.json({
      text: pdfData.text,
      pages: pdfData.numpages,
      info: pdfData.info,
    })
  } catch (error) {
    console.error("PDF extraction error:", error)
    return NextResponse.json(
      { error: "Failed to extract text from PDF. Please ensure the file is a valid PDF." },
      { status: 500 },
    )
  }
}

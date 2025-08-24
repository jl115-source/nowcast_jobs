import { type NextRequest, NextResponse } from "next/server"
import { generateObject } from "ai"
import { groq } from "@ai-sdk/groq"
import { z } from "zod"

const CVAnalysisSchema = z.object({
  skills: z.array(z.string()).describe("Technical and professional skills found in the CV"),
  experience: z.array(z.string()).describe("Work experience entries with company and role"),
  education: z.array(z.string()).describe("Educational background and qualifications"),
  summary: z.string().describe("Brief professional summary of the candidate"),
  yearsOfExperience: z.number().describe("Total years of professional experience"),
  jobTitles: z.array(z.string()).describe("Previous job titles held"),
})

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "CV text is required" }, { status: 400 })
    }

    const { object: analysis } = await generateObject({
      model: groq("llama-3.1-70b-versatile"),
      schema: CVAnalysisSchema,
      prompt: `
        Analyze the following CV/resume text and extract structured information:

        CV Text:
        ${text}

        Please extract:
        1. Technical and professional skills (programming languages, tools, frameworks, soft skills)
        2. Work experience entries (format: "Job Title at Company (Years)")
        3. Education background and qualifications
        4. A brief professional summary (2-3 sentences)
        5. Total years of professional experience (estimate if not explicit)
        6. Previous job titles held

        Be thorough but concise. Focus on relevant professional information.
      `,
    })

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error("CV analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze CV. Please try again." }, { status: 500 })
  }
}

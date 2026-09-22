import { type NextRequest, NextResponse } from "next/server"
import { generateObject } from "ai"
import { groq } from "@ai-sdk/groq"
import { z } from "zod"

const SuggestionSchema = z.object({
  section: z.string(),
  priority: z.enum(["high", "medium", "low"]),
  issue: z.string(),
  suggestion: z.string(),
  example: z.string().optional(),
})

const CVImprovementSchema = z.object({
  overallScore: z.number().min(0).max(100),
  atsScore: z.number().min(0).max(100),
  industryAlignment: z.number().min(0).max(100),
  strengths: z.array(z.string()),
  suggestions: z.array(SuggestionSchema),
  keywordSuggestions: z.array(z.string()),
  improvedVersion: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    const { cvText, fileName } = await request.json()

    if (!cvText || typeof cvText !== "string") {
      return NextResponse.json({ error: "CV text is required" }, { status: 400 })
    }

    const { object: analysis } = await generateObject({
      model: groq("llama-3.1-70b-versatile"),
      schema: CVImprovementSchema,
      prompt: `You are an expert CV/resume consultant specializing in climate, weather, energy, academia, and geospatial careers.

Analyze the CV below and provide specific, evidence-based improvement suggestions. Do not invent achievements, employers, qualifications, metrics, or experience that are not present in the CV. When suggesting quantified impact, explain what type of metric the candidate could add rather than fabricating a number.

CV Content:
${cvText}

Focus on:
1. ATS-friendly structure and terminology
2. Clear, concise professional writing
3. Relevant industry terminology
4. Stronger descriptions of demonstrated impact
5. Alignment between experience, skills, and target roles
6. A rewritten version that preserves the candidate's factual information

Scores are heuristic guidance only and should reflect the supplied CV, not an external hiring decision.`,
    })

    return NextResponse.json({ ...analysis, fileName })
  } catch (error) {
    console.error("CV improvement error:", error)
    return NextResponse.json({ error: "Failed to analyze and improve CV" }, { status: 500 })
  }
}

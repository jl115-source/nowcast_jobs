import { type NextRequest, NextResponse } from "next/server"
import { generateObject } from "ai"
import { groq } from "@ai-sdk/groq"
import { z } from "zod"
import jobsData from "@/data/jobs.json"

const JobMatchSchema = z.object({
  jobId: z.string(),
  matchScore: z.number().min(0).max(100),
  matchReasons: z.array(z.string()),
  skillsMatch: z.number().min(0).max(100),
  experienceMatch: z.number().min(0).max(100),
  titleMatch: z.number().min(0).max(100),
})

const JobMatchesSchema = z.object({
  matches: z.array(JobMatchSchema),
})

export async function POST(request: NextRequest) {
  try {
    const { cvData } = await request.json()

    if (!cvData || !cvData.skills || !cvData.experience) {
      return NextResponse.json({ error: "CV data is required" }, { status: 400 })
    }

    const jobs = jobsData.jobs

    // Create a detailed prompt for AI matching
    const jobsForAnalysis = jobs.map((job) => ({
      id: job.id,
      title: job.title,
      company: job.company,
      skills: job.skills,
      requirements: job.requirements,
      description: job.description,
      type: job.type,
      remote: job.remote,
    }))

    const { object: matchResults } = await generateObject({
      model: groq("llama-3.1-70b-versatile"),
      schema: JobMatchesSchema,
      prompt: `
        You are an expert job matching AI. Analyze the candidate's CV data against the available jobs and provide match scores.

        Candidate Profile:
        - Skills: ${cvData.skills.join(", ")}
        - Experience: ${cvData.experience.join("; ")}
        - Years of Experience: ${cvData.yearsOfExperience || "Not specified"}
        - Previous Job Titles: ${cvData.jobTitles?.join(", ") || "Not specified"}
        - Summary: ${cvData.summary || "Not provided"}

        Available Jobs:
        ${JSON.stringify(jobsForAnalysis, null, 2)}

        For each job, provide:
        1. matchScore (0-100): Overall compatibility score
        2. matchReasons: 2-3 specific reasons why this job matches or doesn't match
        3. skillsMatch (0-100): How well candidate's skills align with job requirements
        4. experienceMatch (0-100): How well candidate's experience level fits the role
        5. titleMatch (0-100): How similar candidate's previous roles are to this position

        Consider:
        - Exact skill matches should score higher
        - Related/transferable skills should score moderately
        - Experience level appropriateness
        - Job title similarity and career progression
        - Remote work preferences if applicable

        Provide matches for ALL jobs, even if some have low scores.
      `,
    })

    // Sort matches by score and add job details
    const enrichedMatches = matchResults.matches
      .map((match) => {
        const job = jobs.find((j) => j.id === match.jobId)
        return job ? { ...match, job } : null
      })
      .filter(Boolean)
      .sort((a, b) => b!.matchScore - a!.matchScore)

    return NextResponse.json({ matches: enrichedMatches })
  } catch (error) {
    console.error("Job matching error:", error)
    return NextResponse.json({ error: "Failed to match jobs. Please try again." }, { status: 500 })
  }
}

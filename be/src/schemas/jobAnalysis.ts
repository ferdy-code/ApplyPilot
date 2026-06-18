import { z } from 'zod';

// HTTP input for POST /job-analyses — the raw paste + the user's skill list.
// userId is intentionally absent: the route derives it from the session.
export const createJobAnalysisSchema = z.object({
  jobDescription: z.string().min(1, 'job description is required').max(20000),
  skills: z.string().min(1, 'skills are required').max(5000),
});

// The structured object the AI must return. The schema root is a zod OBJECT —
// `generateObject` disallows array roots, so every collection is a property.
export const analysisResultSchema = z.object({
  jobTitle: z.string(),
  summary: z.string(),
  responsibilities: z.array(z.string()),
  requirements: z.array(z.string()),
  keywords: z.array(z.string()),
  matchedSkills: z.array(z.string()),
  missingSkills: z.array(z.string()),
  fitScore: z.number().int().min(0).max(100),
  coverLetter: z.string(),
});

export type AnalysisResult = z.infer<typeof analysisResultSchema>;

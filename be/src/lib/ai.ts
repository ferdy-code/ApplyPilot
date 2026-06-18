import { GoogleGenAI, Type } from '@google/genai';
import { HTTPException } from 'hono/http-exception';
import { analysisResultSchema, type AnalysisResult } from '../schemas/jobAnalysis';

// Constrain Gemini to the analysis shape. zod (analysisResultSchema) remains the
// final validation gate so the function still returns a typed AnalysisResult.
const responseSchema = {
  type: Type.OBJECT,
  properties: {
    jobTitle: { type: Type.STRING },
    summary: { type: Type.STRING },
    responsibilities: { type: Type.ARRAY, items: { type: Type.STRING } },
    requirements: { type: Type.ARRAY, items: { type: Type.STRING } },
    keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
    matchedSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
    missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
    fitScore: { type: Type.INTEGER },
    coverLetter: { type: Type.STRING },
  },
  required: [
    'jobTitle',
    'summary',
    'responsibilities',
    'requirements',
    'keywords',
    'matchedSkills',
    'missingSkills',
    'fitScore',
    'coverLetter',
  ],
} as const;

/**
 * Run Gemini over a pasted job description + the candidate's skills and return a
 * structured analysis (summary, requirements, keywords, fit score, cover letter).
 *
 * Throws HTTPException(503) when the API key is unset (server misconfig) and
 * HTTPException(502) when the upstream call or JSON parsing fails, so callers
 * never see a raw error and no partial row is ever persisted.
 */
export async function analyzeJobDescription(args: {
  jobDescription: string;
  skills: string;
}): Promise<AnalysisResult> {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    throw new HTTPException(503, { message: 'AI service not configured' });
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY });

  const systemInstruction = [
    'You are an expert technical recruiter and career coach.',
    'Analyze the given job description and the candidate\'s skills, then return strictly structured JSON.',
    'Be concise and specific. Use the candidate\'s exact skill wording where relevant.',
    'Express every skill list (requirements, matchedSkills, missingSkills, keywords) as concise, normalized technology/skill terms of 1-4 words — never full sentences or "X+ years" qualifiers.',
  ].join(' ');

  const prompt = [
    `JOB DESCRIPTION:\n"""\n${args.jobDescription}\n"""`,
    '',
    `CANDIDATE SKILLS (comma- or newline-separated):\n${args.skills}`,
    '',
    'Return JSON with these fields:',
    '- jobTitle: the role\'s title, inferred from the job description.',
    '- summary: a 2-3 sentence summary of the role and its core focus.',
    '- responsibilities: the 4-8 key day-to-day responsibilities (short phrases).',
    '- requirements: the 4-8 required skills/technologies as concise terms (1-4 words each, e.g. "TypeScript", "React", "AWS", "system design"). Do NOT include full sentences or "X+ years" qualifiers.',
    '- keywords: 6-12 concise ATS terms (1-4 words, e.g. "React", "CI/CD", "PostgreSQL").',
    '- matchedSkills: concise terms (1-4 words) for the candidate\'s skills that satisfy a requirement. Map each requirement to the candidate\'s closest skill (e.g. requirement "modern JavaScript frameworks" + candidate "React" -> matched "React").',
    '- missingSkills: concise skill/technology terms (1-4 words) the candidate genuinely lacks — distill each requirement to its underlying skill name and never paste the full requirement sentence. Ignore seniority/years qualifiers: if the candidate has the underlying skill at any level, count it as matched, NOT missing.',
    '- fitScore: integer 0-100 = round(matchedSkills.length / (matchedSkills.length + missingSkills.length) * 100); use 0 when there are no requirements.',
    '- coverLetter: a tailored first-person cover-letter draft (~200 words) that weaves in the matched skills and references the role and responsibilities.',
  ].join('\n');

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema,
        temperature: 0.2,
      },
    });

    // response.text is valid JSON because responseMimeType forces it; parse +
    // validate through zod to guarantee the typed AnalysisResult shape.
    const json = response.text;
    return analysisResultSchema.parse(JSON.parse(json));
  } catch (err) {
    if (err instanceof HTTPException) throw err;
    console.error('AI analysis failed:', err);
    throw new HTTPException(502, { message: 'job analysis failed' });
  }
}

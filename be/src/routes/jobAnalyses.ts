import { Hono, type Context } from 'hono';
import { validator } from 'hono/validator';
import { HTTPException } from 'hono/http-exception';
import { and, desc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../db';
import { jobAnalyses } from '../db/schema';
import { requireAuth, type AuthEnv } from '../lib/auth';
import { analyzeJobDescription } from '../lib/ai';
import { createJobAnalysisSchema } from '../schemas/jobAnalysis';

export const jobAnalysesRoutes = new Hono<AuthEnv>();

// Every analysis route requires an authenticated session (sets c.user).
jobAnalysesRoutes.use(requireAuth);

/** Parse `value` against `schema`, throwing a 400 HTTPException on failure. */
function parseOr400<T>(value: unknown, schema: z.ZodType<T>): T {
  const result = schema.safeParse(value);
  if (!result.success) {
    throw new HTTPException(400, {
      message: 'validation error',
      cause: result.error.flatten(),
    });
  }
  return result.data;
}

/** Parse the `:id` route param to a positive integer (non-numeric → 400). */
function parseIdParam(c: Context): number {
  const raw = c.req.param('id');
  if (!raw || !/^\d+$/.test(raw)) {
    throw new HTTPException(400, { message: `invalid id: ${raw ?? ''}` });
  }
  return Number(raw);
}

// POST /job-analyses — analyze the JD + skills, then persist the result. The AI
// call runs before the insert so no partial row is written if it fails (502/503).
jobAnalysesRoutes.post(
  '/',
  validator('json', (value) => parseOr400(value, createJobAnalysisSchema)),
  async (c) => {
    const body = c.req.valid('json');
    const result = await analyzeJobDescription({
      jobDescription: body.jobDescription,
      skills: body.skills,
    });
    const [created] = await db
      .insert(jobAnalyses)
      .values({
        userId: c.get('user').id,
        jobDescription: body.jobDescription,
        skills: body.skills,
        jobTitle: result.jobTitle,
        summary: result.summary,
        responsibilities: result.responsibilities,
        requirements: result.requirements,
        keywords: result.keywords,
        matchedSkills: result.matchedSkills,
        missingSkills: result.missingSkills,
        fitScore: result.fitScore,
        coverLetter: result.coverLetter,
      })
      .returning();
    return c.json(created, 201);
  },
);

// GET /job-analyses — list the user's analyses, newest first.
jobAnalysesRoutes.get('/', async (c) => {
  const rows = await db
    .select()
    .from(jobAnalyses)
    .where(eq(jobAnalyses.userId, c.get('user').id))
    .orderBy(desc(jobAnalyses.createdAt));
  return c.json(rows);
});

// GET /job-analyses/:id — scoped to the user (other users' rows 404).
jobAnalysesRoutes.get('/:id', async (c) => {
  const id = parseIdParam(c);
  const userId = c.get('user').id;
  const [row] = await db
    .select()
    .from(jobAnalyses)
    .where(and(eq(jobAnalyses.id, id), eq(jobAnalyses.userId, userId)));
  if (!row) throw new HTTPException(404, { message: 'analysis not found' });
  return c.json(row);
});

// DELETE /job-analyses/:id — scoped to the user.
jobAnalysesRoutes.delete('/:id', async (c) => {
  const id = parseIdParam(c);
  const userId = c.get('user').id;
  const [deleted] = await db
    .delete(jobAnalyses)
    .where(and(eq(jobAnalyses.id, id), eq(jobAnalyses.userId, userId)))
    .returning({ id: jobAnalyses.id });
  if (!deleted) throw new HTTPException(404, { message: 'analysis not found' });
  return c.body(null, 204);
});

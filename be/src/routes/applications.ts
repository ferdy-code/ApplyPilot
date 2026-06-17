import { Hono, type Context } from 'hono';
import { validator } from 'hono/validator';
import { HTTPException } from 'hono/http-exception';
import { and, desc, eq, type SQL } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../db';
import { applications, companies } from '../db/schema';
import {
  createApplicationSchema,
  listApplicationsQuerySchema,
  updateApplicationSchema,
  updateApplicationStatusSchema,
} from '../schemas/application';

export const applicationsRoutes = new Hono();

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

// POST /applications
applicationsRoutes.post(
  '/',
  validator('json', (value) => parseOr400(value, createApplicationSchema)),
  async (c) => {
    const body = c.req.valid('json');
    const [created] = await db
      .insert(applications)
      .values({
        userId: body.userId,
        companyId: body.companyId,
        position: body.position,
        // Leave status undefined when omitted so the DB default ('wishlist') applies.
        status: body.status,
        source: body.source ?? null,
        deadline: body.deadline ?? null,
        salaryMin: body.salaryMin ?? null,
        salaryMax: body.salaryMax ?? null,
        salaryCurrency: body.salaryCurrency ?? null,
        jobDescription: body.jobDescription ?? null,
        notes: body.notes ?? null,
      })
      .returning();
    return c.json(created, 201);
  },
);

// GET /applications (optional filters: status, companyId, source)
applicationsRoutes.get(
  '/',
  validator('query', (value) => parseOr400(value, listApplicationsQuerySchema)),
  async (c) => {
    const query = c.req.valid('query');
    const filters: SQL[] = [];
    if (query.status) filters.push(eq(applications.status, query.status));
    if (query.companyId) filters.push(eq(applications.companyId, query.companyId));
    if (query.source) filters.push(eq(applications.source, query.source));
    const rows = await db
      .select({ ...applications, companyName: companies.name })
      .from(applications)
      .leftJoin(companies, eq(applications.companyId, companies.id))
      .where(filters.length ? and(...filters) : undefined)
      .orderBy(desc(applications.createdAt));
    return c.json(rows);
  },
);

// GET /applications/:id
applicationsRoutes.get('/:id', async (c) => {
  const id = parseIdParam(c);
  const [row] = await db
    .select({ ...applications, companyName: companies.name })
    .from(applications)
    .leftJoin(companies, eq(applications.companyId, companies.id))
    .where(eq(applications.id, id));
  if (!row) throw new HTTPException(404, { message: 'application not found' });
  return c.json(row);
});

/** Run update then re-fetch with JOIN so response includes companyName. */
async function updateAndFetch(id: number, values: Record<string, unknown>) {
  const [check] = await db
    .update(applications)
    .set(values)
    .where(eq(applications.id, id))
    .returning({ id: applications.id });
  if (!check) throw new HTTPException(404, { message: 'application not found' });
  const [row] = await db
    .select({ ...applications, companyName: companies.name })
    .from(applications)
    .leftJoin(companies, eq(applications.companyId, companies.id))
    .where(eq(applications.id, id));
  return row;
}

// PATCH /applications/:id/status — registered before /:id for defensive ordering.
applicationsRoutes.patch(
  '/:id/status',
  validator('json', (value) => parseOr400(value, updateApplicationStatusSchema)),
  async (c) => {
    const id = parseIdParam(c);
    const { status } = c.req.valid('json');
    const row = await updateAndFetch(id, { status, updatedAt: new Date() });
    return c.json(row);
  },
);

// PATCH /applications/:id (partial update)
applicationsRoutes.patch(
  '/:id',
  validator('json', (value) => parseOr400(value, updateApplicationSchema)),
  async (c) => {
    const id = parseIdParam(c);
    const body = c.req.valid('json');
    const row = await updateAndFetch(id, { ...body, updatedAt: new Date() });
    return c.json(row);
  },
);

// DELETE /applications/:id
applicationsRoutes.delete('/:id', async (c) => {
  const id = parseIdParam(c);
  const [deleted] = await db
    .delete(applications)
    .where(eq(applications.id, id))
    .returning({ id: applications.id });
  if (!deleted) throw new HTTPException(404, { message: 'application not found' });
  return c.body(null, 204);
});

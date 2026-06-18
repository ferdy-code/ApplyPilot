import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { validator } from 'hono/validator';
import { z } from 'zod';
import { db } from '../db';
import { companies } from '../db/schema';
import { requireAuth, type AuthEnv } from '../lib/auth';

export const companiesRoutes = new Hono<AuthEnv>();

// Creating a company requires an authenticated session. Companies are global/
// shared (no per-user ownership column yet), so reads are intentionally not
// user-scoped.
companiesRoutes.use(requireAuth);

const createCompanySchema = z.object({
  name: z.string().min(1).max(255),
  website: z.string().max(2048).nullable().optional(),
  location: z.string().max(255).nullable().optional(),
});

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

// POST /companies
companiesRoutes.post(
  '/',
  validator('json', (value) => parseOr400(value, createCompanySchema)),
  async (c) => {
    const body = c.req.valid('json');
    const [created] = await db
      .insert(companies)
      .values({
        name: body.name,
        website: body.website ?? null,
        location: body.location ?? null,
      })
      .returning({
        id: companies.id,
        name: companies.name,
        website: companies.website,
        location: companies.location,
      });
    return c.json(created, 201);
  },
);

import { z } from 'zod';
import { applicationStatus } from '../db/schema';

// Derive the status enum from the Drizzle schema so it can't drift.
const statusEnum = z.enum(applicationStatus.enumValues);

// Drizzle surfaces numeric(12,2) and date columns as strings at the JS boundary,
// so validate them as strings rather than as JS numbers/Date.
const numericStr = z.string().regex(/^-?\d+(\.\d{1,2})?$/, 'invalid numeric');
const dateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'invalid date');

// CREATE — companyId, position required; status optional (DB defaults to 'wishlist').
// userId is intentionally absent: the route derives it from the session, never the body.
// Nullable columns are `.nullable().optional()` so callers can omit (leave untouched),
// send null (clear), or send a value.
export const createApplicationSchema = z.object({
  companyId: z.number().int().positive(),
  position: z.string().min(1).max(255),
  status: statusEnum.optional(),
  source: z.string().max(255).nullable().optional(),
  deadline: dateStr.nullable().optional(),
  salaryMin: numericStr.nullable().optional(),
  salaryMax: numericStr.nullable().optional(),
  salaryCurrency: z.string().length(3).nullable().optional(),
  jobDescription: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

// UPDATE — everything partial. `.strict()` rejects id/createdAt/updatedAt and any
// unknown key with a 400; the refine rejects an empty body.
export const updateApplicationSchema = createApplicationSchema
  .partial()
  .strict()
  .refine((o) => Object.keys(o).length > 0, { message: 'body must not be empty' });

export const updateApplicationStatusSchema = z.object({ status: statusEnum });

// LIST query — companyId arrives as a URL string, so coerce it to a number.
export const listApplicationsQuerySchema = z.object({
  status: statusEnum.optional(),
  companyId: z.coerce.number().int().positive().optional(),
  source: z.string().max(255).optional(),
});

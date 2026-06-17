import { drizzle } from 'drizzle-orm/node-postgres';

// Centralized Drizzle client. URL-string form is supported by the node-postgres
// driver; the connection is lazy and opens on the first query.
export const db = drizzle(process.env.DATABASE_URL!);

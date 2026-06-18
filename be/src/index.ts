import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { auth } from "./lib/auth";
import { applicationsRoutes } from "./routes/applications";
import { companiesRoutes } from "./routes/companies";

const app = new Hono();

// `credentials: true` so the browser sends the Better Auth session cookie from
// the frontend origin (http://localhost:3000) to this API (:8000).
app.use("*", cors({ origin: "http://localhost:3000", credentials: true }));

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

// Better Auth handlers (sign-up/sign-in/sign-out/session/social/callback).
app.all("/api/auth/*", (c) => auth.handler(c.req.raw));

app.route("/applications", applicationsRoutes);
app.route("/companies", companiesRoutes);

app.notFound((c) => c.json({ error: "not found" }, 404));

app.onError((err, c) => {
  if (err instanceof HTTPException) return err.getResponse();
  // Postgres foreign_key_violation (e.g. non-existent userId/companyId) → 400.
  if ((err as { code?: string }).code === "23503") {
    return c.json({ error: "foreign key violation" }, 400);
  }
  console.error(err);
  return c.json({ error: "internal server error" }, 500);
});

export default {
  port: 8000,
  fetch: app.fetch,
};

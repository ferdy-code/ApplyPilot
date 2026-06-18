import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { db } from "../db";
import { account, session, user, verification } from "../db/schema";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL!,
  // Frontend origin permitted to use cookie-based sessions against this API.
  trustedOrigins: ["http://localhost:3000"],
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user, session, account, verification },
  }),
  account: {
    accountLinking: {
      enabled: true, // Enable account linking
      trustedProviders: ["google", "github"], // Add trusted providers
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  verification: {
    storeInDatabase: true, // Fallback if Redis key evicted
  },
});

/** Hono context variables populated by {@link requireAuth}. */
export type AuthEnv = {
  Variables: {
    user: typeof auth.$Infer.Session.user;
    session: typeof auth.$Infer.Session.session;
  };
};

/**
 * Require an authenticated Better Auth session. Reads the session from the
 * request cookie, 401s when absent, and exposes `c.get("user")` /
 * `c.get("session")` downstream.
 */
export const requireAuth = createMiddleware<AuthEnv>(async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) {
    throw new HTTPException(401, { message: "unauthorized" });
  }
  c.set("user", session.user);
  c.set("session", session.session);
  await next();
});

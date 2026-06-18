import { createAuthClient } from "better-auth/vue";

export const authClient = createAuthClient({
  baseURL: import.meta.env.NUXT_PUBLIC_API_BASE ?? "http://localhost:8000",
});

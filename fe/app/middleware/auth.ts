export default defineNuxtRouteMiddleware((to) => {
  // Skip on server — the session is cross-origin (:8000) and only loaded
  // client-side by plugins/auth.client.ts.
  if (import.meta.server) return;

  // Read the shared, already-cached session — no get-session call per navigation.
  const { user } = useAuth();
  const isAuthenticated = !!user.value;

  const guarded = ["/dashboard", "/applications"];
  const isGuarded = guarded.some(
    (p) => to.path === p || to.path.startsWith(p + "/"),
  );
  const isAuthPage = to.path === "/login" || to.path === "/register";

  if (isGuarded && !isAuthenticated) {
    return navigateTo("/login");
  }
  if (isAuthPage && isAuthenticated) {
    return navigateTo("/dashboard");
  }
});

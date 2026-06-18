// Client-only: fetch the session ONCE when the app boots and cache it in the
// shared useAuth() state. The route middleware and components then read that
// cache instead of calling get-session on every navigation.
// Runs before the initial route middleware, so the cached user is available
// for the first navigation.
export default defineNuxtPlugin(async () => {
  const { refresh } = useAuth();
  await refresh();
});

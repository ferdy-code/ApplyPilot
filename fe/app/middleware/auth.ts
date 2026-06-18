import { authClient } from '~/lib/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  // Skip on server — session cookie is cross-origin (:8000), not readable during SSR.
  if (import.meta.server) return

  const { data } = await authClient.getSession()
  const isAuthenticated = !!data?.user

  const guarded = ['/dashboard', '/applications']
  const isGuarded = guarded.some((p) => to.path === p || to.path.startsWith(p + '/'))
  const isAuthPage = to.path === '/login' || to.path === '/register'

  if (isGuarded && !isAuthenticated) {
    return navigateTo('/login')
  }
  if (isAuthPage && isAuthenticated) {
    return navigateTo('/dashboard')
  }
})

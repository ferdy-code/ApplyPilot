import { authClient } from '~/lib/auth'

interface SessionUser {
  id: string
  name: string
  email: string
  image: string | null
}

export function useAuth() {
  // Shared, SSR-safe session state. Populated once by the auth client plugin
  // (plugins/auth.client.ts) and read by the route middleware + components,
  // so no get-session call is needed on every navigation.
  const user = useState<SessionUser | null>('auth:user', () => null)

  async function refresh() {
    const { data } = await authClient.getSession()
    user.value = (data?.user as SessionUser | undefined) ?? null
  }

  async function signIn(email: string, password: string) {
    const res = await authClient.signIn.email({ email, password })
    if (!res.error) await refresh()
    return res
  }

  async function signUp(name: string, email: string, password: string) {
    const res = await authClient.signUp.email({ name, email, password })
    if (!res.error) await refresh()
    return res
  }

  async function signOut() {
    const res = await authClient.signOut()
    user.value = null
    return res
  }

  async function signInWithGithub() {
    // Absolute URL: a relative callbackURL would resolve against the backend
    // origin (:8000) after the OAuth redirect, landing the user off-app.
    return authClient.signIn.social({
      provider: 'github',
      callbackURL: `${window.location.origin}/dashboard`,
    })
  }

  async function signInWithGoogle() {
    return authClient.signIn.social({
      provider: 'google',
      callbackURL: `${window.location.origin}/dashboard`,
    })
  }

  return { user, refresh, signIn, signUp, signOut, signInWithGithub, signInWithGoogle }
}

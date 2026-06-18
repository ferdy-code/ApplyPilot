import { authClient } from '~/lib/auth'

export function useAuth() {
  const session = authClient.useSession()

  const user = computed(() => session.data?.user ?? null)

  async function signIn(email: string, password: string) {
    return authClient.signIn.email({ email, password })
  }

  async function signUp(name: string, email: string, password: string) {
    return authClient.signUp.email({ name, email, password })
  }

  async function signOut() {
    return authClient.signOut()
  }

  async function signInWithGithub() {
    return authClient.signIn.social({ provider: 'github', callbackURL: '/dashboard' })
  }

  async function signInWithGoogle() {
    return authClient.signIn.social({ provider: 'google', callbackURL: '/dashboard' })
  }

  return { user, signIn, signUp, signOut, signInWithGithub, signInWithGoogle }
}

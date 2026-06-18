<script setup lang="ts">
import { PhBriefcase, PhEnvelope, PhLock, PhGithubLogo, PhGoogleLogo } from '@phosphor-icons/vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

definePageMeta({ layout: false, middleware: 'auth' })

const { signIn, signInWithGithub, signInWithGoogle } = useAuth()

const form = reactive({ email: '', password: '' })
const errors = reactive({ email: '', password: '', general: '' })
const submitting = ref(false)
const socialLoading = ref<'github' | 'google' | null>(null)

function validate() {
  errors.email = form.email.trim() ? '' : 'Email is required'
  errors.password = form.password ? '' : 'Password is required'
  return !errors.email && !errors.password
}

async function handleSubmit() {
  if (!validate()) return
  submitting.value = true
  errors.general = ''
  const { error } = await signIn(form.email.trim(), form.password)
  if (error) {
    errors.general = error.message ?? 'Sign in failed. Please try again.'
    submitting.value = false
    return
  }
  await navigateTo('/dashboard')
}

async function handleGithub() {
  socialLoading.value = 'github'
  await signInWithGithub()
}

async function handleGoogle() {
  socialLoading.value = 'google'
  await signInWithGoogle()
}
</script>

<template>
  <div class="min-h-screen bg-background flex items-center justify-center px-4">
    <div class="w-full max-w-sm space-y-6">
      <div class="flex flex-col items-center gap-2 text-center">
        <NuxtLink to="/" class="flex items-center gap-2 text-foreground">
          <div
            class="flex size-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <PhBriefcase :size="20" weight="bold" />
          </div>
          <span class="text-xl font-bold">ApplyPilot</span>
        </NuxtLink>
        <p class="text-sm text-muted-foreground">Sign in to your account</p>
      </div>

      <Card>
        <CardContent class="pt-6">
          <div class="space-y-3">
            <Button variant="outline" class="w-full" :disabled="!!socialLoading" @click="handleGithub">
              <PhGithubLogo :size="16" weight="bold" />
              {{ socialLoading === 'github' ? 'Redirecting…' : 'Continue with GitHub' }}
            </Button>
            <Button variant="outline" class="w-full" :disabled="!!socialLoading" @click="handleGoogle">
              <PhGoogleLogo :size="16" weight="bold" />
              {{ socialLoading === 'google' ? 'Redirecting…' : 'Continue with Google' }}
            </Button>
          </div>

          <div class="relative my-5">
            <Separator />
            <span
              class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
              or
            </span>
          </div>

          <form class="space-y-4" @submit.prevent="handleSubmit">
            <p v-if="errors.general" class="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {{ errors.general }}
            </p>

            <div class="space-y-1.5">
              <Label for="email">Email</Label>
              <div class="relative">
                <PhEnvelope :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input id="email" v-model="form.email" type="email" placeholder="you@example.com" autocomplete="email"
                  class="pl-9" />
              </div>
              <p v-if="errors.email" class="text-xs text-destructive">{{ errors.email }}</p>
            </div>

            <div class="space-y-1.5">
              <Label for="password">Password</Label>
              <div class="relative">
                <PhLock :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input id="password" v-model="form.password" type="password" placeholder="••••••••"
                  autocomplete="current-password" class="pl-9" />
              </div>
              <p v-if="errors.password" class="text-xs text-destructive">{{ errors.password }}</p>
            </div>

            <Button type="submit" class="w-full" :disabled="submitting || !!socialLoading">
              {{ submitting ? 'Signing in…' : 'Sign in' }}
            </Button>
          </form>
        </CardContent>
      </Card>

      <p class="text-center text-sm text-muted-foreground">
        Don't have an account?
        <NuxtLink to="/register" class="font-medium text-foreground underline-offset-4 hover:underline">
          Sign up
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

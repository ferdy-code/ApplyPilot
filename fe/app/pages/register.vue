<script setup lang="ts">
import { PhEnvelope, PhLock, PhUser, PhGithubLogo, PhGoogleLogo } from '@phosphor-icons/vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

definePageMeta({ layout: false, middleware: 'auth' })

const { signUp, signInWithGithub, signInWithGoogle } = useAuth()

const form = reactive({ name: '', email: '', password: '' })
const errors = reactive({ name: '', email: '', password: '', general: '' })
const submitting = ref(false)
const socialLoading = ref<'github' | 'google' | null>(null)

function validate() {
  errors.name = form.name.trim() ? '' : 'Name is required'
  errors.email = form.email.trim() ? '' : 'Email is required'
  errors.password = form.password ? '' : 'Password is required'
  return !errors.name && !errors.email && !errors.password
}

async function handleSubmit() {
  if (!validate()) return
  submitting.value = true
  errors.general = ''
  const { error } = await signUp(form.name.trim(), form.email.trim(), form.password)
  if (error) {
    errors.general = error.message ?? 'Sign up failed. Please try again.'
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
  <div class="auth-page">
    <!-- Left: brand panel -->
    <aside class="brand-panel">
      <div class="brand-glow" aria-hidden="true" />
      <div class="brand-grain" aria-hidden="true" />
      <div class="panel-body">
        <NuxtLink to="/" class="panel-logo">
          <span class="logo-dot" />
          <span class="logo-text">ApplyPilot</span>
        </NuxtLink>

        <div class="panel-middle">
          <h2 class="panel-headline">
            Your search.<br />
            <em>Organized.</em>
          </h2>
          <ul class="panel-list">
            <li>
              <span class="list-bullet" />
              Track every application in one place
            </li>
            <li>
              <span class="list-bullet" />
              Move from wishlist to offer with clarity
            </li>
            <li>
              <span class="list-bullet" />
              Never miss a follow-up again
            </li>
          </ul>
        </div>

        <p class="panel-footer-text">Built to get you hired.</p>
      </div>
    </aside>

    <!-- Right: form panel -->
    <main class="form-panel">
      <div class="form-body">
        <div class="form-head">
          <h1 class="form-title">Create your account</h1>
          <p class="form-sub">Start tracking your job search for free</p>
        </div>

        <div class="social-row">
          <Button
            variant="outline"
            class="w-full"
            :disabled="!!socialLoading"
            @click="handleGithub"
          >
            <PhGithubLogo :size="16" />
            {{ socialLoading === 'github' ? 'Redirecting…' : 'Continue with GitHub' }}
          </Button>
          <Button
            variant="outline"
            class="w-full"
            :disabled="!!socialLoading"
            @click="handleGoogle"
          >
            <PhGoogleLogo :size="16" />
            {{ socialLoading === 'google' ? 'Redirecting…' : 'Continue with Google' }}
          </Button>
        </div>

        <div class="or-row">
          <Separator />
          <span class="or-text">or</span>
        </div>

        <form class="cred-form" @submit.prevent="handleSubmit">
          <p v-if="errors.general" class="error-banner">{{ errors.general }}</p>

          <div class="field">
            <Label for="name">Name</Label>
            <div class="input-wrap">
              <PhUser :size="15" class="input-icon" />
              <Input
                id="name"
                v-model="form.name"
                type="text"
                placeholder="Your name"
                autocomplete="name"
                class="pl-9"
              />
            </div>
            <p v-if="errors.name" class="field-err">{{ errors.name }}</p>
          </div>

          <div class="field">
            <Label for="email">Email</Label>
            <div class="input-wrap">
              <PhEnvelope :size="15" class="input-icon" />
              <Input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="you@example.com"
                autocomplete="email"
                class="pl-9"
              />
            </div>
            <p v-if="errors.email" class="field-err">{{ errors.email }}</p>
          </div>

          <div class="field">
            <Label for="password">Password</Label>
            <div class="input-wrap">
              <PhLock :size="15" class="input-icon" />
              <Input
                id="password"
                v-model="form.password"
                type="password"
                placeholder="••••••••"
                autocomplete="new-password"
                class="pl-9"
              />
            </div>
            <p v-if="errors.password" class="field-err">{{ errors.password }}</p>
          </div>

          <Button type="submit" class="w-full mt-1" :disabled="submitting || !!socialLoading">
            {{ submitting ? 'Creating account…' : 'Create account' }}
          </Button>
        </form>

        <p class="switch-prompt">
          Already have an account?
          <NuxtLink to="/login" class="switch-link">Sign in</NuxtLink>
        </p>
      </div>
    </main>
  </div>
</template>

<style scoped>
.auth-page {
  min-height: 100svh;
  display: grid;
  grid-template-columns: 42% 58%;
}

/* ─── Brand panel ─── */
.brand-panel {
  background: #07070D;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.brand-glow {
  position: absolute;
  top: -15%;
  left: -30%;
  width: 130%;
  height: 85%;
  background: radial-gradient(ellipse at 35% 40%, rgba(232, 165, 71, 0.08) 0%, transparent 60%);
  pointer-events: none;
}
.brand-grain {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.04;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 200px 200px;
}
.panel-body {
  position: relative;
  z-index: 1;
  padding: 3rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  color: #ECE7E2;
}
.panel-logo {
  display: inline-flex;
  align-items: center;
  gap: 0.575rem;
  text-decoration: none;
  color: #ECE7E2;
}
.logo-dot {
  display: block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #E8A547;
  box-shadow: 0 0 8px rgba(232, 165, 71, 0.5);
}
.logo-text {
  font-size: 0.9375rem;
  font-weight: 600;
  letter-spacing: -0.015em;
}
.panel-middle {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem 0;
}
.panel-headline {
  font-family: 'Cormorant', Georgia, serif;
  font-size: clamp(2.5rem, 3.5vw, 3.625rem);
  font-weight: 400;
  line-height: 1.08;
  letter-spacing: -0.025em;
  margin-bottom: 2rem;
  color: #ECE7E2;
}
.panel-headline em {
  font-style: italic;
  color: #E8A547;
}
.panel-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  font-size: 0.9375rem;
  color: rgba(236, 231, 226, 0.5);
}
.panel-list li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.list-bullet {
  display: block;
  flex-shrink: 0;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #E8A547;
  opacity: 0.6;
}
.panel-footer-text {
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.055em;
  color: rgba(236, 231, 226, 0.18);
  text-transform: uppercase;
}

/* ─── Form panel ─── */
.form-panel {
  background: oklch(0.99 0.003 85);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}
.form-body {
  width: 100%;
  max-width: 360px;
  display: flex;
  flex-direction: column;
}
.form-head {
  margin-bottom: 2rem;
}
.form-title {
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: -0.025em;
  color: oklch(0.12 0.008 258);
  margin-bottom: 0.35rem;
  font-family: 'DM Sans', system-ui, sans-serif;
}
.form-sub {
  font-size: 0.9rem;
  color: oklch(0.52 0.012 258);
}
.social-row {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}
.or-row {
  position: relative;
  margin: 1.375rem 0;
}
.or-text {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: oklch(0.99 0.003 85);
  padding: 0 0.5rem;
  font-size: 0.75rem;
  color: oklch(0.52 0.012 258);
}
.cred-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.error-banner {
  background: oklch(0.96 0.015 27);
  color: oklch(0.577 0.245 27.325);
  font-size: 0.875rem;
  padding: 0.625rem 0.875rem;
  border-radius: 0.5rem;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}
.input-wrap {
  position: relative;
}
.input-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: oklch(0.52 0.012 258);
  pointer-events: none;
  z-index: 1;
}
.field-err {
  font-size: 0.75rem;
  color: oklch(0.577 0.245 27.325);
}
.switch-prompt {
  text-align: center;
  font-size: 0.875rem;
  color: oklch(0.52 0.012 258);
  margin-top: 1.5rem;
}
.switch-link {
  font-weight: 500;
  color: oklch(0.12 0.008 258);
  text-underline-offset: 3px;
  text-decoration: underline;
  text-decoration-color: oklch(0.91 0.004 85);
  transition: text-decoration-color 0.15s;
}
.switch-link:hover {
  text-decoration-color: oklch(0.12 0.008 258);
}

/* ─── Responsive ─── */
@media (max-width: 768px) {
  .auth-page {
    grid-template-columns: 1fr;
  }
  .brand-panel {
    display: none;
  }
  .form-panel {
    min-height: 100svh;
  }
}
</style>

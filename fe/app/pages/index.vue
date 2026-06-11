<script setup lang="ts">
import {
  PhBriefcase,
  PhStack,
  PhEyeSlash,
  PhBellSlash,
  PhGauge,
  PhFunnel,
  PhNotepad,
  PhArrowRight,
} from '@phosphor-icons/vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

definePageMeta({ layout: false })

const problems = [
  {
    icon: PhStack,
    title: 'Lost applications',
    description: 'You apply, then forget where things stand. Every company becomes a blur after a few weeks.',
  },
  {
    icon: PhEyeSlash,
    title: 'No pipeline visibility',
    description: "You can't see your progress at a glance. Are you active enough? Stalled? Impossible to tell.",
  },
  {
    icon: PhBellSlash,
    title: 'Missed follow-ups',
    description: 'Deadlines and next steps fall through the cracks. Opportunities slip away from inaction.',
  },
]

const solutions = [
  {
    icon: PhGauge,
    title: 'Live dashboard',
    description: 'See your full pipeline at a glance — total applications, active reviews, interviews, and offers.',
  },
  {
    icon: PhFunnel,
    title: 'Status tracking',
    description: 'Filter by Applied, In Review, Interview, Offered, or Rejected. Always know exactly where you stand.',
  },
  {
    icon: PhNotepad,
    title: 'Notes per application',
    description: 'Record contacts, interview prep, and follow-up context right alongside each application.',
  },
]
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <!-- Navbar -->
    <header class="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div class="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <NuxtLink to="/" class="flex items-center gap-2 font-semibold">
          <div class="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <PhBriefcase :size="15" weight="bold" />
          </div>
          ApplyPilot
        </NuxtLink>
        <Button size="sm" as-child>
          <NuxtLink to="/dashboard">
            Get Started
            <PhArrowRight :size="14" />
          </NuxtLink>
        </Button>
      </div>
    </header>

    <!-- Hero -->
    <section class="py-24">
      <div class="mx-auto max-w-5xl px-6 text-center">
        <h1 class="text-5xl font-bold tracking-tight leading-tight">
          Track every application.<br />
          <span class="text-primary">Land the role.</span>
        </h1>
        <p class="mx-auto mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed">
          Stop juggling spreadsheets and scattered emails. ApplyPilot keeps your entire job search organized so you can focus on what matters.
        </p>
        <div class="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" as-child>
            <NuxtLink to="/dashboard">
              Start tracking — free
              <PhArrowRight :size="16" />
            </NuxtLink>
          </Button>
          <Button size="lg" variant="ghost" as-child>
            <NuxtLink to="/dashboard">See dashboard</NuxtLink>
          </Button>
        </div>
      </div>
    </section>

    <!-- Problem -->
    <section class="bg-muted/40 py-20">
      <div class="mx-auto max-w-5xl px-6">
        <div class="mb-12 text-center">
          <p class="text-xs font-semibold uppercase tracking-widest text-muted-foreground">The problem</p>
          <h2 class="mt-3 text-2xl font-semibold">The job search is chaotic by default.</h2>
          <p class="mt-3 text-muted-foreground">
            Most people manage their search across email, notes apps, and memory. It doesn't scale.
          </p>
        </div>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Card v-for="item in problems" :key="item.title">
            <CardHeader class="pb-3">
              <div class="mb-3 flex size-10 items-center justify-center rounded-lg bg-muted">
                <component :is="item.icon" :size="20" class="text-foreground" />
              </div>
              <p class="font-semibold">{{ item.title }}</p>
            </CardHeader>
            <CardContent>
              <p class="text-sm text-muted-foreground leading-relaxed">{{ item.description }}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>

    <!-- Solution -->
    <section class="py-20">
      <div class="mx-auto max-w-5xl px-6">
        <div class="mb-12 text-center">
          <p class="text-xs font-semibold uppercase tracking-widest text-muted-foreground">The solution</p>
          <h2 class="mt-3 text-2xl font-semibold">ApplyPilot brings order to the chaos.</h2>
          <p class="mt-3 text-muted-foreground">
            One place for every application, every status, every note.
          </p>
        </div>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Card v-for="item in solutions" :key="item.title">
            <CardHeader class="pb-3">
              <div class="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <component :is="item.icon" :size="20" class="text-primary" />
              </div>
              <p class="font-semibold">{{ item.title }}</p>
            </CardHeader>
            <CardContent>
              <p class="text-sm text-muted-foreground leading-relaxed">{{ item.description }}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="bg-primary py-20 text-primary-foreground">
      <div class="mx-auto max-w-5xl px-6 text-center">
        <h2 class="text-3xl font-bold tracking-tight">Your next role starts here.</h2>
        <p class="mt-4 text-lg opacity-80">
          Stop guessing where things stand. Start tracking.
        </p>
        <div class="mt-10">
          <Button size="lg" variant="secondary" as-child>
            <NuxtLink to="/dashboard">
              Open ApplyPilot
              <PhArrowRight :size="16" />
            </NuxtLink>
          </Button>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t py-6">
      <div class="mx-auto max-w-5xl px-6 text-center text-sm text-muted-foreground">
        © 2026 ApplyPilot. Built to get you hired.
      </div>
    </footer>
  </div>
</template>

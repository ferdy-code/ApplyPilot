<script setup lang="ts">
import { PhPlus, PhSparkle, PhArrowRight } from '@phosphor-icons/vue'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import EmptyState from '@/components/common/EmptyState.vue'
import type { JobAnalysis } from '~/composables/useJobAnalyses'

definePageMeta({ title: 'Job Analyzer', middleware: 'auth' })

const { analyses, pending, fetchAnalyses } = useJobAnalyses()

onMounted(fetchAnalyses)

function scoreVariant(score: number | null) {
  if (score === null) return 'secondary' as const
  if (score >= 70) return 'offer' as const
  if (score >= 40) return 'interview' as const
  return 'rejected' as const
}

function scoreLabel(score: number | null) {
  if (score === null) return null
  if (score >= 70) return 'Strong fit'
  if (score >= 40) return 'Partial fit'
  return 'Weak fit'
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function snippet(text: string | null, max = 120) {
  if (!text) return ''
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text
}

function titleFor(a: JobAnalysis) {
  return a.jobTitle || 'Untitled role'
}
</script>

<template>
  <div class="p-6 space-y-5">
    <div class="flex items-start justify-between gap-4">
      <div>
        <h1 class="text-xl font-semibold tracking-tight">Job Analyzer</h1>
        <p class="text-sm text-muted-foreground mt-0.5">
          <span class="font-mono tabular-nums">{{ analyses.length }}</span>
          analysis{{ analyses.length !== 1 ? 'es' : '' }} saved
        </p>
      </div>
      <Button size="sm" as-child>
        <NuxtLink to="/job-analyzer/new">
          <PhSparkle :size="15" />
          New Analysis
        </NuxtLink>
      </Button>
    </div>

    <div v-if="pending" class="py-12 text-center text-sm text-muted-foreground">
      Loading analyses…
    </div>

    <div v-else-if="analyses.length > 0" class="grid gap-3 sm:grid-cols-2">
      <button
        v-for="a in analyses"
        :key="a.id"
        type="button"
        class="group flex flex-col gap-3 rounded-xl border bg-card p-4 text-left transition-all hover:border-border hover:shadow-sm hover:-translate-y-0.5"
        @click="navigateTo(`/job-analyzer/${a.id}`)"
      >
        <div class="flex items-start justify-between gap-3">
          <span class="font-semibold leading-snug">{{ titleFor(a) }}</span>
          <Badge v-if="a.fitScore !== null" :variant="scoreVariant(a.fitScore)" class="shrink-0 font-mono tabular-nums">
            {{ a.fitScore }}%
          </Badge>
        </div>

        <div v-if="a.fitScore !== null" class="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            class="h-full rounded-full transition-all"
            :class="{
              'bg-green-500': a.fitScore >= 70,
              'bg-amber-500': a.fitScore >= 40 && a.fitScore < 70,
              'bg-red-400': a.fitScore < 40,
            }"
            :style="{ width: `${a.fitScore}%` }"
          />
        </div>

        <p v-if="snippet(a.summary)" class="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {{ snippet(a.summary) }}
        </p>

        <div class="flex items-center justify-between mt-auto pt-1">
          <span class="text-xs text-muted-foreground">{{ formatDate(a.createdAt) }}</span>
          <span
            v-if="a.fitScore !== null"
            class="text-xs font-medium"
            :class="{
              'text-green-600': a.fitScore >= 70,
              'text-amber-600': a.fitScore >= 40 && a.fitScore < 70,
              'text-red-500': a.fitScore < 40,
            }"
          >
            {{ scoreLabel(a.fitScore) }}
          </span>
        </div>
      </button>
    </div>

    <EmptyState
      v-else
      :icon="PhSparkle"
      title="No analyses yet"
      description="Paste a job description and your skills to get an instant breakdown, fit score, and cover-letter draft."
    >
      <Button size="sm" as-child>
        <NuxtLink to="/job-analyzer/new">
          <PhSparkle :size="15" />
          Analyze a job description
        </NuxtLink>
      </Button>
    </EmptyState>
  </div>
</template>

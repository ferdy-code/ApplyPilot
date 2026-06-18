<script setup lang="ts">
import { PhPlus, PhSparkle } from '@phosphor-icons/vue'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import EmptyState from '@/components/common/EmptyState.vue'
import type { JobAnalysis } from '~/composables/useJobAnalyses'

definePageMeta({ title: 'Job Analyzer', middleware: 'auth' })

const { analyses, pending, fetchAnalyses } = useJobAnalyses()

onMounted(fetchAnalyses)

// Map a fit score to a status-style badge variant (green / amber / red) so the
// list reuses the existing Badge color palette.
function scoreVariant(score: number | null) {
  if (score === null) return 'secondary' as const
  if (score >= 70) return 'offer' as const
  if (score >= 40) return 'interview' as const
  return 'rejected' as const
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function snippet(text: string | null, max = 140) {
  if (!text) return ''
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text
}

function titleFor(a: JobAnalysis) {
  return a.jobTitle || 'Untitled role'
}
</script>

<template>
  <div class="p-6 space-y-6">
    <div class="flex items-start justify-between">
      <div>
        <h1 class="text-xl font-semibold">Job Analyzer</h1>
        <p class="text-sm text-muted-foreground">
          {{ analyses.length }} analysis{{ analyses.length !== 1 ? 's' : '' }} saved
        </p>
      </div>
      <Button size="sm" as-child>
        <NuxtLink to="/job-analyzer/new">
          <PhSparkle :size="16" />
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
        class="flex flex-col gap-2 rounded-lg border border-border bg-card p-4 text-left transition-colors hover:bg-accent"
        @click="navigateTo(`/job-analyzer/${a.id}`)"
      >
        <div class="flex items-start justify-between gap-3">
          <span class="font-medium leading-snug">{{ titleFor(a) }}</span>
          <Badge v-if="a.fitScore !== null" :variant="scoreVariant(a.fitScore)" class="shrink-0">
            {{ a.fitScore }}% match
          </Badge>
        </div>
        <p class="line-clamp-2 text-sm text-muted-foreground">
          {{ snippet(a.summary) || 'No summary available.' }}
        </p>
        <span class="text-xs text-muted-foreground">{{ formatDate(a.createdAt) }}</span>
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
          <PhSparkle :size="16" />
          Analyze a job description
        </NuxtLink>
      </Button>
    </EmptyState>
  </div>
</template>

<script setup lang="ts">
import { PhArrowLeft, PhTrash, PhX, PhCopy, PhCheck, PhSparkle } from '@phosphor-icons/vue'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { JobAnalysis } from '~/composables/useJobAnalyses'

definePageMeta({ title: 'Analysis', middleware: 'auth' })

const route = useRoute()
const { analyses, pending, fetchAnalyses, deleteAnalysis } = useJobAnalyses()

onMounted(async () => {
  if (analyses.value.length === 0) await fetchAnalyses()
})

const analysis = computed<JobAnalysis | undefined>(() =>
  analyses.value.find((a) => a.id === Number(route.params.id)),
)

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function scoreVariant(score: number | null) {
  if (score === null) return 'secondary' as const
  if (score >= 70) return 'offer' as const
  if (score >= 40) return 'interview' as const
  return 'rejected' as const
}

function scoreBarClass(score: number | null) {
  if (score === null) return 'bg-muted-foreground'
  if (score >= 70) return 'bg-green-500'
  if (score >= 40) return 'bg-amber-500'
  return 'bg-red-400'
}

function scoreSummary(score: number | null) {
  if (score === null) return ''
  if (score >= 70) return 'Strong fit — you meet most of the requirements.'
  if (score >= 40) return 'Partial fit — some gaps worth addressing.'
  return 'Weak fit — significant skill gaps present.'
}

// ── Copy cover letter ─────────────────────────────────────────
const copied = ref(false)
async function copyCoverLetter() {
  if (!analysis.value?.coverLetter) return
  try {
    await navigator.clipboard.writeText(analysis.value.coverLetter)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {
    // Clipboard unavailable in insecure context — ignore silently.
  }
}

// ── Delete confirm ────────────────────────────────────────────
const isConfirmingDelete = ref(false)
async function confirmDelete() {
  if (!analysis.value) return
  await deleteAnalysis(analysis.value.id)
  await navigateTo('/job-analyzer')
}
</script>

<template>
  <div class="p-6 max-w-2xl space-y-5">
    <Button variant="ghost" size="sm" class="-ml-2 text-muted-foreground" as-child>
      <NuxtLink to="/job-analyzer">
        <PhArrowLeft :size="15" />
        Job Analyzer
      </NuxtLink>
    </Button>

    <!-- Loading -->
    <div v-if="pending && !analysis" class="py-16 text-center text-sm text-muted-foreground">
      Loading analysis…
    </div>

    <!-- Not found -->
    <div v-else-if="!analysis" class="py-16 text-center">
      <p class="mb-4 text-muted-foreground">Analysis not found.</p>
      <Button variant="outline" as-child>
        <NuxtLink to="/job-analyzer">Back to Job Analyzer</NuxtLink>
      </Button>
    </div>

    <!-- Detail -->
    <template v-else>
      <!-- Header -->
      <div class="flex items-start justify-between gap-4">
        <div class="min-w-0">
          <h1 class="text-2xl font-semibold tracking-tight">{{ analysis.jobTitle || 'Untitled role' }}</h1>
          <p class="text-sm text-muted-foreground mt-0.5">Analyzed {{ formatDate(analysis.createdAt) }}</p>
        </div>

        <div class="flex shrink-0 items-center gap-2">
          <template v-if="isConfirmingDelete">
            <span class="text-sm text-muted-foreground">Delete this?</span>
            <Button variant="destructive" size="sm" @click="confirmDelete">
              <PhTrash :size="14" />
              Delete
            </Button>
            <Button variant="ghost" size="icon-sm" @click="isConfirmingDelete = false">
              <PhX :size="14" />
            </Button>
          </template>
          <Button
            v-else
            variant="ghost"
            size="icon-sm"
            class="text-muted-foreground hover:text-destructive"
            @click="isConfirmingDelete = true"
          >
            <PhTrash :size="14" />
          </Button>
        </div>
      </div>

      <!-- Fit score card -->
      <Card v-if="analysis.fitScore !== null">
        <CardContent class="pt-5 pb-5">
          <div class="flex items-start justify-between gap-4 mb-4">
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Fit Score
              </p>
              <div class="flex items-baseline gap-2">
                <span class="text-4xl font-mono font-semibold tabular-nums leading-none">
                  {{ analysis.fitScore }}
                </span>
                <span class="text-lg text-muted-foreground font-mono">/ 100</span>
              </div>
            </div>
            <Badge :variant="scoreVariant(analysis.fitScore)" class="text-sm px-3 py-1">
              {{ analysis.fitScore }}% match
            </Badge>
          </div>

          <div class="h-2 w-full overflow-hidden rounded-full bg-muted mb-3">
            <div
              class="h-full rounded-full transition-all duration-500"
              :class="scoreBarClass(analysis.fitScore)"
              :style="{ width: `${analysis.fitScore}%` }"
            />
          </div>

          <p class="text-sm text-muted-foreground">{{ scoreSummary(analysis.fitScore) }}</p>

          <div
            v-if="analysis.matchedSkills?.length || analysis.missingSkills?.length"
            class="mt-4 grid gap-3 sm:grid-cols-2"
          >
            <div v-if="analysis.matchedSkills?.length" class="space-y-2">
              <p class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Matched</p>
              <div class="flex flex-wrap gap-1.5">
                <Badge v-for="s in analysis.matchedSkills" :key="s" variant="offer">{{ s }}</Badge>
              </div>
            </div>
            <div v-if="analysis.missingSkills?.length" class="space-y-2">
              <p class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Missing</p>
              <div class="flex flex-wrap gap-1.5">
                <Badge v-for="s in analysis.missingSkills" :key="s" variant="outline">{{ s }}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Summary -->
      <Card v-if="analysis.summary">
        <CardContent class="pt-5 pb-5">
          <p class="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Summary</p>
          <p class="text-sm leading-relaxed text-muted-foreground">{{ analysis.summary }}</p>
        </CardContent>
      </Card>

      <!-- Responsibilities + Requirements -->
      <div
        v-if="analysis.responsibilities?.length || analysis.requirements?.length"
        class="grid gap-4 sm:grid-cols-2"
      >
        <Card v-if="analysis.responsibilities?.length">
          <CardContent class="pt-5 pb-5">
            <p class="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Responsibilities</p>
            <ul class="space-y-2">
              <li
                v-for="r in analysis.responsibilities"
                :key="r"
                class="flex gap-2 text-sm text-muted-foreground"
              >
                <span class="mt-1.5 h-1.5 w-1.5 rounded-full bg-muted-foreground/40 shrink-0" />
                {{ r }}
              </li>
            </ul>
          </CardContent>
        </Card>
        <Card v-if="analysis.requirements?.length">
          <CardContent class="pt-5 pb-5">
            <p class="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Requirements</p>
            <ul class="space-y-2">
              <li
                v-for="r in analysis.requirements"
                :key="r"
                class="flex gap-2 text-sm text-muted-foreground"
              >
                <span class="mt-1.5 h-1.5 w-1.5 rounded-full bg-muted-foreground/40 shrink-0" />
                {{ r }}
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <!-- Keywords -->
      <Card v-if="analysis.keywords?.length">
        <CardContent class="pt-5 pb-5">
          <p class="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Keywords</p>
          <div class="flex flex-wrap gap-1.5">
            <Badge v-for="k in analysis.keywords" :key="k" variant="secondary">{{ k }}</Badge>
          </div>
        </CardContent>
      </Card>

      <!-- Cover letter -->
      <Card v-if="analysis.coverLetter">
        <CardContent class="pt-5 pb-5 space-y-3">
          <div class="flex items-center justify-between gap-3">
            <p class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cover Letter Draft</p>
            <Button variant="outline" size="sm" @click="copyCoverLetter">
              <component :is="copied ? PhCheck : PhCopy" :size="14" />
              {{ copied ? 'Copied!' : 'Copy' }}
            </Button>
          </div>
          <Separator />
          <p class="text-sm leading-[1.8] text-muted-foreground whitespace-pre-wrap">{{ analysis.coverLetter }}</p>
        </CardContent>
      </Card>
    </template>
  </div>
</template>

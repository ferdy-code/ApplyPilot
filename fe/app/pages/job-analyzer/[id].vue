<script setup lang="ts">
import { PhArrowLeft, PhTrash, PhX, PhCopy, PhCheck } from '@phosphor-icons/vue'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import ErrorState from '@/components/common/ErrorState.vue'
import type { JobAnalysis } from '~/composables/useJobAnalyses'

definePageMeta({ title: 'Analysis', middleware: 'auth' })

const route = useRoute()
const { analyses, pending, error, fetchAnalyses, deleteAnalysis } = useJobAnalyses()

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

// Fit-score band → reused Badge variant + progress-bar fill color.
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
  return 'bg-red-500'
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
    // Clipboard may be unavailable (insecure context); ignore silently.
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
  <div class="p-6 max-w-2xl space-y-6">
    <Button variant="ghost" size="sm" class="-ml-2" as-child>
      <NuxtLink to="/job-analyzer">
        <PhArrowLeft :size="16" />
        Job Analyzer
      </NuxtLink>
    </Button>

    <!-- Loading -->
    <div v-if="pending && !analysis" class="py-16 text-center text-sm text-muted-foreground">
      Loading analysis…
    </div>

    <!-- Error -->
    <ErrorState v-else-if="error" :message="error" :on-retry="fetchAnalyses" />

    <!-- Not found -->
    <div v-else-if="!analysis" class="py-16 text-center">
      <p class="mb-4 text-muted-foreground">Analysis not found.</p>
      <Button variant="outline" as-child>
        <NuxtLink to="/job-analyzer">Back to Job Analyzer</NuxtLink>
      </Button>
    </div>

    <!-- Detail -->
    <template v-else>
      <div class="flex items-start justify-between gap-4">
        <div class="min-w-0 space-y-1">
          <h1 class="text-2xl font-semibold">{{ analysis.jobTitle || 'Untitled role' }}</h1>
          <p class="text-sm text-muted-foreground">Analyzed {{ formatDate(analysis.createdAt) }}</p>
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

      <!-- Fit score -->
      <Card v-if="analysis.fitScore !== null">
        <CardContent class="space-y-4 pt-6">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium">Fit score</span>
            <Badge :variant="scoreVariant(analysis.fitScore)">{{ analysis.fitScore }}% match</Badge>
          </div>
          <div class="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              class="h-full rounded-full transition-all"
              :class="scoreBarClass(analysis.fitScore)"
              :style="{ width: `${analysis.fitScore}%` }"
            />
          </div>

          <div v-if="analysis.matchedSkills?.length" class="space-y-1.5">
            <p class="text-xs font-medium uppercase text-muted-foreground">Matched skills</p>
            <div class="flex flex-wrap gap-1.5">
              <Badge v-for="s in analysis.matchedSkills" :key="s" variant="offer">{{ s }}</Badge>
            </div>
          </div>
          <div v-if="analysis.missingSkills?.length" class="space-y-1.5">
            <p class="text-xs font-medium uppercase text-muted-foreground">Missing skills</p>
            <div class="flex flex-wrap gap-1.5">
              <Badge v-for="s in analysis.missingSkills" :key="s" variant="outline">{{ s }}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Summary -->
      <Card v-if="analysis.summary">
        <CardContent class="pt-6">
          <h2 class="mb-2 text-sm font-medium">Summary</h2>
          <p class="text-sm leading-relaxed text-muted-foreground">{{ analysis.summary }}</p>
        </CardContent>
      </Card>

      <!-- Responsibilities + Requirements -->
      <div
        v-if="analysis.responsibilities?.length || analysis.requirements?.length"
        class="grid gap-4 sm:grid-cols-2"
      >
        <Card v-if="analysis.responsibilities?.length">
          <CardContent class="pt-6">
            <h2 class="mb-3 text-sm font-medium">Responsibilities</h2>
            <ul class="list-inside list-disc space-y-1.5 text-sm text-muted-foreground">
              <li v-for="r in analysis.responsibilities" :key="r" class="marker:text-muted-foreground/50">
                {{ r }}
              </li>
            </ul>
          </CardContent>
        </Card>
        <Card v-if="analysis.requirements?.length">
          <CardContent class="pt-6">
            <h2 class="mb-3 text-sm font-medium">Requirements</h2>
            <ul class="list-inside list-disc space-y-1.5 text-sm text-muted-foreground">
              <li v-for="r in analysis.requirements" :key="r" class="marker:text-muted-foreground/50">
                {{ r }}
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <!-- Keywords -->
      <Card v-if="analysis.keywords?.length">
        <CardContent class="pt-6">
          <h2 class="mb-3 text-sm font-medium">Keywords</h2>
          <div class="flex flex-wrap gap-1.5">
            <Badge v-for="k in analysis.keywords" :key="k" variant="secondary">{{ k }}</Badge>
          </div>
        </CardContent>
      </Card>

      <!-- Cover letter -->
      <Card v-if="analysis.coverLetter">
        <CardContent class="space-y-3 pt-6">
          <div class="flex items-center justify-between gap-3">
            <h2 class="text-sm font-medium">Cover letter draft</h2>
            <Button variant="outline" size="sm" @click="copyCoverLetter">
              <component :is="copied ? PhCheck : PhCopy" :size="14" />
              {{ copied ? 'Copied' : 'Copy' }}
            </Button>
          </div>
          <Separator />
          <p class="whitespace-pre-wrap text-sm leading-relaxed">{{ analysis.coverLetter }}</p>
        </CardContent>
      </Card>
    </template>
  </div>
</template>

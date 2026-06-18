<script setup lang="ts">
import {
  PhPaperPlaneTilt,
  PhUsers,
  PhTrophy,
  PhSmileySad,
  PhClock,
  PhArrowRight,
  PhPlus,
} from '@phosphor-icons/vue'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import EmptyState from '@/components/common/EmptyState.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import type { Application, ApplicationStatus } from '~/composables/useApplications'

definePageMeta({ middleware: 'auth' })

const { applications, pending, error, fetchApplications } = useApplications()

onMounted(fetchApplications)

const statusLabel: Record<ApplicationStatus, string> = {
  wishlist: 'Wishlist',
  applied: 'Applied',
  interview: 'Interview',
  offer: 'Offer',
  rejected: 'Rejected',
  archived: 'Archived',
}

// --- Funnel metrics ---------------------------------------------------------
// "Applied" = submitted applications (applied / interview / offer / rejected),
// excluding wishlist (not yet applied) and archived (hidden).
const submitted = computed(
  () => applications.value.filter((a) => a.status !== 'wishlist' && a.status !== 'archived'),
)
const interviews = computed(() => applications.value.filter((a) => a.status === 'interview').length)
const offers = computed(() => applications.value.filter((a) => a.status === 'offer').length)
const rejected = computed(() => applications.value.filter((a) => a.status === 'rejected').length)
const rejectionRate = computed(() =>
  submitted.value.length ? Math.round((rejected.value / submitted.value.length) * 100) : null,
)

const stats = computed(() => [
  { label: 'Applied', value: String(submitted.value.length), icon: PhPaperPlaneTilt, color: 'text-zinc-500' },
  { label: 'Interviews', value: String(interviews.value), icon: PhUsers, color: 'text-amber-500' },
  { label: 'Offers', value: String(offers.value), icon: PhTrophy, color: 'text-green-500' },
  {
    label: 'Rejection rate',
    value: rejectionRate.value === null ? '—' : `${rejectionRate.value}%`,
    icon: PhSmileySad,
    color: 'text-red-500',
  },
])

// --- Pipeline (Kanban) ------------------------------------------------------
// Archived is excluded — it's a hide state, not part of the active funnel.
const statusColumns: ApplicationStatus[] = ['wishlist', 'applied', 'interview', 'offer', 'rejected']

const groupedByStatus = computed(() => {
  const groups = {
    wishlist: [] as Application[],
    applied: [] as Application[],
    interview: [] as Application[],
    offer: [] as Application[],
    rejected: [] as Application[],
    archived: [] as Application[],
  }
  for (const a of applications.value) groups[a.status].push(a)
  return groups
})

// Column accent dot color, mirroring the Badge status palette (ui/badge).
const statusAccent: Record<string, string> = {
  wishlist: 'bg-violet-500',
  applied: 'bg-zinc-400',
  interview: 'bg-amber-500',
  offer: 'bg-green-500',
  rejected: 'bg-red-500',
}

const recentApplications = computed(() => applications.value.slice(0, 3))

const isLoading = computed(() => pending.value && applications.value.length === 0)
const isEmpty = computed(() => applications.value.length === 0)
</script>

<template>
  <div class="p-6 space-y-6">
    <div>
      <h1 class="text-xl font-semibold">Dashboard</h1>
      <p class="text-sm text-muted-foreground">Track your job search progress</p>
    </div>

    <!-- Loading -->
    <template v-if="isLoading">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card v-for="n in 4" :key="n">
          <CardHeader class="pb-2 space-y-2">
            <Skeleton class="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton class="h-8 w-16" />
          </CardContent>
        </Card>
      </div>
      <Skeleton class="h-48 w-full" />
    </template>

    <!-- Error -->
    <ErrorState v-else-if="error" :message="error || 'Failed to load dashboard'" :on-retry="fetchApplications" />

    <!-- Content -->
    <template v-else>
      <!-- Metrics -->
      <!-- <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card v-for="stat in stats" :key="stat.label" class="transition-shadow hover:shadow-sm">
          <CardHeader class="pb-2">
            <div class="flex items-center justify-between">
              <CardTitle class="text-sm font-medium text-muted-foreground">
                {{ stat.label }}
              </CardTitle>
              <component :is="stat.icon" :size="18" :class="stat.color" />
            </div>
          </CardHeader>
          <CardContent>
            <div class="text-3xl font-bold tabular-nums">{{ stat.value }}</div>
          </CardContent>
        </Card>
      </div> -->

      <!-- Empty -->
      <!-- <EmptyState
        v-if="isEmpty"
        :icon="PhPlus"
        title="No applications yet"
        description="Add your first application to start tracking your pipeline."
      >
        <Button size="sm" as-child>
          <NuxtLink to="/applications/new">
            <PhPlus :size="16" />
            Add application
          </NuxtLink>
        </Button>
      </EmptyState> -->

      <!-- <template> -->
      <!-- Pipeline -->
      <div>
        <h2 class="mb-3 text-sm font-medium text-muted-foreground">Pipeline</h2>
        <div class="flex gap-4 overflow-x-auto pb-2">
          <div v-for="status in statusColumns" :key="status" class="w-64 shrink-0 rounded-lg border bg-muted/30 p-3">
            <div class="mb-3 flex items-center gap-2">
              <span class="h-2 w-2 rounded-full" :class="statusAccent[status]" />
              <span class="text-sm font-medium">{{ statusLabel[status] }}</span>
              <span class="ml-auto rounded-full bg-background px-1.5 py-0.5 text-xs tabular-nums text-muted-foreground">
                {{ groupedByStatus[status].length }}
              </span>
            </div>

            <div class="space-y-2">
              <NuxtLink v-for="app in groupedByStatus[status]" :key="app.id" :to="`/applications/${app.id}`"
                class="block rounded-md border bg-background p-2.5 transition-colors hover:bg-accent">
                <p class="text-sm font-medium leading-tight">{{ app.companyName }}</p>
                <p class="text-xs text-muted-foreground">{{ app.position }}</p>
              </NuxtLink>

              <p v-if="groupedByStatus[status].length === 0"
                class="rounded-md border border-dashed py-4 text-center text-xs text-muted-foreground">
                No applications
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Applications -->
      <Card>
        <CardHeader>
          <div class="flex items-center gap-2">
            <PhClock :size="16" class="text-muted-foreground" />
            <CardTitle class="text-base">Recent Applications</CardTitle>
          </div>
          <CardDescription>Your latest tracked applications</CardDescription>
        </CardHeader>

        <CardContent class="px-4 pb-2">
          <NuxtLink v-for="app in recentApplications" :key="app.id" :to="`/applications/${app.id}`"
            class="flex items-center justify-between py-2.5 px-2 -mx-2 rounded-md hover:bg-muted/50 transition-colors border-b last:border-0">
            <div>
              <p class="text-sm font-medium">{{ app.companyName }}</p>
              <p class="text-xs text-muted-foreground">{{ app.position }}</p>
            </div>
            <Badge :variant="app.status">{{ statusLabel[app.status] }}</Badge>
          </NuxtLink>
        </CardContent>

        <CardFooter class="px-6 pt-3 pb-4">
          <NuxtLink to="/applications"
            class="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground">
            View all applications
            <PhArrowRight :size="14" />
          </NuxtLink>
        </CardFooter>
      </Card>
    </template>
    <!-- </template> -->
  </div>
</template>

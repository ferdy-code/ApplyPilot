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
  {
    label: 'Applied',
    value: String(submitted.value.length),
    icon: PhPaperPlaneTilt,
    iconColor: 'text-slate-500',
    iconBg: 'bg-slate-100',
    accent: 'border-l-slate-300',
  },
  {
    label: 'Interviews',
    value: String(interviews.value),
    icon: PhUsers,
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-50',
    accent: 'border-l-amber-400',
  },
  {
    label: 'Offers',
    value: String(offers.value),
    icon: PhTrophy,
    iconColor: 'text-green-600',
    iconBg: 'bg-green-50',
    accent: 'border-l-green-400',
  },
  {
    label: 'Rejection rate',
    value: rejectionRate.value === null ? '—' : `${rejectionRate.value}%`,
    icon: PhSmileySad,
    iconColor: 'text-red-500',
    iconBg: 'bg-red-50',
    accent: 'border-l-red-300',
  },
])

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

const statusAccent: Record<string, string> = {
  wishlist: 'bg-violet-500',
  applied: 'bg-zinc-400',
  interview: 'bg-amber-500',
  offer: 'bg-green-500',
  rejected: 'bg-red-500',
}

const recentApplications = computed(() => applications.value.slice(0, 5))

const isLoading = computed(() => pending.value && applications.value.length === 0)
const isEmpty = computed(() => !pending.value && applications.value.length === 0)
</script>

<template>
  <div class="p-6 space-y-6">
    <div>
      <h1 class="text-xl font-semibold tracking-tight">Dashboard</h1>
      <p class="text-sm text-muted-foreground mt-0.5">Track your job search progress</p>
    </div>

    <!-- Loading -->
    <template v-if="isLoading">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card v-for="n in 4" :key="n" class="border-l-2">
          <CardContent class="pt-5 pb-4 px-5 space-y-2">
            <Skeleton class="h-3 w-20" />
            <Skeleton class="h-8 w-12" />
          </CardContent>
        </Card>
      </div>
      <Skeleton class="h-52 w-full rounded-xl" />
    </template>

    <!-- Error -->
    <ErrorState v-else-if="error" :message="error || 'Failed to load dashboard'" :on-retry="fetchApplications" />

    <!-- Content -->
    <template v-else>
      <!-- Metrics -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card
          v-for="stat in stats"
          :key="stat.label"
          class="border-l-2"
          :class="stat.accent"
        >
          <CardContent class="pt-5 pb-4 px-5">
            <div class="flex items-start justify-between gap-2">
              <div class="min-w-0">
                <p class="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  {{ stat.label }}
                </p>
                <p class="text-3xl font-mono font-semibold tabular-nums leading-none">
                  {{ stat.value }}
                </p>
              </div>
              <div class="rounded-lg p-2 shrink-0" :class="stat.iconBg">
                <component :is="stat.icon" :size="16" :class="stat.iconColor" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Empty state -->
      <EmptyState
        v-if="isEmpty"
        :icon="PhPlus"
        title="No applications yet"
        description="Add your first application to start tracking your pipeline."
      >
        <Button size="sm" as-child>
          <NuxtLink to="/applications/new">
            <PhPlus :size="15" />
            Add application
          </NuxtLink>
        </Button>
      </EmptyState>

      <template v-else>
        <!-- Pipeline -->
        <div>
          <h2 class="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Pipeline
          </h2>
          <div class="flex gap-3 overflow-x-auto pb-2">
            <div
              v-for="status in statusColumns"
              :key="status"
              class="w-60 shrink-0 rounded-xl border bg-muted/30 p-3"
            >
              <div class="mb-3 flex items-center gap-2">
                <span class="h-2 w-2 rounded-full shrink-0" :class="statusAccent[status]" />
                <span class="text-sm font-semibold">{{ statusLabel[status] }}</span>
                <span class="ml-auto rounded-full bg-background border px-1.5 py-0.5 text-xs font-mono tabular-nums text-muted-foreground">
                  {{ groupedByStatus[status].length }}
                </span>
              </div>

              <div class="space-y-2">
                <NuxtLink
                  v-for="app in groupedByStatus[status]"
                  :key="app.id"
                  :to="`/applications/${app.id}`"
                  class="block rounded-lg border bg-background px-3 py-2.5 transition-colors hover:bg-accent"
                >
                  <p class="text-sm font-semibold leading-tight truncate">{{ app.companyName }}</p>
                  <p class="text-xs text-muted-foreground mt-0.5 truncate">{{ app.position }}</p>
                </NuxtLink>

                <div
                  v-if="groupedByStatus[status].length === 0"
                  class="rounded-lg border border-dashed py-5 text-center text-xs text-muted-foreground/60"
                >
                  Empty
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Applications -->
        <Card>
          <CardHeader class="pb-3">
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <PhClock :size="15" class="text-muted-foreground" />
                <CardTitle class="text-sm font-semibold">Recent</CardTitle>
              </div>
              <CardDescription class="text-xs">Latest activity</CardDescription>
            </div>
          </CardHeader>

          <CardContent class="px-0 pb-0">
            <NuxtLink
              v-for="app in recentApplications"
              :key="app.id"
              :to="`/applications/${app.id}`"
              class="flex items-center justify-between px-6 py-2.5 hover:bg-muted/50 transition-colors border-t first:border-0"
            >
              <div class="min-w-0">
                <p class="text-sm font-medium truncate">{{ app.companyName }}</p>
                <p class="text-xs text-muted-foreground truncate">{{ app.position }}</p>
              </div>
              <Badge :variant="app.status" class="ml-3 shrink-0">{{ statusLabel[app.status] }}</Badge>
            </NuxtLink>
          </CardContent>

          <CardFooter class="px-6 py-3 border-t">
            <NuxtLink
              to="/applications"
              class="flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              View all applications
              <PhArrowRight :size="12" />
            </NuxtLink>
          </CardFooter>
        </Card>
      </template>
    </template>
  </div>
</template>

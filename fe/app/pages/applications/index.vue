<script setup lang="ts">
import { PhPlus, PhBriefcase } from '@phosphor-icons/vue'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import EmptyState from '@/components/common/EmptyState.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import type { ApplicationStatus } from '~/composables/useApplications'

definePageMeta({ title: 'Applications', middleware: 'auth' })

const { applications, pending, error, fetchApplications } = useApplications()

onMounted(fetchApplications)

type FilterStatus = ApplicationStatus | 'all'

const activeFilter = ref<FilterStatus>('all')

const filteredApplications = computed(() =>
  activeFilter.value === 'all'
    ? applications.value
    : applications.value.filter((a) => a.status === activeFilter.value),
)

const statusCounts = computed(() => {
  const counts: Partial<Record<FilterStatus, number>> = { all: applications.value.length }
  for (const app of applications.value) {
    counts[app.status] = (counts[app.status] ?? 0) + 1
  }
  return counts
})

const statusLabel: Record<ApplicationStatus, string> = {
  wishlist: 'Wishlist',
  applied: 'Applied',
  interview: 'Interview',
  offer: 'Offer',
  rejected: 'Rejected',
  archived: 'Archived',
}

const filterTabs: { key: FilterStatus; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'wishlist', label: 'Wishlist' },
  { key: 'applied', label: 'Applied' },
  { key: 'interview', label: 'Interview' },
  { key: 'offer', label: 'Offer' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'archived', label: 'Archived' },
]

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
</script>

<template>
  <div class="p-6 space-y-5">
    <div class="flex items-start justify-between gap-4">
      <div>
        <h1 class="text-xl font-semibold tracking-tight">Applications</h1>
        <p class="text-sm text-muted-foreground mt-0.5">
          <span class="font-mono tabular-nums">{{ applications.length }}</span>
          application{{ applications.length !== 1 ? 's' : '' }} tracked
        </p>
      </div>
      <Button size="sm" as-child>
        <NuxtLink to="/applications/new">
          <PhPlus :size="15" />
          Add Application
        </NuxtLink>
      </Button>
    </div>

    <!-- Status filter tabs -->
    <div class="flex gap-1 flex-wrap">
      <button
        v-for="tab in filterTabs"
        :key="tab.key"
        type="button"
        :class="[
          'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all',
          activeFilter === tab.key
            ? 'bg-foreground text-background shadow-sm'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
        ]"
        @click="activeFilter = tab.key"
      >
        {{ tab.label }}
        <span
          :class="[
            'rounded-full px-1.5 py-0.5 text-xs font-mono tabular-nums',
            activeFilter === tab.key
              ? 'bg-background/15 text-background'
              : 'bg-muted text-muted-foreground',
          ]"
        >
          {{ statusCounts[tab.key] ?? 0 }}
        </span>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="py-12 text-center text-sm text-muted-foreground">
      Loading applications…
    </div>

    <!-- Error -->
    <ErrorState v-else-if="error" :message="error" :on-retry="fetchApplications" />

    <!-- Table -->
    <template v-else-if="filteredApplications.length > 0">
      <div class="rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow class="bg-muted/40 hover:bg-muted/40">
              <TableHead class="font-semibold">Company</TableHead>
              <TableHead class="font-semibold">Position</TableHead>
              <TableHead class="font-semibold">Status</TableHead>
              <TableHead class="font-semibold">Added</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="app in filteredApplications"
              :key="app.id"
              class="cursor-pointer"
              @click="navigateTo(`/applications/${app.id}`)"
            >
              <TableCell class="font-semibold">{{ app.companyName }}</TableCell>
              <TableCell class="text-muted-foreground">{{ app.position }}</TableCell>
              <TableCell>
                <Badge :variant="app.status">{{ statusLabel[app.status] }}</Badge>
              </TableCell>
              <TableCell class="text-muted-foreground font-mono tabular-nums text-xs">
                {{ formatDate(app.createdAt) }}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </template>

    <template v-else>
      <EmptyState
        :icon="PhBriefcase"
        title="No applications found"
        :description="
          activeFilter === 'all'
            ? 'Start tracking your job applications by adding one.'
            : `No applications with status: ${statusLabel[activeFilter as ApplicationStatus]}`
        "
      >
        <Button v-if="activeFilter === 'all'" size="sm" as-child>
          <NuxtLink to="/applications/new">
            <PhPlus :size="15" />
            Add your first application
          </NuxtLink>
        </Button>
      </EmptyState>
    </template>
  </div>
</template>

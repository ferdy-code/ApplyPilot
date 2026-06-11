<script setup lang="ts">
import { PhStack, PhMagnifyingGlass, PhUsers, PhTrophy, PhClock, PhArrowRight } from '@phosphor-icons/vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { ApplicationStatus } from '~/composables/useApplications'

const { applications } = useApplications()

const stats = computed(() => [
  {
    label: 'Total Applied',
    value: applications.value.length,
    icon: PhStack,
    color: 'text-zinc-500',
  },
  {
    label: 'In Review',
    value: applications.value.filter((a) => a.status === 'reviewing').length,
    icon: PhMagnifyingGlass,
    color: 'text-blue-500',
  },
  {
    label: 'Interviews',
    value: applications.value.filter((a) => a.status === 'interview').length,
    icon: PhUsers,
    color: 'text-amber-500',
  },
  {
    label: 'Offers',
    value: applications.value.filter((a) => a.status === 'offered').length,
    icon: PhTrophy,
    color: 'text-green-500',
  },
])

const statusLabel: Record<ApplicationStatus, string> = {
  applied: 'Applied',
  reviewing: 'In Review',
  interview: 'Interview',
  offered: 'Offered',
  rejected: 'Rejected',
}

const recentApplications = computed(() => applications.value.slice(0, 3))
</script>

<template>
  <div class="p-6 space-y-6">
    <div>
      <h1 class="text-xl font-semibold">Dashboard</h1>
      <p class="text-sm text-muted-foreground">Track your job search progress</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
    </div>

    <Card>
      <CardHeader>
        <div class="flex items-center gap-2">
          <PhClock :size="16" class="text-muted-foreground" />
          <CardTitle class="text-base">Recent Applications</CardTitle>
        </div>
        <CardDescription>Your latest tracked applications</CardDescription>
      </CardHeader>

      <CardContent class="px-4 pb-2">
        <p
          v-if="recentApplications.length === 0"
          class="py-6 text-center text-sm text-muted-foreground"
        >
          No applications yet. Add your first one.
        </p>
        <NuxtLink
          v-for="app in recentApplications"
          :key="app.id"
          to="/applications"
          class="flex items-center justify-between py-2.5 px-2 -mx-2 rounded-md hover:bg-muted/50 transition-colors border-b last:border-0"
        >
          <div>
            <p class="text-sm font-medium">{{ app.company }}</p>
            <p class="text-xs text-muted-foreground">{{ app.position }}</p>
          </div>
          <Badge :variant="app.status">{{ statusLabel[app.status] }}</Badge>
        </NuxtLink>
      </CardContent>

      <CardFooter class="px-6 pt-3 pb-4">
        <NuxtLink
          to="/applications"
          class="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          View all applications
          <PhArrowRight :size="14" />
        </NuxtLink>
      </CardFooter>
    </Card>
  </div>
</template>

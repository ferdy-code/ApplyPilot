<script setup lang="ts">
import { PhBriefcase, PhGauge, PhSignOut, PhSparkle } from '@phosphor-icons/vue'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

const route = useRoute()

const { user, signOut } = useAuth()

const initials = computed(() => {
  const name = user.value?.name?.trim()
  if (!name) return '?'
  return name
    .split(/\s+/)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

async function handleLogout() {
  await signOut()
  await navigateTo('/login')
}

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: PhGauge },
  { href: '/applications', label: 'Applications', icon: PhBriefcase },
  { href: '/job-analyzer', label: 'Job Analyzer', icon: PhSparkle },
]

const isActive = (path: string) =>
  route.path === path || route.path.startsWith(path + '/')

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/applications': 'Applications',
  '/job-analyzer': 'Job Analyzer',
}
const pageTitle = computed(() => (route.meta.title as string) || PAGE_TITLES[route.path] || '')
</script>

<template>
  <SidebarProvider>
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" as-child>
              <NuxtLink to="/dashboard">
                <div
                  class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <PhBriefcase :size="16" weight="bold" />
                </div>
                <div class="flex flex-col gap-0.5 leading-none">
                  <span class="font-semibold">ApplyPilot</span>
                  <span class="text-xs text-sidebar-foreground/60">Job Tracker</span>
                </div>
              </NuxtLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem v-for="link in navLinks" :key="link.href">
                <SidebarMenuButton :is-active="isActive(link.href)" :tooltip="link.label" as-child>
                  <NuxtLink :to="link.href">
                    <component :is="link.icon" />
                    <span>{{ link.label }}</span>
                  </NuxtLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <Avatar class="size-8 rounded-lg">
                <AvatarFallback class="rounded-lg bg-sidebar-accent text-sidebar-accent-foreground">
                  {{ initials }}
                </AvatarFallback>
              </Avatar>
              <div class="flex min-w-0 flex-1 flex-col gap-0.5 leading-none">
                <span class="truncate font-medium text-sm">{{ user?.name }}</span>
                <span class="truncate text-xs text-sidebar-foreground/60">{{ user?.email }}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Sign out" @click="handleLogout">
              <PhSignOut :size="16" />
              <span>Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>

    <SidebarInset class="overflow-x-hidden">
      <header class="flex h-12 shrink-0 items-center border-b px-4 gap-2">
        <SidebarTrigger class="-ml-1" />
        <Separator orientation="vertical" class="h-4" />
        <span v-if="pageTitle" class="text-sm font-medium">{{ pageTitle }}</span>
      </header>
      <div class="flex-1 overflow-y-auto">
        <slot />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>

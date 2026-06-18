<script setup lang="ts">
import {
  PhArrowLeft,
  PhPencilSimple,
  PhTrash,
  PhX,
  PhCheck,
} from '@phosphor-icons/vue'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import type { ApplicationStatus, UpdateApplicationInput } from '~/composables/useApplications'

definePageMeta({ title: 'Application', middleware: 'auth' })

const route = useRoute()
const { applications, fetchApplications, updateApplication, deleteApplication } = useApplications()

onMounted(async () => {
  if (applications.value.length === 0) await fetchApplications()
})

const application = computed(() =>
  applications.value.find((a) => a.id === Number(route.params.id)),
)

const statusLabel: Record<ApplicationStatus, string> = {
  wishlist: 'Wishlist',
  applied: 'Applied',
  interview: 'Interview',
  offer: 'Offer',
  rejected: 'Rejected',
  archived: 'Archived',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatSalary(min: string | null, max: string | null, currency: string | null): string {
  if (!min && !max) return '—'
  const cur = currency ?? ''
  if (min && max) return `${min} – ${max} ${cur}`.trim()
  return `${min ?? max} ${cur}`.trim()
}

// ── Edit mode ────────────────────────────────────────────────
const isEditing = ref(false)
const saving = ref(false)
const saveError = ref('')

const editForm = reactive<UpdateApplicationInput & { status: ApplicationStatus }>({
  position: '',
  status: 'wishlist',
  source: null,
  deadline: null,
  salaryMin: null,
  salaryMax: null,
  salaryCurrency: null,
  notes: null,
})

function startEdit() {
  if (!application.value) return
  Object.assign(editForm, {
    position: application.value.position,
    status: application.value.status,
    source: application.value.source ?? '',
    deadline: application.value.deadline ?? '',
    salaryMin: application.value.salaryMin ?? '',
    salaryMax: application.value.salaryMax ?? '',
    salaryCurrency: application.value.salaryCurrency ?? 'USD',
    notes: application.value.notes ?? '',
  })
  isEditing.value = true
}

function cancelEdit() {
  isEditing.value = false
  saveError.value = ''
}

async function saveEdit() {
  if (!application.value) return
  saving.value = true
  saveError.value = ''
  try {
    await updateApplication(application.value.id, {
      position: editForm.position || undefined,
      status: editForm.status,
      source: (editForm.source as string).trim() || null,
      deadline: (editForm.deadline as string) || null,
      salaryMin: (editForm.salaryMin as string).trim() || null,
      salaryMax: (editForm.salaryMax as string).trim() || null,
      salaryCurrency: (editForm.salaryCurrency as string).trim() || null,
      notes: (editForm.notes as string).trim() || null,
    })
    isEditing.value = false
  } catch {
    saveError.value = 'Failed to save. Please try again.'
  } finally {
    saving.value = false
  }
}

// ── Delete confirm ────────────────────────────────────────────
const isConfirmingDelete = ref(false)

async function confirmDelete() {
  if (!application.value) return
  await deleteApplication(application.value.id)
  await navigateTo('/applications')
}
</script>

<template>
  <div class="p-6 max-w-2xl space-y-6">
    <Button variant="ghost" size="sm" class="-ml-2" as-child>
      <NuxtLink to="/applications">
        <PhArrowLeft :size="16" />
        Applications
      </NuxtLink>
    </Button>

    <!-- Not found -->
    <div v-if="!application" class="py-16 text-center">
      <p class="mb-4 text-muted-foreground">Application not found.</p>
      <Button variant="outline" as-child>
        <NuxtLink to="/applications">Back to Applications</NuxtLink>
      </Button>
    </div>

    <!-- Edit mode -->
    <template v-else-if="isEditing">
      <div class="flex items-center justify-between gap-4">
        <div>
          <h1 class="text-xl font-semibold">Edit Application</h1>
          <p class="text-sm text-muted-foreground">{{ application.companyName }}</p>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" @click="cancelEdit">
            <PhX :size="14" />
            Cancel
          </Button>
          <Button size="sm" :disabled="saving" @click="saveEdit">
            <PhCheck :size="14" />
            {{ saving ? 'Saving…' : 'Save' }}
          </Button>
        </div>
      </div>

      <form class="space-y-5" @submit.prevent="saveEdit">
        <div class="space-y-1.5">
          <label class="text-sm font-medium" for="edit-position">Position</label>
          <Input id="edit-position" v-model="editForm.position" />
        </div>

        <div class="space-y-1.5">
          <p class="text-sm font-medium">Status</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="(label, key) in statusLabel"
              :key="key"
              type="button"
              :class="[
                'rounded-md border px-3 py-1 text-sm font-medium transition-colors',
                editForm.status === key
                  ? 'border-transparent bg-primary text-primary-foreground'
                  : 'border-border bg-background text-foreground hover:bg-muted',
              ]"
              @click="editForm.status = key as ApplicationStatus"
            >
              {{ label }}
            </button>
          </div>
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium" for="edit-source">Source</label>
          <Input id="edit-source" v-model="editForm.source" placeholder="LinkedIn, referral…" />
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium" for="edit-deadline">Deadline</label>
          <Input id="edit-deadline" v-model="editForm.deadline" type="date" />
        </div>

        <div class="space-y-1.5">
          <p class="text-sm font-medium">Salary Range</p>
          <div class="flex gap-2">
            <Input v-model="editForm.salaryMin" placeholder="Min" class="flex-1" />
            <Input v-model="editForm.salaryMax" placeholder="Max" class="flex-1" />
            <Input v-model="editForm.salaryCurrency" placeholder="USD" class="w-20" maxlength="3" />
          </div>
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium" for="edit-notes">Notes</label>
          <textarea
            id="edit-notes"
            v-model="editForm.notes"
            rows="4"
            class="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>

        <p v-if="saveError" class="text-xs text-destructive" role="alert">{{ saveError }}</p>
      </form>
    </template>

    <!-- View mode -->
    <template v-else>
      <div class="flex items-start justify-between gap-4">
        <div class="min-w-0 space-y-1">
          <div class="flex flex-wrap items-center gap-3">
            <h1 class="text-2xl font-semibold">{{ application.companyName }}</h1>
            <Badge :variant="application.status">{{ statusLabel[application.status] }}</Badge>
          </div>
          <p class="text-muted-foreground">{{ application.position }}</p>
        </div>

        <div class="flex shrink-0 items-center gap-2">
          <Button variant="outline" size="sm" @click="startEdit">
            <PhPencilSimple :size="14" />
            Edit
          </Button>
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

      <Card>
        <CardContent class="space-y-4 pt-6">
          <dl class="space-y-4 text-sm">
            <div class="flex gap-3">
              <dt class="w-28 shrink-0 text-muted-foreground">Added</dt>
              <dd>{{ formatDate(application.createdAt) }}</dd>
            </div>

            <template v-if="application.source">
              <Separator />
              <div class="flex gap-3">
                <dt class="w-28 shrink-0 text-muted-foreground">Source</dt>
                <dd>{{ application.source }}</dd>
              </div>
            </template>

            <template v-if="application.deadline">
              <Separator />
              <div class="flex gap-3">
                <dt class="w-28 shrink-0 text-muted-foreground">Deadline</dt>
                <dd>{{ formatDate(application.deadline) }}</dd>
              </div>
            </template>

            <template v-if="application.salaryMin || application.salaryMax">
              <Separator />
              <div class="flex gap-3">
                <dt class="w-28 shrink-0 text-muted-foreground">Salary</dt>
                <dd class="tabular-nums">
                  {{ formatSalary(application.salaryMin, application.salaryMax, application.salaryCurrency) }}
                </dd>
              </div>
            </template>

            <template v-if="application.notes">
              <Separator />
              <div class="flex gap-3">
                <dt class="w-28 shrink-0 text-muted-foreground">Notes</dt>
                <dd class="whitespace-pre-wrap leading-relaxed">{{ application.notes }}</dd>
              </div>
            </template>
          </dl>
        </CardContent>
      </Card>
    </template>
  </div>
</template>

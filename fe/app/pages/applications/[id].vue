<script setup lang="ts">
import {
  PhArrowLeft,
  PhPencilSimple,
  PhTrash,
  PhX,
  PhCheck,
  PhArrowSquareOut,
} from '@phosphor-icons/vue'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import type { ApplicationStatus } from '~/composables/useApplications'

definePageMeta({ title: 'Application' })

const route = useRoute()
const { getApplication, updateApplication, deleteApplication } = useApplications()

const application = computed(() => getApplication(route.params.id as string))

const statusLabel: Record<ApplicationStatus, string> = {
  applied: 'Applied',
  reviewing: 'In Review',
  interview: 'Interview',
  offered: 'Offered',
  rejected: 'Rejected',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

// ── Edit mode ────────────────────────────────────────────────
const isEditing = ref(false)

const editForm = reactive({
  company: '',
  position: '',
  status: 'applied' as ApplicationStatus,
  appliedDate: '',
  location: '',
  salary: '',
  notes: '',
  jobUrl: '',
})

function startEdit() {
  if (!application.value) return
  Object.assign(editForm, {
    company: application.value.company,
    position: application.value.position,
    status: application.value.status,
    appliedDate: application.value.appliedDate,
    location: application.value.location ?? '',
    salary: application.value.salary ?? '',
    notes: application.value.notes ?? '',
    jobUrl: application.value.jobUrl ?? '',
  })
  isEditing.value = true
}

function cancelEdit() {
  isEditing.value = false
}

function saveEdit() {
  updateApplication(route.params.id as string, { ...editForm })
  isEditing.value = false
}

// ── Delete confirm ────────────────────────────────────────────
const isConfirmingDelete = ref(false)

async function confirmDelete() {
  deleteApplication(route.params.id as string)
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
          <p class="text-sm text-muted-foreground">{{ application.company }}</p>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" @click="cancelEdit">
            <PhX :size="14" />
            Cancel
          </Button>
          <Button size="sm" @click="saveEdit">
            <PhCheck :size="14" />
            Save
          </Button>
        </div>
      </div>

      <form class="space-y-5" @submit.prevent="saveEdit">
        <div class="space-y-1.5">
          <label class="text-sm font-medium" for="edit-company">Company</label>
          <Input id="edit-company" v-model="editForm.company" />
        </div>

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
          <label class="text-sm font-medium" for="edit-date">Applied Date</label>
          <Input id="edit-date" v-model="editForm.appliedDate" type="date" />
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium" for="edit-location">Location</label>
          <Input id="edit-location" v-model="editForm.location" placeholder="Remote" />
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium" for="edit-salary">Salary Range</label>
          <Input id="edit-salary" v-model="editForm.salary" placeholder="$120k – $150k" />
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium" for="edit-url">Job URL</label>
          <Input id="edit-url" v-model="editForm.jobUrl" type="url" placeholder="https://..." />
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
      </form>
    </template>

    <!-- View mode -->
    <template v-else>
      <div class="flex items-start justify-between gap-4">
        <div class="min-w-0 space-y-1">
          <div class="flex flex-wrap items-center gap-3">
            <h1 class="text-2xl font-semibold">{{ application.company }}</h1>
            <Badge :variant="application.status">{{ statusLabel[application.status] }}</Badge>
          </div>
          <p class="text-muted-foreground">{{ application.position }}</p>
        </div>

        <div class="flex shrink-0 items-center gap-2">
          <Button variant="outline" size="sm" @click="startEdit">
            <PhPencilSimple :size="14" />
            Edit
          </Button>
          <!-- Delete: two-step inline confirm -->
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
              <dt class="w-28 shrink-0 text-muted-foreground">Applied</dt>
              <dd>{{ formatDate(application.appliedDate) }}</dd>
            </div>

            <template v-if="application.location">
              <Separator />
              <div class="flex gap-3">
                <dt class="w-28 shrink-0 text-muted-foreground">Location</dt>
                <dd>{{ application.location }}</dd>
              </div>
            </template>

            <template v-if="application.salary">
              <Separator />
              <div class="flex gap-3">
                <dt class="w-28 shrink-0 text-muted-foreground">Salary</dt>
                <dd class="tabular-nums">{{ application.salary }}</dd>
              </div>
            </template>

            <template v-if="application.jobUrl">
              <Separator />
              <div class="flex gap-3">
                <dt class="w-28 shrink-0 text-muted-foreground">Job posting</dt>
                <dd>
                  <a
                    :href="application.jobUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    View <PhArrowSquareOut :size="13" />
                  </a>
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

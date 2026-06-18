<script setup lang="ts">
import { PhArrowLeft } from '@phosphor-icons/vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { ApplicationStatus } from '~/composables/useApplications'

definePageMeta({ title: 'New Application', middleware: 'auth' })

const { addApplication } = useApplications()

const statusOptions: { key: ApplicationStatus; label: string }[] = [
  { key: 'wishlist', label: 'Wishlist' },
  { key: 'applied', label: 'Applied' },
  { key: 'interview', label: 'Interview' },
  { key: 'offer', label: 'Offer' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'archived', label: 'Archived' },
]

const form = reactive({
  companyName: '',
  companyLocation: '',
  position: '',
  status: 'wishlist' as ApplicationStatus,
  source: '',
  deadline: '',
  salaryMin: '',
  salaryMax: '',
  salaryCurrency: 'USD',
  notes: '',
})

const errors = reactive({ companyName: '', position: '' })
const submitting = ref(false)
const submitError = ref('')

function validate(): boolean {
  errors.companyName = form.companyName.trim() ? '' : 'Company name is required'
  errors.position = form.position.trim() ? '' : 'Position is required'
  return !errors.companyName && !errors.position
}

async function handleSubmit() {
  if (!validate()) return
  submitting.value = true
  submitError.value = ''
  try {
    await addApplication({
      companyName: form.companyName.trim(),
      companyLocation: form.companyLocation.trim() || undefined,
      position: form.position.trim(),
      status: form.status,
      source: form.source.trim() || undefined,
      deadline: form.deadline || undefined,
      salaryMin: form.salaryMin.trim() || undefined,
      salaryMax: form.salaryMax.trim() || undefined,
      salaryCurrency: form.salaryCurrency.trim() || undefined,
      notes: form.notes.trim() || undefined,
    })
    await navigateTo('/applications')
  } catch {
    submitError.value = 'Failed to save application. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="p-6 max-w-xl space-y-6">
    <Button variant="ghost" size="sm" class="-ml-2 text-muted-foreground" as-child>
      <NuxtLink to="/applications">
        <PhArrowLeft :size="15" />
        Applications
      </NuxtLink>
    </Button>

    <div>
      <h1 class="text-xl font-semibold tracking-tight">New Application</h1>
      <p class="text-sm text-muted-foreground mt-0.5">Track a new job application</p>
    </div>

    <form class="space-y-8" @submit.prevent="handleSubmit">

      <!-- Section: Role -->
      <div class="space-y-4">
        <p class="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b pb-2">
          Role
        </p>

        <div class="grid gap-4 sm:grid-cols-2">
          <div class="space-y-1.5">
            <label class="text-sm font-medium" for="company">
              Company <span class="text-destructive" aria-hidden="true">*</span>
            </label>
            <Input
              id="company"
              v-model="form.companyName"
              placeholder="Stripe"
              :aria-invalid="!!errors.companyName"
            />
            <p v-if="errors.companyName" class="text-xs text-destructive" role="alert">
              {{ errors.companyName }}
            </p>
          </div>

          <div class="space-y-1.5">
            <label class="text-sm font-medium" for="company-location">Location</label>
            <Input id="company-location" v-model="form.companyLocation" placeholder="San Francisco, CA" />
          </div>
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium" for="position">
            Position <span class="text-destructive" aria-hidden="true">*</span>
          </label>
          <Input
            id="position"
            v-model="form.position"
            placeholder="Senior Frontend Engineer"
            :aria-invalid="!!errors.position"
          />
          <p v-if="errors.position" class="text-xs text-destructive" role="alert">
            {{ errors.position }}
          </p>
        </div>

        <div class="space-y-1.5">
          <p class="text-sm font-medium">Status</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="opt in statusOptions"
              :key="opt.key"
              type="button"
              :class="[
                'rounded-full border px-3 py-1 text-sm font-medium transition-all',
                form.status === opt.key
                  ? 'border-transparent bg-foreground text-background'
                  : 'border-border bg-background text-muted-foreground hover:border-border hover:bg-muted hover:text-foreground',
              ]"
              @click="form.status = opt.key"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- Section: Details -->
      <div class="space-y-4">
        <p class="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b pb-2">
          Details
        </p>

        <div class="grid gap-4 sm:grid-cols-2">
          <div class="space-y-1.5">
            <label class="text-sm font-medium" for="source">Source</label>
            <Input id="source" v-model="form.source" placeholder="LinkedIn, referral…" />
          </div>

          <div class="space-y-1.5">
            <label class="text-sm font-medium" for="deadline">Deadline</label>
            <Input id="deadline" v-model="form.deadline" type="date" />
          </div>
        </div>

        <div class="space-y-1.5">
          <p class="text-sm font-medium">Salary Range</p>
          <div class="flex gap-2">
            <Input v-model="form.salaryMin" placeholder="Min" class="flex-1" />
            <Input v-model="form.salaryMax" placeholder="Max" class="flex-1" />
            <Input v-model="form.salaryCurrency" placeholder="USD" class="w-20 font-mono uppercase" maxlength="3" />
          </div>
        </div>
      </div>

      <!-- Section: Notes -->
      <div class="space-y-4">
        <p class="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b pb-2">
          Notes
        </p>
        <textarea
          id="notes"
          v-model="form.notes"
          rows="4"
          placeholder="Interview notes, referrals, contacts, prep materials…"
          class="w-full resize-none rounded-lg border border-input bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <p v-if="submitError" class="text-xs text-destructive" role="alert">{{ submitError }}</p>

      <div class="flex justify-end gap-2 pt-1">
        <Button type="button" variant="outline" as-child>
          <NuxtLink to="/applications">Cancel</NuxtLink>
        </Button>
        <Button type="submit" :disabled="submitting">
          {{ submitting ? 'Saving…' : 'Add Application' }}
        </Button>
      </div>
    </form>
  </div>
</template>

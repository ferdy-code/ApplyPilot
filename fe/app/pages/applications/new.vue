<script setup lang="ts">
import { PhArrowLeft } from '@phosphor-icons/vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { ApplicationStatus } from '~/composables/useApplications'

definePageMeta({ title: 'New Application' })

const { addApplication } = useApplications()

const statusLabel: Record<ApplicationStatus, string> = {
  applied: 'Applied',
  reviewing: 'In Review',
  interview: 'Interview',
  offered: 'Offered',
  rejected: 'Rejected',
}

const form = reactive({
  company: '',
  position: '',
  status: 'applied' as ApplicationStatus,
  appliedDate: new Date().toISOString().slice(0, 10),
  location: '',
  salary: '',
  notes: '',
  jobUrl: '',
})

const errors = reactive({ company: '', position: '' })

function validate(): boolean {
  errors.company = form.company.trim() ? '' : 'Company name is required'
  errors.position = form.position.trim() ? '' : 'Position is required'
  return !errors.company && !errors.position
}

async function handleSubmit() {
  if (!validate()) return
  addApplication({ ...form })
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

    <div>
      <h1 class="text-xl font-semibold">New Application</h1>
      <p class="text-sm text-muted-foreground">Track a new job application</p>
    </div>

    <form class="space-y-5" @submit.prevent="handleSubmit">
      <div class="space-y-1.5">
        <label class="text-sm font-medium" for="company">
          Company <span class="text-destructive" aria-hidden="true">*</span>
        </label>
        <Input
          id="company"
          v-model="form.company"
          placeholder="Stripe"
          :aria-invalid="!!errors.company"
        />
        <p v-if="errors.company" class="text-xs text-destructive" role="alert">
          {{ errors.company }}
        </p>
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
            v-for="(label, key) in statusLabel"
            :key="key"
            type="button"
            :class="[
              'rounded-md border px-3 py-1 text-sm font-medium transition-colors',
              form.status === key
                ? 'border-transparent bg-primary text-primary-foreground'
                : 'border-border bg-background text-foreground hover:bg-muted',
            ]"
            @click="form.status = key as ApplicationStatus"
          >
            {{ label }}
          </button>
        </div>
      </div>

      <div class="space-y-1.5">
        <label class="text-sm font-medium" for="applied-date">Applied Date</label>
        <Input id="applied-date" v-model="form.appliedDate" type="date" />
      </div>

      <div class="space-y-1.5">
        <label class="text-sm font-medium" for="location">Location</label>
        <Input id="location" v-model="form.location" placeholder="Remote" />
      </div>

      <div class="space-y-1.5">
        <label class="text-sm font-medium" for="salary">Salary Range</label>
        <Input id="salary" v-model="form.salary" placeholder="$120k – $150k" />
      </div>

      <div class="space-y-1.5">
        <label class="text-sm font-medium" for="job-url">Job URL</label>
        <Input id="job-url" v-model="form.jobUrl" type="url" placeholder="https://..." />
      </div>

      <div class="space-y-1.5">
        <label class="text-sm font-medium" for="notes">Notes</label>
        <textarea
          id="notes"
          v-model="form.notes"
          rows="4"
          placeholder="Interview notes, referrals, contacts..."
          class="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>

      <div class="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" as-child>
          <NuxtLink to="/applications">Cancel</NuxtLink>
        </Button>
        <Button type="submit">Add Application</Button>
      </div>
    </form>
  </div>
</template>

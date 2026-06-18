<script setup lang="ts">
import { PhArrowLeft, PhSparkle } from '@phosphor-icons/vue'
import { Button } from '@/components/ui/button'

definePageMeta({ title: 'New Analysis', middleware: 'auth' })

const { analyze } = useJobAnalyses()

const form = reactive({
  jobDescription: '',
  skills: '',
})

const errors = reactive({ jobDescription: '', skills: '' })
const submitting = ref(false)
const submitError = ref('')

function validate(): boolean {
  errors.jobDescription = form.jobDescription.trim() ? '' : 'Job description is required'
  errors.skills = form.skills.trim() ? '' : 'Skills are required'
  return !errors.jobDescription && !errors.skills
}

async function handleSubmit() {
  if (!validate()) return
  submitting.value = true
  submitError.value = ''
  try {
    const created = await analyze({
      jobDescription: form.jobDescription.trim(),
      skills: form.skills.trim(),
    })
    await navigateTo(`/job-analyzer/${created.id}`)
  } catch (e) {
    const msg = (e as { data?: { message?: string; error?: string } })?.data?.message
      ?? (e as { data?: { error?: string } })?.data?.error
    submitError.value = msg ? `Analysis failed: ${msg}` : 'Analysis failed. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="p-6 max-w-3xl space-y-6">
    <Button variant="ghost" size="sm" class="-ml-2 text-muted-foreground" as-child>
      <NuxtLink to="/job-analyzer">
        <PhArrowLeft :size="15" />
        Job Analyzer
      </NuxtLink>
    </Button>

    <div>
      <h1 class="text-xl font-semibold tracking-tight">Analyze a Job Description</h1>
      <p class="text-sm text-muted-foreground mt-0.5">
        Get a summary, requirements, fit score, and a cover-letter draft.
      </p>
    </div>

    <form class="space-y-6" @submit.prevent="handleSubmit">
      <div class="grid gap-5 lg:grid-cols-5">

        <!-- Job description — wider column -->
        <div class="space-y-1.5 lg:col-span-3">
          <label class="text-sm font-medium" for="job-description">
            Job Description <span class="text-destructive" aria-hidden="true">*</span>
          </label>
          <textarea
            id="job-description"
            v-model="form.jobDescription"
            rows="14"
            placeholder="Paste the full job description here…"
            :aria-invalid="!!errors.jobDescription"
            class="w-full resize-y rounded-lg border border-input bg-background px-3 py-2.5 text-sm leading-relaxed placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <p v-if="errors.jobDescription" class="text-xs text-destructive" role="alert">
            {{ errors.jobDescription }}
          </p>
        </div>

        <!-- Skills — narrower column -->
        <div class="space-y-1.5 lg:col-span-2">
          <label class="text-sm font-medium" for="skills">
            Your Skills <span class="text-destructive" aria-hidden="true">*</span>
          </label>
          <textarea
            id="skills"
            v-model="form.skills"
            rows="14"
            placeholder="One per line or comma-separated:&#10;&#10;React&#10;TypeScript&#10;Node.js&#10;PostgreSQL"
            :aria-invalid="!!errors.skills"
            class="w-full resize-y rounded-lg border border-input bg-background px-3 py-2.5 text-sm leading-relaxed placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <p v-if="errors.skills" class="text-xs text-destructive" role="alert">
            {{ errors.skills }}
          </p>

          <div v-if="submitting" class="rounded-lg border bg-muted/40 p-3 mt-3">
            <p class="text-xs text-muted-foreground leading-relaxed">
              <span class="font-medium text-foreground">Analyzing…</span>
              <br />
              The AI is reading the job description. This usually takes 10–20 seconds.
            </p>
          </div>
        </div>
      </div>

      <p v-if="submitError" class="text-xs text-destructive" role="alert">{{ submitError }}</p>

      <div class="flex justify-end gap-2">
        <Button type="button" variant="outline" as-child>
          <NuxtLink to="/job-analyzer">Cancel</NuxtLink>
        </Button>
        <Button type="submit" :disabled="submitting">
          <PhSparkle :size="15" />
          {{ submitting ? 'Analyzing…' : 'Analyze' }}
        </Button>
      </div>
    </form>
  </div>
</template>

export type ApplicationStatus = 'wishlist' | 'applied' | 'interview' | 'offer' | 'rejected' | 'archived'

export interface Application {
  id: number
  userId: string
  companyId: number
  companyName: string
  position: string
  status: ApplicationStatus
  source: string | null
  deadline: string | null
  salaryMin: string | null
  salaryMax: string | null
  salaryCurrency: string | null
  jobDescription: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateApplicationInput {
  companyName: string
  companyLocation?: string
  position: string
  status?: ApplicationStatus
  source?: string
  deadline?: string
  salaryMin?: string
  salaryMax?: string
  salaryCurrency?: string
  notes?: string
}

export type UpdateApplicationInput = Partial<Pick<
  Application,
  'position' | 'status' | 'source' | 'deadline' | 'salaryMin' | 'salaryMax' | 'salaryCurrency' | 'jobDescription' | 'notes'
>>

export function useApplications() {
  const { public: { apiBase } } = useRuntimeConfig()

  const applications = useState<Application[]>('applications', () => [])
  const pending = useState<boolean>('applications:pending', () => false)
  const error = useState<string | null>('applications:error', () => null)

  async function fetchApplications(): Promise<void> {
    pending.value = true
    error.value = null
    try {
      applications.value = await $fetch<Application[]>(`${apiBase}/applications`, {
        credentials: 'include',
      })
    } catch (e) {
      error.value = 'Failed to load applications'
      console.error(e)
    } finally {
      pending.value = false
    }
  }

  function getApplication(id: number): Application | undefined {
    return applications.value.find((app) => app.id === id)
  }

  async function addApplication(input: CreateApplicationInput): Promise<void> {
    const company = await $fetch<{ id: number }>(`${apiBase}/companies`, {
      method: 'POST',
      credentials: 'include',
      body: {
        name: input.companyName,
        location: input.companyLocation ?? null,
      },
    })
    const created = await $fetch<Application>(`${apiBase}/applications`, {
      method: 'POST',
      credentials: 'include',
      body: {
        companyId: company.id,
        position: input.position,
        status: input.status,
        source: input.source ?? null,
        deadline: input.deadline ?? null,
        salaryMin: input.salaryMin ?? null,
        salaryMax: input.salaryMax ?? null,
        salaryCurrency: input.salaryCurrency ?? null,
        notes: input.notes ?? null,
      },
    })
    applications.value.unshift({ ...created, companyName: input.companyName })
  }

  async function updateApplication(id: number, updates: UpdateApplicationInput): Promise<void> {
    const updated = await $fetch<Application>(`${apiBase}/applications/${id}`, {
      method: 'PATCH',
      credentials: 'include',
      body: updates,
    })
    const index = applications.value.findIndex((a) => a.id === id)
    if (index !== -1) applications.value[index] = updated
  }

  async function deleteApplication(id: number): Promise<void> {
    await $fetch(`${apiBase}/applications/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    applications.value = applications.value.filter((a) => a.id !== id)
  }

  return {
    applications,
    pending,
    error,
    fetchApplications,
    getApplication,
    addApplication,
    updateApplication,
    deleteApplication,
  }
}

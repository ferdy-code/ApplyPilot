export interface JobAnalysis {
  id: number
  userId: string
  // Raw inputs.
  jobDescription: string
  skills: string
  // Structured AI output.
  jobTitle: string | null
  summary: string | null
  responsibilities: string[] | null
  requirements: string[] | null
  keywords: string[] | null
  matchedSkills: string[] | null
  missingSkills: string[] | null
  fitScore: number | null
  coverLetter: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateJobAnalysisInput {
  jobDescription: string
  skills: string
}

export function useJobAnalyses() {
  const { public: { apiBase } } = useRuntimeConfig()

  const analyses = useState<JobAnalysis[]>('jobAnalyses', () => [])
  const pending = useState<boolean>('jobAnalyses:pending', () => false)
  const error = useState<string | null>('jobAnalyses:error', () => null)

  async function fetchAnalyses(): Promise<void> {
    pending.value = true
    error.value = null
    try {
      analyses.value = await $fetch<JobAnalysis[]>(`${apiBase}/job-analyses`, {
        credentials: 'include',
      })
    } catch (e) {
      error.value = 'Failed to load analyses'
      console.error(e)
    } finally {
      pending.value = false
    }
  }

  function getAnalysis(id: number): JobAnalysis | undefined {
    return analyses.value.find((a) => a.id === id)
  }

  /**
   * Analyze a JD + skills (POST runs the AI and persists server-side) and return
   * the created row so the caller can navigate to its detail page.
   */
  async function analyze(input: CreateJobAnalysisInput): Promise<JobAnalysis> {
    const created = await $fetch<JobAnalysis>(`${apiBase}/job-analyses`, {
      method: 'POST',
      credentials: 'include',
      body: input,
    })
    analyses.value.unshift(created)
    return created
  }

  async function deleteAnalysis(id: number): Promise<void> {
    await $fetch(`${apiBase}/job-analyses/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    analyses.value = analyses.value.filter((a) => a.id !== id)
  }

  return {
    analyses,
    pending,
    error,
    fetchAnalyses,
    getAnalysis,
    analyze,
    deleteAnalysis,
  }
}

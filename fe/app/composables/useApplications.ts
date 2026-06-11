export type ApplicationStatus = 'applied' | 'reviewing' | 'interview' | 'offered' | 'rejected'

export interface Application {
  id: string
  company: string
  position: string
  status: ApplicationStatus
  appliedDate: string
  location?: string
  salary?: string
  notes?: string
  jobUrl?: string
}

const INITIAL_APPLICATIONS: Application[] = [
  {
    id: '1',
    company: 'Stripe',
    position: 'Senior Frontend Engineer',
    status: 'interview',
    appliedDate: '2026-05-20',
    location: 'San Francisco, CA (Remote)',
    salary: '$180k – $220k',
    notes: 'Technical screen scheduled for next week. Focus on system design and React.',
    jobUrl: 'https://stripe.com/jobs',
  },
  {
    id: '2',
    company: 'Vercel',
    position: 'Staff Engineer',
    status: 'reviewing',
    appliedDate: '2026-05-28',
    location: 'Remote',
    salary: '$200k – $250k',
    notes: 'Applied via referral from former colleague. Awaiting recruiter response.',
    jobUrl: 'https://vercel.com/careers',
  },
  {
    id: '3',
    company: 'Linear',
    position: 'Product Engineer',
    status: 'applied',
    appliedDate: '2026-06-02',
    location: 'Remote',
    salary: '$160k – $190k',
    notes: 'Excited about their design-forward engineering culture.',
  },
  {
    id: '4',
    company: 'Notion',
    position: 'Frontend Engineer',
    status: 'rejected',
    appliedDate: '2026-04-15',
    location: 'New York, NY',
    salary: '$150k – $180k',
    notes: 'Received rejection email after final round. Good interview experience overall.',
  },
  {
    id: '5',
    company: 'GitHub',
    position: 'Senior Software Engineer',
    status: 'offered',
    appliedDate: '2026-04-01',
    location: 'Remote',
    salary: '$190k – $230k',
    notes: 'Offer received! Deadline to respond: June 20, 2026.',
    jobUrl: 'https://github.com/about/careers',
  },
]

export function useApplications() {
  const applications = useState<Application[]>('applications', () => INITIAL_APPLICATIONS)

  function getApplication(id: string): Application | undefined {
    return applications.value.find((app) => app.id === id)
  }

  function addApplication(app: Omit<Application, 'id'>): void {
    applications.value.unshift({ ...app, id: String(Date.now()) })
  }

  function updateApplication(id: string, updates: Partial<Omit<Application, 'id'>>): void {
    const index = applications.value.findIndex((a) => a.id === id)
    if (index !== -1) {
      applications.value[index] = { ...applications.value[index], ...updates }
    }
  }

  function deleteApplication(id: string): void {
    applications.value = applications.value.filter((a) => a.id !== id)
  }

  return { applications, getApplication, addApplication, updateApplication, deleteApplication }
}

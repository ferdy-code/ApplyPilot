# ApplyPilot

Bantu job seeker melacak lamaran, memahami job description dengan AI, dan membuat draft cover letter lebih cepat.

## Problem

Job seeker sering kehilangan jejak lamaran yang sudah dikirim, kesulitan mencocokkan skill dengan JD, dan menghabiskan terlalu banyak waktu menulis cover letter dari nol untuk setiap posisi.

## Target User

Job seeker aktif yang melamar ke banyak posisi sekaligus dan ingin proses lamaran yang lebih terorganisir dan efisien.

## Fitur Utama

- **Job Tracker** — catat setiap lamaran beserta status (applied, interview, rejected, offer)
- **AI JD Analyzer** — analisis job description untuk menonjolkan key requirements dan skill gap
- **Cover Letter Generator** — buat draft cover letter yang dipersonalisasi berdasarkan JD dan profil user

## Tech Stack

| Layer    | Teknologi                          |
|----------|------------------------------------|
| Frontend | Nuxt 3, shadcn-vue                 |
| Backend  | Hono (Bun runtime)                 |
| Database | PostgreSQL + Drizzle ORM           |
| AI       | Gemini API                         |

## Getting Started

```bash
# Install dependencies
bun install

# Setup environment
cp .env.example .env

# Run database migrations
bun run db:migrate

# Start development server
bun run dev
```

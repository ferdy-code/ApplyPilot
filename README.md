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

## Database Schema

Schema utama berada di `be/src/db/schema.ts` dan menggunakan PostgreSQL + Drizzle ORM.

### `users`

Menyimpan profil user aplikasi.

| Field | Type | Catatan |
|-------|------|---------|
| `id` | serial | Primary key |
| `name` | varchar | Nama user |
| `email` | varchar | Unique email user |
| `created_at` | timestamp | Waktu data dibuat |
| `updated_at` | timestamp | Waktu data terakhir diubah |

### `companies`

Menyimpan data perusahaan yang dilamar.

| Field | Type | Catatan |
|-------|------|---------|
| `id` | serial | Primary key |
| `name` | varchar | Nama perusahaan |
| `website` | varchar | Website perusahaan, optional |
| `location` | varchar | Lokasi perusahaan, optional |
| `created_at` | timestamp | Waktu data dibuat |
| `updated_at` | timestamp | Waktu data terakhir diubah |

### `applications`

Menyimpan data lamaran pekerjaan.

| Field | Type | Catatan |
|-------|------|---------|
| `id` | serial | Primary key |
| `user_id` | integer | Foreign key ke `users.id` |
| `company_id` | integer | Foreign key ke `companies.id` |
| `position` | varchar | Posisi yang dilamar |
| `status` | enum | Status lamaran |
| `source` | varchar | Sumber lowongan, optional |
| `deadline` | date | Deadline apply/interview, optional |
| `salary_min` | numeric | Range salary minimum, optional |
| `salary_max` | numeric | Range salary maksimum, optional |
| `salary_currency` | varchar | Kode mata uang, contoh `IDR` atau `USD` |
| `job_description` | text | Isi job description, optional |
| `notes` | text | Catatan ringkas, optional |
| `created_at` | timestamp | Waktu data dibuat |
| `updated_at` | timestamp | Waktu data terakhir diubah |

### `application_notes`

Menyimpan catatan historis atau tambahan untuk setiap lamaran.

| Field | Type | Catatan |
|-------|------|---------|
| `id` | serial | Primary key |
| `application_id` | integer | Foreign key ke `applications.id` |
| `content` | text | Isi catatan |
| `created_at` | timestamp | Waktu data dibuat |
| `updated_at` | timestamp | Waktu data terakhir diubah |

### Application Status Flow

Enum `application_status` berisi:

`wishlist`, `applied`, `interview`, `offer`, `rejected`, `archived`

Flow utama:

```text
wishlist -> applied -> interview -> offer
applied/interview -> rejected
any status -> archived
```

## API Contract Awal

Endpoint di bawah ini adalah kontrak awal untuk implementasi Job Tracker. Handler backend belum harus dianggap tersedia sampai route Hono dibuat.

### Create Application

`POST /applications`

Request body:

```json
{
  "userId": 1,
  "companyId": 1,
  "position": "Backend Engineer",
  "status": "wishlist",
  "source": "LinkedIn",
  "deadline": "2026-07-01",
  "salaryMin": "10000000.00",
  "salaryMax": "18000000.00",
  "salaryCurrency": "IDR",
  "jobDescription": "Build and maintain backend services...",
  "notes": "Strong match with current experience."
}
```

Response: `201 Created`

### List Applications

`GET /applications`

Optional query params:

| Param | Contoh | Catatan |
|-------|--------|---------|
| `status` | `applied` | Filter berdasarkan status |
| `companyId` | `1` | Filter berdasarkan perusahaan |
| `source` | `LinkedIn` | Filter berdasarkan sumber lowongan |

Response: `200 OK`

### Get Application Detail

`GET /applications/:id`

Response: `200 OK`

### Update Application

`PATCH /applications/:id`

Request body dapat berisi sebagian field application yang ingin diubah.

Response: `200 OK`

### Update Application Status

`PATCH /applications/:id/status`

Request body:

```json
{
  "status": "interview"
}
```

Response: `200 OK`

### Delete Application

`DELETE /applications/:id`

Response: `204 No Content`

## Getting Started

```bash
# Backend currently lives in be/
cd be

# Install backend dependencies
bun install

# Start backend development server
bun run dev
```

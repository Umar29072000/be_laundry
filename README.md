# 🧺 LaundryKu — Backend API Service

<div align="center">

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](#)
[![Express.js](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](#)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white)](#)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-4169E1?logo=postgresql&logoColor=white)](#)
[![Supabase](https://img.shields.io/badge/Supabase-Storage-3ECF8E?logo=supabase&logoColor=white)](#)
[![Vercel](https://img.shields.io/badge/Vercel-Deploy-000000?logo=vercel&logoColor=white)](#)
[![Zod](https://img.shields.io/badge/Zod-Validation-3068B7?logo=zod&logoColor=white)](#)

</div>

---

Backend API Service untuk aplikasi manajemen laundry berbasis **Multi-Tenant SaaS**. Dibangun dengan Express.js + TypeScript + Prisma ORM + PostgreSQL (Supabase). Mendukung autentikasi JWT, upload file ke Supabase Storage, pengiriman email otomatis, dan integrasi WhatsApp.

🌐 **Base URL:** `https://app.liveonline.codes/api`

---

## 🏗️ Arsitektur

```
Request → Express Router → Auth Middleware (JWT) → Controller → Service → Repository → Prisma → PostgreSQL
                                                        ↓
                                                   External API (Email/WhatsApp)
```

### Alur Autentikasi
- Register/Login → JWT token → Disimpan di `sessionStorage` frontend
- Setiap request dikirim dengan header `Authorization: Bearer <token>`
- Middleware `protect` mengekstrak `tenant.id` dari token

---

## ✨ Fitur Backend

| Fitur | Endpoint | Status |
|---|---|---|
| 🔐 **Auth** — Register, Login, Profile, Ganti Password, Upload Foto | `/api/auth/*` | ✅ |
| 👥 **Customers** — CRUD pelanggan | `/api/customers/*` | ✅ |
| 🧺 **Services** — CRUD layanan laundry | `/api/services/*` | ✅ |
| 📦 **Orders** — Buat, update status, tracking publik | `/api/orders/*` | ✅ |
| 📊 **Dashboard** — Statistik pendapatan & ringkasan | `/api/dashboard` | ✅ |
| 📈 **Reports** — Laporan keuangan detail + filter periode | `/api/reports` | ✅ |
| 📧 **Email** — Invoice otomatis via SMTP (Resend) | — | ✅ |
| 💬 **WhatsApp** — Notifikasi pesanan baru via Fonnte | — | ✅ |

---

## ⚙️ Instalasi Lokal

### Prasyarat
- Node.js v18+
- PostgreSQL database (lokal atau Supabase)

### Langkah-langkah

1. **Clone repositori**
   ```bash
   git clone https://github.com/Umar29072000/be_laundry.git
   cd be_laundry
   ```

2. **Install dependensi**
   ```bash
   npm install
   ```

3. **Konfigurasi environment** — Duplikat `.env` dan isi:
   ```env
   PORT=3000

   # Database (Supabase PostgreSQL)
   DATABASE_URL="postgresql://user:pass@host:6543/postgres?pgbouncer=true&connection_limit=1"
   DIRECT_URL="postgresql://user:pass@host:5432/postgres"

   # JWT
   JWT_SECRET="your-secret-key"
   JWT_EXPIRES_IN="1d"

   # Supabase Storage (untuk upload foto profil)
   SUPABASE_URL="https://your-project.supabase.co"
   SUPABASE_KEY="your-service-role-key"
   SUPABASE_BUCKET_NAME="laundry-profiles"

   # CORS
   FRONTEND_URL="http://localhost:5173"

   # SMTP (Email — Resend)
   RESEND_API_KEY="re_..."

   # WhatsApp (Fonnte)
   FONNTE_TOKEN="your-token"
   WHATSAPP_ENABLED="true"
   ```

4. **Sinkronisasi database**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. **Jalankan server**
   ```bash
   npm run dev
   ```

   Server berjalan di `http://localhost:3000` 🚀

---

## 📁 Struktur Folder

```text
be_laundry/
├── api/                     # Entry point Vercel Serverless
│   └── index.ts
├── prisma/
│   └── schema.prisma        # Schema database (Tenant, Customer, Service, Order, OrderItem)
├── src/
│   ├── config/
│   │   ├── env.ts           # Validasi environment variables (Zod)
│   │   ├── mailer.ts        # Konfigurasi SMTP (Resend)
│   │   └── whatsapp.ts      # Integrasi WhatsApp (Fonnte)
│   ├── controllers/         # Handler request-response
│   ├── middlewares/
│   │   ├── auth.middleware.ts    # JWT authentication
│   │   ├── upload.middleware.ts  # Multer file upload
│   │   └── rateLimit.middleware.ts
│   ├── repositories/        # Akses database (Prisma queries)
│   ├── routes/              # Routing Express
│   ├── services/            # Logika bisnis
│   └── utils/               # Helper & custom error classes
├── package.json
├── tsconfig.json
└── vercel.json              # Konfigurasi deploy Vercel
```

---

## 📡 Dokumentasi API

### 🔐 Autentikasi (`/api/auth`)

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| POST | `/api/auth/register` | ❌ | Daftar toko baru |
| POST | `/api/auth/login` | ❌ | Login & dapatkan token |
| GET | `/api/auth/profile` | ✅ | Lihat profil toko |
| PUT | `/api/auth/profile` | ✅ | Update profil toko |
| PUT | `/api/auth/password` | ✅ | Ganti password |
| POST | `/api/auth/profile-picture` | ✅ | Upload foto profil |

### 👥 Customers (`/api/customers`)

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| GET | `/api/customers` | ✅ | Semua pelanggan |
| POST | `/api/customers` | ✅ | Tambah pelanggan |
| DELETE | `/api/customers/:id` | ✅ | Hapus pelanggan |

### 🧺 Services (`/api/services`)

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| GET | `/api/services` | ✅ | Semua layanan |
| POST | `/api/services` | ✅ | Tambah layanan |
| DELETE | `/api/services/:id` | ✅ | Hapus layanan |

### 📦 Orders (`/api/orders`)

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| GET | `/api/orders` | ✅ | Semua pesanan |
| POST | `/api/orders` | ✅ | Buat pesanan baru |
| PUT | `/api/orders/:id/status` | ✅ | Update status |
| GET | `/api/orders/track/:id` | ❌ | Tracking publik |

**Order Status Pipeline:** `Pending → Washing → Ironing → Ready → Delivered`

### 📊 Dashboard & Reports

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| GET | `/api/dashboard` | ✅ | Statistik dashboard |
| GET | `/api/reports?period=month` | ✅ | Laporan keuangan detail |

**Parameter period:** `all` | `year` | `month` | `week`

---

## 📧 Integrasi Pihak Ketiga

### Email (Resend)
- Dikirim otomatis saat order **pertama kali dibuat** (bukan tiap update status)
- Template sudah dalam **Bahasa Indonesia**
- Konfigurasi via `RESEND_API_KEY` di `.env`

### WhatsApp (Fonnte)
- Dikirim otomatis saat order **pertama kali dibuat**
- Format pesan: ringkasan pesanan + link tracking
- Konfigurasi via `FONNTE_TOKEN` + `WHATSAPP_ENABLED` di `.env`

---

## 🚀 Deploy ke Vercel

1. Push repositori ke GitHub
2. Import project di [Vercel](https://vercel.com)
3. Set **Environment Variables** sesuai `.env`
4. Pastikan `vercel.json` sudah benar (includeFiles prisma)
5. Deploy! 🎉

### Catatan Penting
- Gunakan `prisma generate && tsc` sebagai script build
- Pastikan `includeFiles: ["prisma/**"]` di vercel.json
- Redeploy manual setelah ubah environment variables

---

## 📄 Lisensi

Dikembangkan untuk UMKM Laundry Indonesia.

---

*Dibuat dengan ❤️ untuk mendukung digitalisasi UMKM Laundry Indonesia*

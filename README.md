# 🧺 be_laundry — Backend API Service

[![Node.js](https://img.shields.io/badge/Node.js-v20+-339933?logo=node.js&logoColor=white)](#)
[![Express.js](https://img.shields.io/badge/Express.js-v5.x-000000?logo=express&logoColor=white)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.x-3178C6?logo=typescript&logoColor=white)](#)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white)](#)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-4169E1?logo=postgresql&logoColor=white)](#)
[![Supabase](https://img.shields.io/badge/Supabase-Storage-3ECF8E?logo=supabase&logoColor=white)](#)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?logo=vercel&logoColor=white)](#)

Dokumentasi lengkap Backend API Service untuk sistem manajemen laundry berbasis SaaS (**Multi-Tenant**). Backend ini mengelola data Tenant (toko laundry), Pelanggan (Customer), Layanan (Service), Transaksi (Order), Laporan Keuangan, serta penanganan file upload foto profil ke Supabase Storage.

---

## 📌 Daftar Isi
- [⚙️ Setup & Instalasi Lokal](#%EF%B8%8F-setup--instalasi-lokal)
- [🌐 Environment Variables](#-environment-variables)
- [📦 Struktur Folder](#-struktur-folder)
- [🚀 Panduan Deploy ke Vercel](#-panduan-deploy-ke-vercel)
- [📘 Dokumentasi API (Interaktif)](#-dokumentasi-api-interaktif)
  - [🔐 Autentikasi & Tenant Profile](#-autentikasi--tenant-profile)
  - [👥 Manajemen Customer](#-manajemen-customer)
  - [🧺 Manajemen Service](#-manajemen-service)
  - [📦 Manajemen Order & Tracking](#-manajemen-order--tracking)
  - [📊 Dashboard & Reports](#-dashboard--reports)
- [💻 Panduan Integrasi Frontend](#-panduan-integrasi-frontend)
  - [1. Axios Instance Setup](#1-axios-instance-setup)
  - [2. Upload Foto Profil (FormData)](#2-upload-foto-profil-formdata)

---

## ⚙️ Setup & Instalasi Lokal

Ikuti langkah-langkah di bawah ini untuk menjalankan backend di mesin lokal Anda:

### Prasyarat
- Node.js versi 18 ke atas
- Database PostgreSQL (lokal atau cloud/Supabase)

### Langkah-langkah
1. **Clone project dan masuk ke direktori backend:**
   ```bash
   git clone <repository-url>
   cd be_laundry
   ```

2. **Install dependensi:**
   ```bash
   npm install
   ```

3. **Konfigurasi Environment:**
   Duplikat file `.env` dan sesuaikan nilainya (Lihat bagian [Environment Variables](#-environment-variables)).

4. **Jalankan Sinkronisasi Schema Database:**
   Hubungkan database Anda dan jalankan perintah berikut untuk membuat tabel dan men-generate client Prisma:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. **Jalankan Aplikasi:**
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan di `http://localhost:3000`.

---

## 🌐 Environment Variables

Buat berkas `.env` di root direktori project Anda dengan variabel berikut:

```env
# Port server Express berjalan
PORT=3000

# ============================================================
# DATABASE — Supabase PostgreSQL
# ============================================================
# Masukkan pooling connection URL dari Supabase (port 6543)
DATABASE_URL="postgresql://<user>:<password>@<host>:6543/postgres?pgbouncer=true&connection_limit=1"
# Masukkan direct connection URL ke database (port 5432)
DIRECT_URL="postgresql://<user>:<password>@<host>:5432/postgres"

# ============================================================
# JWT (JSON Web Token)
# ============================================================
JWT_SECRET="masukkan_string_random_yang_panjang_dan_aman_disini"
JWT_EXPIRES_IN="1d"

# ============================================================
# SUPABASE — Storage & API
# ============================================================
SUPABASE_URL="https://your-supabase-project.supabase.co"
# Gunakan service_role secret key untuk bypass RLS pada upload profile
SUPABASE_KEY="your-supabase-service-role-secret-key"
SUPABASE_BUCKET_NAME="laundry-profiles"

# ============================================================
# FRONTEND CORS Whitelisting
# ============================================================
# URL frontend Anda untuk whitelist CORS (tanpa slash di akhir)
FRONTEND_URL="http://localhost:3000"

# ============================================================
# SMTP (Email Transaksional)
# ============================================================
SMTP_HOST="smtp.ethereal.email"
SMTP_PORT="587"
SMTP_USER="user_smtp@ethereal.email"
SMTP_PASS="password_smtp"
EMAIL_FROM="no-reply@laundrysaas.com"
```

---

## 📦 Struktur Folder

```text
be_laundry/
├── api/                  # Entry point untuk Vercel Serverless Functions
│   └── index.ts
├── prisma/               # File konfigurasi schema database & migrasi Prisma
│   └── schema.prisma
├── src/
│   ├── controllers/      # Logika penanganan request & response HTTP
│   ├── middlewares/      # Express middlewares (auth, upload, rate limit, error)
│   ├── models/           # Instansiasi Prisma Database Client
│   ├── requests/         # Schema validasi payload request menggunakan Zod
│   ├── responses/        # format Standard Data Transfer Object (DTO)
│   ├── routes/           # Routing API Express
│   ├── services/         # Logika bisnis inti (Auth, Order, Mailer, Supabase)
│   ├── utils/            # Helper fungsi penunjang & custom AppError
│   ├── app.ts            # Konfigurasi aplikasi Express
│   └── server.ts         # Entry point aplikasi (Development Lokal)
├── package.json
└── vercel.json           # Konfigurasi deploy Serverless di Vercel
```

---

## 🚀 Panduan Deploy ke Vercel

Backend ini dirancang agar dapat di-deploy dengan mulus di **Vercel** menggunakan serverless function.

### Poin Penting Sebelum Deploy:
- [ ] Pastikan script build di `package.json` Anda sudah dikonfigurasi dengan:
  ```json
  "build": "prisma generate && tsc"
  ```
- [ ] Pastikan runtime engine dapat mengakses file schema Prisma dengan menyematkan parameter `includeFiles` di `vercel.json`:
  ```json
  {
    "builds": [
      {
        "src": "api/index.ts",
        "use": "@vercel/node",
        "config": {
          "includeFiles": ["prisma/**"]
        }
      }
    ]
  }
  ```
- [ ] Masukkan semua variabel dari `.env` ke **Environment Variables** di dashboard project Vercel Anda.
- [ ] Setiap kali mengubah Environment Variables di Vercel, lakukan **Redeploy** manual agar perubahan dibaca oleh server.

---

## 📘 Dokumentasi API (Interaktif)

*Semua endpoint di bawah ini mengembalikan response berformat JSON. Endpoint bertanda 🔒 membutuhkan header `Authorization: Bearer <token_jwt>`.*

<details>
<summary>📂 <b>1. Autentikasi & Tenant Profile (<code>/api/auth</code>)</b></summary>

### Register Tenant
* `POST /api/auth/register`
* **Request Body:**
  ```json
  {
    "storeName": "Laundry Clean",
    "ownerName": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "08123456789",
    "address": "Jl. Mawar No. 1"
  }
  ```
* **Response (201):**
  ```json
  {
    "status": "success",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "data": {
      "tenant": {
        "id": "uuid",
        "storeName": "Laundry Clean",
        "ownerName": "John Doe",
        "email": "john@example.com",
        "phone": "08123456789",
        "address": "Jl. Mawar No. 1",
        "profilePictureUrl": null
      }
    }
  }
  ```

### Login Tenant
* `POST /api/auth/login`
* **Request Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
* **Response (200):** *(Sama dengan register)*

### Get Profile 🔒
* `GET /api/auth/profile`
* **Response (200):** Detail profil tenant yang sedang login.

### Update Profile 🔒
* `PUT /api/auth/profile`
* **Request Body (Semua Opsional):** `storeName`, `ownerName`, `phone`, `address`.

### Change Password 🔒
* `PUT /api/auth/password`
* **Request Body:**
  ```json
  {
    "oldPassword": "password123",
    "newPassword": "newpassword123"
  }
  ```

### Upload Profile Picture 🔒
* `POST /api/auth/profile-picture`
* **Content-Type:** `multipart/form-data`
* **Body:** file binary dengan key name **`photo`** (Max 5MB).
* **Response (200):**
  ```json
  {
    "status": "success",
    "data": {
      "tenant": {
        "profilePictureUrl": "https://<supabase-id>.supabase.co/storage/v1/object/public/laundry-profiles/tenant-xxx.jpg"
      }
    }
  }
  ```
</details>

<details>
<summary>📂 <b>2. Manajemen Customer (<code>/api/customers</code>) 🔒</b></summary>

### Get All Customers
* `GET /api/customers`
* **Response (200):** List customer yang terdaftar untuk tenant yang sedang login.

### Create Customer
* `POST /api/customers`
* **Request Body:**
  ```json
  {
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "08987654321",
    "address": "Jl. Dahlia No. 4"
  }
  ```
* **Response (201):** Customer yang berhasil terdaftar.

### Delete Customer
* `DELETE /api/customers/:id`
* **Response (204):** No Content.
</details>

<details>
<summary>📂 <b>3. Manajemen Service (<code>/api/services</code>) 🔒</b></summary>

### Get All Services
* `GET /api/services`
* **Response (200):** Daftar list jenis layanan laundry milik tenant.

### Create Service
* `POST /api/services`
* **Request Body:**
  ```json
  {
    "name": "Cuci Setrika Express",
    "price": 10000,
    "unit": "kg"
  }
  ```
* **Response (201):** Service detail yang ditambahkan.

### Delete Service
* `DELETE /api/services/:id`
* **Response (204):** No Content.
</details>

<details>
<summary>📂 <b>4. Transaksi & Tracking Order (<code>/api/orders</code>)</b></summary>

### Get All Orders 🔒
* `GET /api/orders`
* **Response (200):** Daftar semua pesanan laundry milik tenant.

### Create Order 🔒
* `POST /api/orders`
* **Request Body:**
  ```json
  {
    "customerId": "uuid-customer",
    "paymentMethod": "QRIS", // "Tunai" | "QRIS" | "Transfer_Bank"
    "items": [
      {
        "serviceId": "uuid-service-1",
        "quantity": 3.5
      },
      {
        "serviceId": "uuid-service-2",
        "quantity": 1
      }
    ]
  }
  ```
* **Response (201):** Rincian transaksi baru beserta email otomatis yang dikirim ke pelanggan.

### Update Order Status 🔒
* `PUT /api/orders/:id/status`
* **Request Body:**
  ```json
  {
    "status": "Washing" // "Pending" | "Washing" | "Ironing" | "Ready" | "Delivered"
  }
  ```

### Track Order *(Public - Tanpa Auth)*
* `GET /api/orders/track/:id`
* **Response (200):** Detail pesanan untuk tracking real-time status oleh pelanggan (dapat dipasang di landing page publik).
</details>

<details>
<summary>📂 <b>5. Dashboard & Laporan (<code>/api/dashboard</code> & <code>/api/reports</code>) 🔒</b></summary>

### Get Dashboard Statistics
* `GET /api/dashboard`
* **Response (200):**
  ```json
  {
    "status": "success",
    "data": {
      "totalCustomers": 12,
      "totalOrders": 34,
      "pendingOrdersCount": 3,
      "totalRevenue": 870000
    }
  }
  ```

### Get Financial Reports
* `GET /api/reports`
* **Response (200):** Akumulasi pendapatan kotor yang dikelompokkan berdasarkan metode pembayaran.
</details>

---

## 💻 Panduan Integrasi Frontend

### 1. Axios Instance Setup
Agar token JWT terlampir otomatis di setiap request yang membutuhkan autentikasi:

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  withCredentials: true,
});

// Attach JWT token ke headers Authorization
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### 2. Upload Foto Profil (FormData)
Karena backend mengintegrasikan upload file ke Supabase Storage, **Frontend tidak perlu menginstal SDK Supabase** ataupun menyimpan Supabase API Key. Cukup kirim payload file menggunakan format `FormData`.

```typescript
export const uploadProfilePicture = async (file: File) => {
  const formData = new FormData();
  // Field name WAJIB bernama "photo"
  formData.append('photo', file);

  const response = await api.post('/api/auth/profile-picture', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data; // Mengembalikan data tenant dengan profilePictureUrl baru
};
```

---

## ❌ Format Error Response

Setiap kegagalan validasi atau error sistem mengembalikan skema response seragam:

```json
{
  "status": "fail",
  "message": "Pesan deskripsi kesalahan"
}
```

| HTTP Status Code | Kondisi |
|---|---|
| `400` | Input validasi gagal (format data salah) |
| `401` | Unauthorized (Token tidak valid / expired / tidak disertakan) |
| `403` | Forbidden (Tidak memiliki hak akses) |
| `404` | Resources/Route tidak ditemukan |
| `429` | Rate limit terlampaui |
| `500` | Kesalahan internal server / API Pihak ketiga gagal |

---
*Dibuat untuk mempermudah integrasi sistem backend dengan frontend secara rapi, cepat, dan aman.*

# Ranking Video App (Next.js + Supabase)

Skeleton website ranking video: user upload klip + judul, pengunjung vote,
daftar diurutkan berdasarkan jumlah vote terbanyak.

## 1. Install dependency

```bash
npm install
```

## 2. Bikin project Supabase (gratis)

1. Daftar/login di https://supabase.com dan buat project baru.
2. Buka **SQL Editor** di dashboard Supabase, jalankan query ini untuk bikin tabel:

```sql
create table videos (
  id uuid default gen_random_uuid() primary key,
  judul text not null,
  video_url text not null,
  votes integer default 0,
  created_at timestamp with time zone default now()
);

alter table videos enable row level security;

create policy "Public read" on videos
  for select using (true);

create policy "Public insert" on videos
  for insert with check (true);

create policy "Public update votes" on videos
  for update using (true);
```

   > Catatan: policy di atas dibuat terbuka (public) supaya cepat jalan untuk
   > prototipe. Untuk versi production, sebaiknya tambahkan autentikasi user
   > dan batasi siapa yang boleh insert/update supaya nggak gampang di-spam.

3. Buka menu **Storage**, buat bucket baru bernama `videos`, set jadi **Public bucket**.

## 3. Isi environment variable

1. Buka **Settings > API** di dashboard Supabase, salin `Project URL` dan `anon public key`.
2. Copy file `.env.local.example` jadi `.env.local`, lalu isi dua value tadi:

```bash
cp .env.local.example .env.local
```

## 4. Jalankan project

```bash
npm run dev
```

Buka http://localhost:3000 — halaman utama nampilin daftar ranking video,
dan http://localhost:3000/upload untuk upload video baru.

## Struktur project

```
pages/
  index.js     -> halaman daftar ranking (urut berdasarkan vote)
  upload.js    -> form upload klip + judul
  _app.js
lib/
  supabaseClient.js  -> koneksi ke Supabase
components/
  Navbar.js
styles/
  globals.css
```

## Lanjutan (fitur berikutnya, belum ada di skeleton ini)

- Login/auth supaya vote nggak bisa di-spam sama orang yang sama
- AI generate judul otomatis dari transkrip video (Whisper + LLM)
- Render video overlay nomor ranking otomatis pakai FFmpeg
- Deploy gratis ke Vercel (`vercel.com`) — tinggal connect repo GitHub

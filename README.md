# Gawean.io

Gawean.io adalah aplikasi web dengan arsitektur terpisah antara **frontend** (React + Vite) dan **backend** (Laravel REST API).

## 🧱 Tech Stack

**Frontend**
- [Vite](https://vitejs.dev/) + React
- TypeScript
- ESLint

**Backend**
- [Laravel](https://laravel.com/)
- MySQL / MariaDB (via XAMPP)

## 📁 Struktur Folder

```
Gawean.io/
├── frontend/     # React + Vite app
└── backend/      # Laravel API
```

## 🚀 Getting Started

### Prasyarat

- Node.js (v18+)
- Composer
- PHP (v8.1+)
- XAMPP (Apache + MySQL) atau setara

### 1. Clone Repository

```bash
git clone https://github.com/username/Gawean.io.git
cd Gawean.io
```

### 2. Setup Backend (Laravel)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Atur koneksi database di file `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=gawean_io
DB_USERNAME=root
DB_PASSWORD=
```

Jalankan migrasi database:

```bash
php artisan migrate
```

Jalankan server Laravel:

```bash
php artisan serve
```

Backend akan berjalan di `http://127.0.0.1:8000`

### 3. Setup Frontend (Vite + React)

```bash
cd frontend
npm install
```

Buat file `.env` di folder `frontend` untuk menyimpan URL API:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

Jalankan development server:

```bash
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`

## 🔗 Menghubungkan Frontend & Backend

Pastikan Laravel API mengizinkan request dari frontend dengan mengatur **CORS** di `backend/config/cors.php`:

```php
'allowed_origins' => ['http://localhost:5173'],
```

## 📜 Available Scripts

**Frontend**
| Command | Deskripsi |
|---|---|
| `npm run dev` | Menjalankan dev server |
| `npm run build` | Build untuk production |
| `npm run lint` | Menjalankan ESLint |

**Backend**
| Command | Deskripsi |
|---|---|
| `php artisan serve` | Menjalankan server Laravel |
| `php artisan migrate` | Menjalankan migrasi database |
| `php artisan migrate:fresh --seed` | Reset database + seeding |

## 🤝 Kontribusi

1. Fork repository ini
2. Buat branch baru (`git checkout -b fitur-baru`)
3. Commit perubahan (`git commit -m 'Menambahkan fitur baru'`)
4. Push ke branch (`git push origin fitur-baru`)
5. Buat Pull Request

## 📄 Lisensi

Project ini dibuat untuk keperluan pembelajaran/tugas kuliah.

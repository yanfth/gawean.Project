<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\PenyediaJasa;
use App\Models\Jasa;
use App\Models\Testimonial;

class DummyDataSeeder extends Seeder
{
    public function run(): void
    {
        $penyediaData = [
            [
                'name' => 'Budi Santoso',
                'email' => 'budi.coder@example.com',
                'is_verified' => true,
                'jasa' => [
                    [
                        'title' => 'Pembuatan Website Landing Page',
                        'category' => 'Coding & Web',
                        'description' => 'Saya bisa membuatkan website landing page responsive dengan HTML, CSS, dan ReactJS dalam waktu 3 hari. Sangat cocok untuk tugas kuliah atau bisnis kecil.',
                        'price' => 250000,
                    ],
                    [
                        'title' => 'Jasa Fix Bug / Error PHP Laravel',
                        'category' => 'Coding & Web',
                        'description' => 'Tugas akhir atau project kamu error? Saya bantu fix bug di PHP Native, Laravel, atau CodeIgniter. Harga bisa nego tergantung tingkat kesulitan.',
                        'price' => 100000,
                    ],
                ],
                'testi' => [
                    ['client' => 'Andi Wijaya', 'rating' => 5, 'content' => 'Pekerjaan cepat dan responsif! Bug di skripsi saya langsung beres.'],
                    ['client' => 'Siti Aminah', 'rating' => 4, 'content' => 'Landing pagenya rapih dan sesuai desain figma. Terima kasih mas Budi.'],
                ]
            ],
            [
                'name' => 'Citra Maharani',
                'email' => 'citra.design@example.com',
                'is_verified' => true,
                'jasa' => [
                    [
                        'title' => 'Jasa Desain Feed Instagram Estetik',
                        'category' => 'Desain & UI/UX',
                        'description' => 'Desain feed instagram untuk organisasi mahasiswa, kepanitiaan, atau olshop. Paket 5 desain feed lengkap dengan revisi 2 kali.',
                        'price' => 150000,
                    ],
                    [
                        'title' => 'Desain UI/UX Figma untuk Aplikasi',
                        'category' => 'Desain & UI/UX',
                        'description' => 'Bikin prototype dan UI/UX mobile apps atau web pakai Figma. Hasilnya dijamin modern, clean, dan user-friendly.',
                        'price' => 300000,
                    ],
                ],
                'testi' => [
                    ['client' => 'BEM Fakultas', 'rating' => 5, 'content' => 'Desain feed untuk proker kita keren banget kak Citra! Makasih yaa'],
                ]
            ],
            [
                'name' => 'Agus Pratama',
                'email' => 'agus.writer@example.com',
                'is_verified' => false,
                'jasa' => [
                    [
                        'title' => 'Translate Jurnal Inggris - Indonesia',
                        'category' => 'Tulis & Edit',
                        'description' => 'Menerjemahkan jurnal atau paper bahasa inggris ke bahasa indonesia (atau sebaliknya). Bahasa baku dan mudah dipahami, bukan terjemahan mesin murni.',
                        'price' => 50000,
                    ],
                    [
                        'title' => 'Jasa Proofreading Makalah',
                        'category' => 'Tulis & Edit',
                        'description' => 'Mengecek tata bahasa, ejaan, dan format makalah sesuai EYD dan standar kampus.',
                        'price' => 75000,
                    ],
                ],
                'testi' => [
                    ['client' => 'Faisal', 'rating' => 4, 'content' => 'Terjemahannya lumayan oke, tapi butuh waktu sedikit lebih lama dari janji.'],
                ]
            ],
            [
                'name' => 'Dina Amalia',
                'email' => 'dina.tutor@example.com',
                'is_verified' => true,
                'jasa' => [
                    [
                        'title' => 'Tutor Pribadi Kalkulus & Matdas',
                        'category' => 'Video & Konten',
                        'description' => 'Bimbingan belajar online via Zoom untuk mata kuliah Kalkulus, Matematika Dasar, atau Aljabar Linier. 1 Sesi = 90 menit.',
                        'price' => 80000,
                    ],
                ],
                'testi' => [
                    ['client' => 'Rina', 'rating' => 5, 'content' => 'Kak Dina jelasinnya pelan-pelan dan sabar banget. Aku yang tadinya ga ngerti sama sekali jadi paham.'],
                    ['client' => 'Dodi', 'rating' => 5, 'content' => 'Recommended buat anak MIPA atau Teknik yang lagi pusing kalkulus.'],
                ]
            ],
            [
                'name' => 'Kevin Sanjaya',
                'email' => 'kevin.vid@example.com',
                'is_verified' => false,
                'jasa' => [
                    [
                        'title' => 'Jasa Edit Video Tiktok / Reels',
                        'category' => 'Video & Konten',
                        'description' => 'Editing video pendek untuk reels, tiktok, atau short youtube. Bebas request lagu dan transisi.',
                        'price' => 120000,
                    ],
                    [
                        'title' => 'Edit Video Dokumentasi Event Kampus',
                        'category' => 'Video & Konten',
                        'description' => 'Punya footage mentah event kampus tapi panitia ga sempet ngedit? Sini aku bantu. Durasi output maksimal 10 menit.',
                        'price' => 400000,
                    ],
                ],
                'testi' => [
                    ['client' => 'Panitia Ospek', 'rating' => 5, 'content' => 'Editan videonya mantap! Bikin merinding waktu diputar di penutupan acara.'],
                ]
            ],
        ];

        foreach ($penyediaData as $data) {
            // Create user
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make('password123'),
                'role' => 'penyedia_jasa',
            ]);

            // Create penyedia_jasa profile
            $penyedia = PenyediaJasa::create([
                'user_id' => $user->id,
                'is_verified' => $data['is_verified'],
                'verification_doc' => $data['is_verified'] ? 'dummy_ktm.pdf' : null,
            ]);

            // Create jasas
            foreach ($data['jasa'] as $jasaData) {
                Jasa::create([
                    'penyedia_jasa_id' => $penyedia->id,
                    'title' => $jasaData['title'],
                    'category' => $jasaData['category'],
                    'description' => $jasaData['description'],
                    'price' => $jasaData['price'],
                    'image' => null, // Biarkan tanpa gambar dulu atau bisa diberi fallback default
                ]);
            }

            // Create testimonials
            foreach ($data['testi'] as $testiData) {
                Testimonial::create([
                    'penyedia_jasa_id' => $penyedia->id,
                    'client_name' => $testiData['client'],
                    'content' => $testiData['content'],
                    'rating' => $testiData['rating'],
                ]);
            }
        }
    }
}

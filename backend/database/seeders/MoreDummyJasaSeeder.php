<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\PenyediaJasa;
use App\Models\Jasa;

class MoreDummyJasaSeeder extends Seeder
{
    public function run(): void
    {
        $dummyEmails = ['budi.coder@example.com', 'citra.design@example.com', 'agus.writer@example.com', 'dina.tutor@example.com', 'kevin.vid@example.com'];
        
        // 1. Delete all Jasa that belong to users NOT in the dummy emails (i.e. real users)
        $realUserIds = User::whereNotIn('email', $dummyEmails)->pluck('id');
        $realPenyediaIds = PenyediaJasa::whereIn('user_id', $realUserIds)->pluck('id');
        Jasa::whereIn('penyedia_jasa_id', $realPenyediaIds)->delete();

        // 2. Add more dummy Jasa to existing dummy users
        $budi = PenyediaJasa::whereHas('user', function($q) { $q->where('email', 'budi.coder@example.com'); })->first();
        $citra = PenyediaJasa::whereHas('user', function($q) { $q->where('email', 'citra.design@example.com'); })->first();
        $agus = PenyediaJasa::whereHas('user', function($q) { $q->where('email', 'agus.writer@example.com'); })->first();
        $kevin = PenyediaJasa::whereHas('user', function($q) { $q->where('email', 'kevin.vid@example.com'); })->first();

        $newJasas = [];

        if ($budi) {
            $newJasas = array_merge($newJasas, [
                ['penyedia_jasa_id' => $budi->id, 'title' => 'Jasa Pembuatan Aplikasi Mobile React Native', 'category' => 'Coding & Web', 'description' => 'Membuat aplikasi mobile Android dan iOS menggunakan React Native. Siap bantu tugas akhir atau bisnis.', 'price' => 500000, 'image' => 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800&auto=format&fit=crop'],
                ['penyedia_jasa_id' => $budi->id, 'title' => 'Jasa Setup Jaringan Mikrotik', 'category' => 'Coding & Web', 'description' => 'Bantu konfigurasi Mikrotik, setup hotspot, pembagian bandwidth untuk kos-kosan atau cafe.', 'price' => 300000, 'image' => 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=800&auto=format&fit=crop'],
                ['penyedia_jasa_id' => $budi->id, 'title' => 'Jasa Scrape Data Web (Python)', 'category' => 'Coding & Web', 'description' => 'Scraping data dari website target. Hasil bisa dalam bentuk Excel, CSV, atau JSON. Cocok untuk riset/skripsi.', 'price' => 150000, 'image' => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop'],
                ['penyedia_jasa_id' => $budi->id, 'title' => 'Jasa Bikin Bot Discord/Telegram', 'category' => 'Coding & Web', 'description' => 'Buat bot untuk manajemen grup, notifikasi otomatis, atau interaksi kustom menggunakan Node.js.', 'price' => 120000, 'image' => 'https://images.unsplash.com/photo-1610563166150-b34df4f3bcd6?q=80&w=800&auto=format&fit=crop'],
            ]);
        }

        if ($citra) {
            $newJasas = array_merge($newJasas, [
                ['penyedia_jasa_id' => $citra->id, 'title' => 'Jasa Desain Logo Olshop', 'category' => 'Desain & UI/UX', 'description' => 'Desain logo minimalis dan modern untuk online shop kamu. Dapat file master (AI/SVG).', 'price' => 75000, 'image' => 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=800&auto=format&fit=crop'],
                ['penyedia_jasa_id' => $citra->id, 'title' => 'Jasa Buat Powerpoint Menarik', 'category' => 'Desain & UI/UX', 'description' => 'Bosan dengan presentasi yang kaku? Saya bantu buat slide PPT animasi yang interaktif dan profesional.', 'price' => 80000, 'image' => 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=800&auto=format&fit=crop'],
                ['penyedia_jasa_id' => $citra->id, 'title' => 'Jasa Edit Foto Lightroom/Photoshop', 'category' => 'Desain & UI/UX', 'description' => 'Retouching foto wajah, ganti background, color grading ala selebgram. Harga per 5 foto.', 'price' => 40000, 'image' => 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=800&auto=format&fit=crop'],
                ['penyedia_jasa_id' => $citra->id, 'title' => 'Jasa Desain Banner & Spanduk', 'category' => 'Desain & UI/UX', 'description' => 'Desain untuk keperluan cetak seperti spanduk acara, banner event, atau x-banner sidang.', 'price' => 60000, 'image' => 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop'],
            ]);
        }

        if ($agus) {
            $newJasas = array_merge($newJasas, [
                ['penyedia_jasa_id' => $agus->id, 'title' => 'Jasa Pengetikan Dokumen 100 Halaman', 'category' => 'Tulis & Edit', 'description' => 'Ketikan cepat dan rapi. Ubah file PDF ke Word, atau ketik ulang dokumen tulisan tangan.', 'price' => 50000, 'image' => 'https://images.unsplash.com/photo-1455390582262-044cdead27d8?q=80&w=800&auto=format&fit=crop'],
                ['penyedia_jasa_id' => $agus->id, 'title' => 'Jasa Translate CV ke Bahasa Inggris', 'category' => 'Tulis & Edit', 'description' => 'Bikin CV kamu terlihat lebih profesional dengan translate ke bahasa inggris yang grammar-nya rapi.', 'price' => 35000, 'image' => 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=800&auto=format&fit=crop'],
                ['penyedia_jasa_id' => $agus->id, 'title' => 'Jasa Buat Makalah & Essay', 'category' => 'Tulis & Edit', 'description' => 'Jasa penulisan essay, opini, atau pendahuluan makalah. Bebas plagiasi dan referensi terpercaya.', 'price' => 70000, 'image' => 'https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?q=80&w=800&auto=format&fit=crop'],
                ['penyedia_jasa_id' => $agus->id, 'title' => 'Jasa Review Jurnal Internasional', 'category' => 'Tulis & Edit', 'description' => 'Bantu baca dan ringkaskan poin penting dari jurnal internasional. Sangat menghemat waktu riset.', 'price' => 100000, 'image' => 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?q=80&w=800&auto=format&fit=crop'],
            ]);
        }

        if ($kevin) {
            $newJasas = array_merge($newJasas, [
                ['penyedia_jasa_id' => $kevin->id, 'title' => 'Jasa Voice Over Video Pendek', 'category' => 'Video & Konten', 'description' => 'Isi suara (Voice Over) untuk iklan pendek, tiktok, atau explainer video. Suara maskulin.', 'price' => 100000, 'image' => 'https://images.unsplash.com/photo-1522045952775-6e3e1ec91a0c?q=80&w=800&auto=format&fit=crop'],
                ['penyedia_jasa_id' => $kevin->id, 'title' => 'Jasa Pembuatan Video Animasi 2D', 'category' => 'Video & Konten', 'description' => 'Bikin explainer video pake aset 2D. Cocok untuk presentasi bisnis atau edukasi.', 'price' => 200000, 'image' => 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop'],
                ['penyedia_jasa_id' => $kevin->id, 'title' => 'Jasa Dubbing Suara Pria', 'category' => 'Video & Konten', 'description' => 'Dubbing suara untuk project kampus atau indie game. Harga bisa dibicarakan.', 'price' => 90000, 'image' => 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=800&auto=format&fit=crop'],
            ]);
        }

        foreach ($newJasas as $jasa) {
            Jasa::create($jasa);
        }
    }
}

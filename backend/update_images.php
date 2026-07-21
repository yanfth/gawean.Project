<?php

$updates = [
    'Pembuatan Website Landing Page' => 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop',
    'Jasa Fix Bug / Error PHP Laravel' => 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop',
    'Jasa Desain Feed Instagram Estetik' => 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop',
    'Desain UI/UX Figma untuk Aplikasi' => 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop',
    'Translate Jurnal Inggris - Indonesia' => 'https://images.unsplash.com/photo-1455390582262-044cdead27d8?q=80&w=800&auto=format&fit=crop',
    'Jasa Proofreading Makalah' => 'https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?q=80&w=800&auto=format&fit=crop',
    'Tutor Pribadi Kalkulus & Matdas' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop',
    'Jasa Edit Video Tiktok / Reels' => 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=800&auto=format&fit=crop',
    'Edit Video Dokumentasi Event Kampus' => 'https://images.unsplash.com/photo-1535016120720-40c746a6580c?q=80&w=800&auto=format&fit=crop',

    // From MoreDummyJasaSeeder
    'Jasa Pembuatan Aplikasi Mobile React Native' => 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800&auto=format&fit=crop',
    'Jasa Setup Jaringan Mikrotik' => 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=800&auto=format&fit=crop',
    'Jasa Scrape Data Web (Python)' => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
    'Jasa Bikin Bot Discord/Telegram' => 'https://images.unsplash.com/photo-1610563166150-b34df4f3bcd6?q=80&w=800&auto=format&fit=crop',
    'Jasa Desain Logo Olshop' => 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=800&auto=format&fit=crop',
    'Jasa Buat Powerpoint Menarik' => 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=800&auto=format&fit=crop',
    'Jasa Edit Foto Lightroom/Photoshop' => 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=800&auto=format&fit=crop',
    'Jasa Desain Banner & Spanduk' => 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop',
    'Jasa Pengetikan Dokumen 100 Halaman' => 'https://images.unsplash.com/photo-1455390582262-044cdead27d8?q=80&w=800&auto=format&fit=crop',
    'Jasa Translate CV ke Bahasa Inggris' => 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=800&auto=format&fit=crop',
    'Jasa Buat Makalah & Essay' => 'https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?q=80&w=800&auto=format&fit=crop',
    'Jasa Review Jurnal Internasional' => 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?q=80&w=800&auto=format&fit=crop',
    'Jasa Voice Over Video Pendek' => 'https://images.unsplash.com/photo-1522045952775-6e3e1ec91a0c?q=80&w=800&auto=format&fit=crop',
    'Jasa Pembuatan Video Animasi 2D' => 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop',
    'Jasa Dubbing Suara Pria' => 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=800&auto=format&fit=crop',
];

foreach ($updates as $title => $image) {
    App\Models\Jasa::where('title', $title)->update(['image' => $image]);
}

echo "Jasa images updated successfully.\n";

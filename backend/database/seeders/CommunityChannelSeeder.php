<?php

namespace Database\Seeders;

use App\Models\CommunityChannel;
use Illuminate\Database\Seeder;

class CommunityChannelSeeder extends Seeder
{
    public function run(): void
    {
        $channels = [
            [
                'name' => 'Lounge',
                'description' => 'Ngobrol santai, kenalan, dan sharing pengalaman sesama mahasiswa freelancer.',
                'icon' => '💬',
            ],
            [
                'name' => 'Coding & Web',
                'description' => 'Diskusi proyek pemrograman, debugging, tech stack, dan sharing tips coding.',
                'icon' => '💻',
            ],
            [
                'name' => 'Desain & Kreatif',
                'description' => 'Sharing portofolio, minta feedback desain, dan diskusi tools kreatif.',
                'icon' => '🎨',
            ],
            [
                'name' => 'Tulis & Translate',
                'description' => 'Diskusi copywriting, penerjemahan, proofreading, dan tips menulis.',
                'icon' => '📝',
            ],
            [
                'name' => 'Lowongan Freelance',
                'description' => 'Sharing info proyek freelance, kolaborasi, dan peluang kerja.',
                'icon' => '💼',
            ],
        ];

        foreach ($channels as $channel) {
            CommunityChannel::firstOrCreate(
                ['name' => $channel['name']],
                $channel
            );
        }
    }
}

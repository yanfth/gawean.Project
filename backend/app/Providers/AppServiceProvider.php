<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Deteksi apakah server baru saja dinyalakan ulang
        $currentPid = getmypid();
        $lastPid = \Illuminate\Support\Facades\Cache::get('server_pid');
        
        if ($lastPid !== $currentPid) {
            // Server restarted! Hapus semua chat
            \Illuminate\Support\Facades\Cache::flush();
            \Illuminate\Support\Facades\Cache::put('server_pid', $currentPid);
            
            try {
                \App\Models\CommunityMessage::truncate();
            } catch (\Exception $e) {
                // Ignore jika tabel belum ada atau error
            }
        }
    }
}

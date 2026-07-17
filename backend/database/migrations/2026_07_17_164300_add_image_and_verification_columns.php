<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('jasa', function (Blueprint $table) {
            $table->string('image')->nullable()->after('price');
        });

        Schema::table('penyedia_jasa', function (Blueprint $table) {
            $table->boolean('is_verified')->default(false)->after('status_aktif');
            $table->string('verification_doc')->nullable()->after('is_verified');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('jasa', function (Blueprint $table) {
            $table->dropColumn('image');
        });

        Schema::table('penyedia_jasa', function (Blueprint $table) {
            $table->dropColumn(['is_verified', 'verification_doc']);
        });
    }
};

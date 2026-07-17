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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pencari_jasa_id')->constrained('pencari_jasa')->onDelete('cascade');
            $table->foreignId('jasa_id')->constrained('jasa')->onDelete('cascade');
            $table->string('status')->default('negotiating'); // negotiating, accepted, rejected, completed
            $table->decimal('agreed_price', 15, 2)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};

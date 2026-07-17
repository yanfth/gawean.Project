<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PenyediaJasa extends Model
{
    use HasFactory;

    protected $table = 'penyedia_jasa';

    protected $fillable = [
        'user_id',
        'kategori_jasa',
        'deskripsi_layanan',
        'pengalaman_tahun',
        'portofolio_url',
        'status_aktif',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function jasa()
    {
        return $this->hasMany(Jasa::class, 'penyedia_jasa_id');
    }
}

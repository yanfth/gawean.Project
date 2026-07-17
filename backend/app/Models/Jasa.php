<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Jasa extends Model
{
    protected $table = 'jasa';
    protected $fillable = ['penyedia_jasa_id', 'title', 'description', 'category', 'price'];

    public function penyedia()
    {
        return $this->belongsTo(PenyediaJasa::class, 'penyedia_jasa_id');
    }
}

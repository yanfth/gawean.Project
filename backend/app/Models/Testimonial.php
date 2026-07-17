<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    protected $fillable = ['penyedia_jasa_id', 'client_name', 'content', 'rating'];

    public function penyedia()
    {
        return $this->belongsTo(PenyediaJasa::class, 'penyedia_jasa_id');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PencariJasa extends Model
{
    use HasFactory;

    protected $table = 'pencari_jasa';

    protected $fillable = [
        'user_id',
        'preferensi',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

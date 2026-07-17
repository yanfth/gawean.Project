<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'pencari_jasa_id',
        'jasa_id',
        'status',
        'agreed_price',
    ];

    public function pencariJasa()
    {
        return $this->belongsTo(PencariJasa::class);
    }

    public function jasa()
    {
        return $this->belongsTo(Jasa::class);
    }

    public function messages()
    {
        return $this->hasMany(Message::class);
    }
}

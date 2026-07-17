<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommunityChannel extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'icon',
        'created_by',
    ];

    public function messages()
    {
        return $this->hasMany(CommunityMessage::class, 'channel_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}

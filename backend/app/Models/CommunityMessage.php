<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommunityMessage extends Model
{
    use HasFactory;

    protected $fillable = [
        'channel_id',
        'user_id',
        'content',
    ];

    public function channel()
    {
        return $this->belongsTo(CommunityChannel::class, 'channel_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

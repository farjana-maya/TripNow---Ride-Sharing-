<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LoyaltyPoint extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'ride_id',
        'points',
        'type',
        'description',
        'expires_at'
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'points' => 'integer'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function ride()
    {
        return $this->belongsTo(Ride::class);
    }
}
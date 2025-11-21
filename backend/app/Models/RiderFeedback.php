<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RiderFeedback extends Model
{
    use HasFactory;

    protected $fillable = [
        'rider_id',
        'ride_id',
        'type',
        'subject',
        'message',
        'rating',
        'status',
        'admin_response',
        'responded_by',
        'responded_at'
    ];

    protected $casts = [
        'responded_at' => 'datetime',
        'rating' => 'integer'
    ];

    public function rider()
    {
        return $this->belongsTo(User::class, 'rider_id');
    }

    public function ride()
    {
        return $this->belongsTo(Ride::class);
    }

    public function respondedBy()
    {
        return $this->belongsTo(User::class, 'responded_by');
    }
}
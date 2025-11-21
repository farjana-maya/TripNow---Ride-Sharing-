<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Dispute extends Model
{
    use HasFactory;

    protected $fillable = [
        'dispute_number',
        'ride_id',
        'reported_by',
        'reported_against',
        'dispute_type',
        'subject',
        'description',
        'evidence',
        'status',
        'priority',
        'resolution',
        'refund_amount',
        'resolved_by',
        'resolved_at',
    ];

    protected $casts = [
        'refund_amount' => 'decimal:2',
        'resolved_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($dispute) {
            if (empty($dispute->dispute_number)) {
                $dispute->dispute_number = 'DSP' . strtoupper(Str::random(8));
            }
        });
    }

    public function ride()
    {
        return $this->belongsTo(Ride::class);
    }

    public function reporter()
    {
        return $this->belongsTo(User::class, 'reported_by');
    }

    public function reportedUser()
    {
        return $this->belongsTo(User::class, 'reported_against');
    }

    public function resolver()
    {
        return $this->belongsTo(User::class, 'resolved_by');
    }
}

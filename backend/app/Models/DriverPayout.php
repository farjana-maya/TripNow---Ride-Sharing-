<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class DriverPayout extends Model
{
    use HasFactory;

    protected $fillable = [
        'payout_number',
        'driver_id',
        'amount',
        'payment_method',
        'account_details',
        'status',
        'rejection_reason',
        'approved_by',
        'approved_at',
        'processed_at',
        'transaction_reference',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'approved_at' => 'datetime',
        'processed_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($payout) {
            if (empty($payout->payout_number)) {
                $payout->payout_number = 'PAY' . strtoupper(Str::random(8));
            }
        });
    }

    public function driver()
    {
        return $this->belongsTo(Driver::class);
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
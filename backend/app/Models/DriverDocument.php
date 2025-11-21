<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DriverDocument extends Model
{
    use HasFactory;

    protected $fillable = [
        'driver_id',
        'document_type',
        'document_number',
        'document_path',
        'expiry_date',
        'verification_status',
        'rejection_reason',
        'verified_at',
        'verified_by',
    ];

    protected $casts = [
        'expiry_date' => 'date',
        'verified_at' => 'datetime',
    ];

    public function driver()
    {
        return $this->belongsTo(Driver::class);
    }

    public function verifier()
    {
        return $this->belongsTo(User::class, 'verified_by');
    }
}
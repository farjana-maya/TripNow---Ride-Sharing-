<?php
// FILE: app/Models/Driver.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Driver extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'license_number',
        'license_expiry',
        'vehicle_type',
        'vehicle_model',
        'vehicle_number',
        'vehicle_color',
        'vehicle_year',
        'nid_number',
        'nid_copy_path',
        'license_copy_path',
        'vehicle_documents',
        'address',
        'city',
        'state',
        'postal_code',
        'status',
        'rejection_reason',
        'rating',
        'total_rides',
        'total_earnings',
        'wallet_balance',
        'latitude',
        'longitude',
        'is_available',
        'last_location_update',
        'approved_at',
        'approved_by',
        'rejected_at',
        'rejected_by',
    ];

    protected $casts = [
        'rating' => 'decimal:2',
        'total_earnings' => 'decimal:2',
        'wallet_balance' => 'decimal:2',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'is_available' => 'boolean',
        'last_location_update' => 'datetime',
        'approved_at' => 'datetime',
        'rejected_at' => 'datetime',
        'vehicle_documents' => 'array',
    ];

    // Relationships
   public function user()
{
    return $this->belongsTo(User::class, 'user_id');
}

    public function rides()
    {
        return $this->hasMany(Ride::class, 'driver_id', 'user_id');
    }

    public function vehicles()
    {
        return $this->hasMany(Vehicle::class);
    }

    public function documents()
    {
        return $this->hasMany(DriverDocument::class);
    }

    public function ratings()
    {
        return $this->hasMany(Rating::class, 'driver_id', 'user_id');
    }

    public function payouts()
    {
        return $this->hasMany(DriverPayout::class);
    }

    // Scopes
    public function scopeAvailable($query)
    {
        return $query->where('status', 'online')->where('is_available', true);
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }
}

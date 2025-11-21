<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Ride extends Model
{
    use HasFactory;

    protected $fillable = [
        'ride_number',
        'rider_id',
        'driver_id',
        'pickup_location',
        'pickup_latitude',
        'pickup_longitude',
        'drop_location',
        'drop_latitude',
        'drop_longitude',
        'ride_type',
        'status',
        'distance',
        'duration',
        'base_fare',
        'distance_fare',
        'time_fare',
        'surge_multiplier',
        'total_fare',
        'commission',
        'driver_earnings',
        'payment_method',
        'payment_status',
        'cancellation_reason',
        'cancelled_by',
        'accepted_at',
        'arrived_at',
        'started_at',
        'completed_at',
        'cancelled_at',
        'notes',
        'scheduled_at',
        'vehicle_type',
    ];

    protected $casts = [
        'pickup_latitude' => 'decimal:8',
        'pickup_longitude' => 'decimal:8',
        'drop_latitude' => 'decimal:8',
        'drop_longitude' => 'decimal:8',
        'distance' => 'decimal:2',
        'base_fare' => 'decimal:2',
        'distance_fare' => 'decimal:2',
        'time_fare' => 'decimal:2',
        'surge_multiplier' => 'decimal:2',
        'total_fare' => 'decimal:2',
        'commission' => 'decimal:2',
        'driver_earnings' => 'decimal:2',
        'accepted_at' => 'datetime',
        'arrived_at' => 'datetime',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'cancelled_at' => 'datetime',
        'scheduled_at' => 'datetime',
    ];

    // Auto-generate ride number
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($ride) {
            if (empty($ride->ride_number)) {
                $ride->ride_number = 'TN' . strtoupper(Str::random(8));
            }
        });
    }

    // Relationships
    public function rider()
    {
        return $this->belongsTo(User::class, 'rider_id');
    }

    public function driver()
    {
        return $this->belongsTo(User::class, 'driver_id');
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }

    public function ratings()
    {
        return $this->hasMany(Rating::class);
    }

    public function review()
    {
        return $this->hasOne(RideReview::class);
    }

    public function disputes()
    {
        return $this->hasMany(Dispute::class);
    }

    // Scopes
    public function scopeOngoing($query)
    {
        return $query->whereIn('status', ['accepted', 'arrived', 'started']);
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeCancelled($query)
    {
        return $query->where('status', 'cancelled');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }
}

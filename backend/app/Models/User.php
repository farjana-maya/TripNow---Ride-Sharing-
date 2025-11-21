<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name',
        'username',
        'email',
        'phone',
        'password',
        'role',
        'is_active',
        'referred_by',
        'status',
        'blocked_reason',
        'blocked_at',
        'blocked_by',
    ];

    /**
     * The attributes that should be hidden for serialization.
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    /**
     * Relationships
     */
    public function driver()
{
    return $this->hasOne(Driver::class, 'user_id');
}

    public function ridesAsRider()
    {
        return $this->hasMany(Ride::class, 'rider_id');
    }

    public function ridesAsDriver()
    {
        return $this->hasMany(Ride::class, 'driver_id');
    }

    public function ratingsGiven()
    {
        return $this->hasMany(Rating::class, 'rider_id');
    }

    public function ratingsReceived()
    {
        return $this->hasMany(Rating::class, 'driver_id');
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function loyaltyPoints()
    {
        return $this->hasMany(LoyaltyPoint::class);
    }

    public function feedback()
    {
        return $this->hasMany(RiderFeedback::class, 'rider_id');
    }

    public function referrals()
    {
        return $this->hasMany(User::class, 'referred_by');
    }

    public function referredBy()
    {
        return $this->belongsTo(User::class, 'referred_by');
    }

    /**
     * Helper Methods - Role Checking
     */
    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    public function isDriver()
    {
        return $this->role === 'driver';
    }

    public function isUser()
    {
        return $this->role === 'user';
    }

    public function hasRole($role)
    {
        return $this->role === $role;
    }

    /**
     * Scopes
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeAdmins($query)
    {
        return $query->where('role', 'admin');
    }

    public function scopeDrivers($query)
    {
        return $query->where('role', 'driver');
    }

    public function scopeUsers($query)
    {
        return $query->where('role', 'user');
    }
}
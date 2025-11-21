<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rating extends Model
{
    use HasFactory;

    protected $fillable = [
        'ride_id',
        'rider_id',
        'driver_id',
        'rated_by',
        'rating',
        'review',
        'feedback_tags',
        'is_flagged',
        'flag_reason',
    ];

    protected $casts = [
        'is_flagged' => 'boolean',
    ];

    // Relationships
    public function ride()
    {
        return $this->belongsTo(Ride::class);
    }

    public function rider()
    {
        return $this->belongsTo(User::class, 'rider_id');
    }

    public function driver()
    {
        return $this->belongsTo(User::class, 'driver_id');
    }

    // Scopes
    public function scopeFlagged($query)
    {
        return $query->where('is_flagged', true);
    }

    public function scopeByDriver($query)
    {
        return $query->where('rated_by', 'driver');
    }

    public function scopeByRider($query)
    {
        return $query->where('rated_by', 'rider');
    }
}

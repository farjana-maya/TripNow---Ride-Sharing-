<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    use HasFactory;

    protected $fillable = [
        'driver_id',
        'vehicle_number',
        'vehicle_model',
        'vehicle_brand',
        'vehicle_year',
        'vehicle_color',
        'vehicle_type',
        'seating_capacity',
        'registration_document',
        'insurance_document',
        'insurance_expiry',
        'fitness_certificate',
        'fitness_expiry',
        'is_active',
    ];

    protected $casts = [
        'insurance_expiry' => 'date',
        'fitness_expiry' => 'date',
        'is_active' => 'boolean',
    ];

    public function driver()
    {
        return $this->belongsTo(Driver::class);
    }
}
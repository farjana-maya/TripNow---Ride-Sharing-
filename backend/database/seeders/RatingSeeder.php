<?php

// FILE: database/seeders/RatingSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Rating;
use App\Models\Ride;

class RatingSeeder extends Seeder
{
    public function run()
    {
        $completedRides = Ride::where('status', 'completed')->whereNotNull('driver_id')->get();

        $reviews = [
            'Great driver, very professional!',
            'Clean car and safe driving',
            'Very polite and helpful',
            'Excellent service',
            'Good experience overall',
            'Driver was on time',
            'Smooth ride, would recommend',
            'Very friendly driver',
        ];

        foreach ($completedRides as $ride) {
            // Rider rating driver
            Rating::create([
                'ride_id' => $ride->id,
                'rider_id' => $ride->rider_id,
                'driver_id' => $ride->driver_id,
                'rated_by' => 'rider',
                'rating' => rand(4, 5),
                'review' => $reviews[array_rand($reviews)],
                'is_flagged' => false,
                'created_at' => $ride->completed_at,
            ]);

            // Driver rating rider (50% chance)
            if (rand(0, 1)) {
                Rating::create([
                    'ride_id' => $ride->id,
                    'rider_id' => $ride->rider_id,
                    'driver_id' => $ride->driver_id,
                    'rated_by' => 'driver',
                    'rating' => rand(4, 5),
                    'review' => 'Good passenger',
                    'is_flagged' => false,
                    'created_at' => $ride->completed_at,
                ]);
            }
        }
    }
}

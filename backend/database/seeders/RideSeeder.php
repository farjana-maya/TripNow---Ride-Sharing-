<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Ride;
use App\Models\User;

class RideSeeder extends Seeder
{
    public function run()
    {
        $riders = User::where('role', 'user')->pluck('id')->toArray();
        $drivers = User::where('role', 'driver')->pluck('id')->toArray();

        // যদি riders বা drivers না থাকে, তাহলে seeder skip করবে
        if (empty($riders)) {
            $this->command->info('No riders found, skipping RideSeeder.');
            return;
        }

        if (empty($drivers)) {
            $this->command->info('No drivers found, RideSeeder will assign null to driver_id.');
        }

        $locations = [
            ['name' => 'Dhanmondi', 'lat' => 23.7465, 'lng' => 90.3763],
            ['name' => 'Gulshan', 'lat' => 23.7808, 'lng' => 90.4154],
            ['name' => 'Banani', 'lat' => 23.7936, 'lng' => 90.4066],
            ['name' => 'Mirpur', 'lat' => 23.8223, 'lng' => 90.3654],
            ['name' => 'Uttara', 'lat' => 23.8759, 'lng' => 90.3795],
            ['name' => 'Mohakhali', 'lat' => 23.7808, 'lng' => 90.4028],
            ['name' => 'Farmgate', 'lat' => 23.7563, 'lng' => 90.3889],
            ['name' => 'Bashundhara', 'lat' => 23.8223, 'lng' => 90.4254],
        ];

        $statuses = ['completed', 'completed', 'completed', 'accepted', 'cancelled', 'pending'];
        $vehicleTypes = ['car', 'bike', 'auto', 'luxury'];
        $paymentMethods = ['cash', 'card', 'wallet', 'upi'];

        for ($i = 0; $i < 50; $i++) {
            $pickup = $locations[array_rand($locations)];
            $drop = $locations[array_rand($locations)];
            $status = $statuses[array_rand($statuses)];
            
            $baseFare = rand(50, 150);
            $distanceFare = rand(100, 500);
            $timeFare = rand(20, 100);
            $totalFare = $baseFare + $distanceFare + $timeFare;
            $commission = $totalFare * 0.20; // 20% commission
            $driverEarnings = $totalFare - $commission;

            $rideData = [
                'rider_id' => $riders[array_rand($riders)],
                'driver_id' => $status !== 'pending' && !empty($drivers) ? $drivers[array_rand($drivers)] : null,
                'pickup_location' => $pickup['name'],
                'pickup_latitude' => $pickup['lat'],
                'pickup_longitude' => $pickup['lng'],
                'drop_location' => $drop['name'],
                'drop_latitude' => $drop['lat'],
                'drop_longitude' => $drop['lng'],
                'ride_type' => $vehicleTypes[array_rand($vehicleTypes)],
                'status' => $status,
                'distance' => rand(5, 30),
                'duration' => rand(15, 90),
                'base_fare' => $baseFare,
                'distance_fare' => $distanceFare,
                'time_fare' => $timeFare,
                'surge_multiplier' => 1.0,
                'total_fare' => $totalFare,
                'commission' => $commission,
                'driver_earnings' => $driverEarnings,
                'payment_method' => $paymentMethods[array_rand($paymentMethods)],
                'payment_status' => $status === 'completed' ? 'paid' : 'pending',
                'created_at' => now()->subDays(rand(0, 30)),
            ];

            if ($status === 'completed') {
                $rideData['accepted_at'] = now()->subDays(rand(0, 30));
                $rideData['started_at'] = now()->subDays(rand(0, 30));
                $rideData['completed_at'] = now()->subDays(rand(0, 30));
            } elseif ($status === 'cancelled') {
                $rideData['cancellation_reason'] = 'Driver not available';
                $rideData['cancelled_by'] = 'rider';
                $rideData['cancelled_at'] = now()->subDays(rand(0, 30));
            }

            Ride::create($rideData);
        }
    }
}

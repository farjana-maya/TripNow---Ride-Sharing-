<?php

// FILE: database/seeders/DriverSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Driver;
use App\Models\User;

class DriverSeeder extends Seeder
{
    public function run()
    {
        $driverUsers = User::where('role', 'driver')->get();

        $vehicleTypes = ['standard', 'premium', 'suv', 'bike'];
        $vehicleModels = ['Toyota Corolla', 'Honda Civic', 'Yamaha R15', 'TVS Apache', 'Auto Rickshaw', 'Mercedes S-Class'];
        $colors = ['Red', 'Blue', 'Black', 'White', 'Silver', 'Green'];
        $statuses = ['approved', 'approved', 'approved', 'pending', 'online'];

        foreach ($driverUsers as $index => $user) {
            $vehicleType = $vehicleTypes[array_rand($vehicleTypes)];
            
            Driver::create([
                'user_id' => $user->id,
                'license_number' => 'DL' . str_pad($index + 1, 8, '0', STR_PAD_LEFT),
                'license_expiry' => now()->addYears(rand(1, 5))->format('Y-m-d'),
                'vehicle_type' => $vehicleType,
                'vehicle_model' => $vehicleModels[array_rand($vehicleModels)],
                'vehicle_number' => 'DH-' . rand(10, 99) . '-' . rand(1000, 9999),
                'vehicle_color' => $colors[array_rand($colors)],
                'vehicle_year' => rand(2018, 2024),
                'nid_number' => 'NID' . str_pad($index + 1, 10, '0', STR_PAD_LEFT),
                'nid_copy_path' => 'drivers/nid/sample_nid_' . ($index + 1) . '.jpg',
                'license_copy_path' => 'drivers/license/sample_license_' . ($index + 1) . '.jpg',
                'vehicle_documents' => ['drivers/vehicle/sample_doc_' . ($index + 1) . '.jpg'],
                'status' => $statuses[array_rand($statuses)],
                'rating' => rand(40, 50) / 10, // 4.0 to 5.0
                'total_rides' => rand(50, 500),
                'total_earnings' => rand(5000, 50000),
                'wallet_balance' => rand(1000, 10000),
                'latitude' => 23.8103 + (rand(-100, 100) / 1000), // Dhaka area
                'longitude' => 90.4125 + (rand(-100, 100) / 1000),
                'is_available' => (bool)rand(0, 1),
                'last_location_update' => now()->subMinutes(rand(1, 60)),
            ]);
        }
    }
}

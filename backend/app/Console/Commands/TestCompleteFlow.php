<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Driver;
use App\Models\Ride;
use App\Models\RideAssignment;
use App\Models\User;

class TestCompleteFlow extends Command
{
    protected $signature = 'test:complete-flow';
    protected $description = 'Test the complete ride assignment flow';

    public function handle()
    {
        $this->info('=== Testing Complete Ride Assignment Flow ===');
        
        // 1. Check if we have drivers
        $drivers = Driver::where('status', 'approved')->where('is_available', true)->get();
        $this->info("Available drivers: {$drivers->count()}");
        
        if ($drivers->count() === 0) {
            $this->error('No available drivers found. Creating test driver...');
            
            // Create a test driver user
            $driverUser = User::create([
                'name' => 'Test Driver',
                'email' => 'testdriver@example.com',
                'phone' => '1234567890',
                'password' => bcrypt('password'),
                'role' => 'driver',
            ]);
            
            // Create driver profile
            Driver::create([
                'user_id' => $driverUser->id,
                'license_number' => 'TEST123',
                'license_expiry' => now()->addYear(),
                'vehicle_type' => 'bike',
                'vehicle_model' => 'Test Bike',
                'vehicle_number' => 'TEST-001',
                'vehicle_color' => 'Red',
                'vehicle_year' => 2023,
                'nid_number' => 'TEST-NID',
                'status' => 'approved',
                'is_available' => true,
            ]);
            
            $this->info('Test driver created');
        }
        
        // 2. Simulate ride booking
        $rider = User::where('role', 'user')->first();
        if (!$rider) {
            $rider = User::create([
                'name' => 'Test Rider',
                'email' => 'testrider@example.com',
                'phone' => '0987654321',
                'password' => bcrypt('password'),
                'role' => 'user',
            ]);
            $this->info('Test rider created');
        }
        
        // 3. Create a ride
        $ride = Ride::create([
            'rider_id' => $rider->id,
            'pickup_location' => 'Dhaka University',
            'pickup_latitude' => 23.7280,
            'pickup_longitude' => 90.3980,
            'drop_location' => 'Shahbagh',
            'drop_latitude' => 23.7380,
            'drop_longitude' => 90.4080,
            'scheduled_at' => now()->addMinutes(15),
            'vehicle_type' => 'bike',
            'ride_type' => 'bike',
            'status' => 'pending',
            'payment_status' => 'unpaid',
        ]);
        
        $this->info("Created ride: #{$ride->ride_number}");
        
        // 4. Find matching drivers and create assignments
        $matchingDrivers = Driver::where('vehicle_type', 'bike')
            ->where('status', 'approved')
            ->where('is_available', true)
            ->get();
            
        $this->info("Found {$matchingDrivers->count()} matching bike drivers");
        
        foreach ($matchingDrivers as $driver) {
            RideAssignment::create([
                'ride_id' => $ride->id,
                'driver_id' => $driver->user_id,
                'status' => 'assigned',
                'assigned_at' => now(),
            ]);
            $this->line("✓ Assigned to driver {$driver->user_id}");
        }
        
        // 5. Show final status
        $assignments = RideAssignment::where('ride_id', $ride->id)->get();
        $this->info("Total assignments created: {$assignments->count()}");
        
        $this->newLine();
        $this->info('=== Flow Complete ===');
        $this->info("Drivers should now see ride #{$ride->ride_number} in their dashboard");
        $this->info("API endpoint: GET /api/driver/rides?status=assigned");
    }
}
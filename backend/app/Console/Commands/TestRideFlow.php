<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Driver;
use App\Models\Ride;
use App\Models\RideAssignment;
use App\Models\User;
use App\Models\Notification;

class TestRideFlow extends Command
{
    protected $signature = 'test:ride-flow';
    protected $description = 'Test complete ride booking flow';

    public function handle()
    {
        $this->info('=== Testing Complete Ride Flow ===');
        
        // Create a test ride
        $rider = User::where('role', 'user')->first();
        if (!$rider) {
            $this->error('No rider found');
            return;
        }
        
        $ride = Ride::create([
            'rider_id' => $rider->id,
            'pickup_location' => 'Test Pickup Location',
            'pickup_latitude' => 23.8103,
            'pickup_longitude' => 90.4125,
            'drop_location' => 'Test Drop Location',
            'drop_latitude' => 23.8203,
            'drop_longitude' => 90.4225,
            'scheduled_at' => now()->addMinutes(30),
            'vehicle_type' => 'bike',
            'ride_type' => 'bike',
            'status' => 'pending',
            'payment_status' => 'unpaid',
        ]);
        
        $this->info("Created test ride: #{$ride->ride_number}");
        
        // Find available drivers with matching vehicle type
        $availableDrivers = Driver::with('user')
            ->where('vehicle_type', 'bike')
            ->where('status', 'approved')
            ->where('is_available', true)
            ->get();
            
        $this->info("Found {$availableDrivers->count()} available bike drivers");
        
        // Create assignments
        foreach ($availableDrivers as $driver) {
            $assignment = RideAssignment::create([
                'ride_id' => $ride->id,
                'driver_id' => $driver->user_id,
                'status' => 'assigned',
                'assigned_at' => now(),
            ]);
            
            $this->line("Created assignment ID: {$assignment->id} for driver {$driver->user_id}");
            
            // Create notification
            Notification::create([
                'user_id' => $driver->user_id,
                'role' => 'driver',
                'type' => 'ride_assigned',
                'title' => 'New Ride Request',
                'message' => "New bike ride #{$ride->ride_number} available!",
                'priority' => 'high',
            ]);
        }
        
        $this->info('=== Test Complete ===');
        $this->info("Drivers should now see ride #{$ride->ride_number} in their dashboard");
    }
}
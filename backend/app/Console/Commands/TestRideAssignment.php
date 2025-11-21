<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Driver;
use App\Models\Ride;
use App\Models\RideAssignment;
use App\Models\User;

class TestRideAssignment extends Command
{
    protected $signature = 'test:ride-assignment';
    protected $description = 'Test ride assignment functionality';

    public function handle()
    {
        $this->info('=== Testing Ride Assignment System ===');
        $this->newLine();

        // Check available drivers
        $drivers = Driver::with('user')
            ->where('status', 'approved')
            ->where('is_available', true)
            ->get();

        $this->info('Available Approved Drivers:');
        foreach ($drivers as $driver) {
            $this->line("- Driver ID: {$driver->user_id}, Vehicle: {$driver->vehicle_type}, Status: {$driver->status}, Available: " . ($driver->is_available ? 'Yes' : 'No'));
        }

        // Check all drivers regardless of status
        $allDrivers = Driver::with('user')->get();
        $this->newLine();
        $this->info('All Drivers:');
        foreach ($allDrivers as $driver) {
            $this->line("- Driver ID: {$driver->user_id}, Vehicle: {$driver->vehicle_type}, Status: {$driver->status}, Available: " . ($driver->is_available ? 'Yes' : 'No'));
        }

        // Check recent rides
        $recentRides = Ride::with('rider')->where('status', 'pending')->latest()->take(5)->get();
        $this->newLine();
        $this->info('Recent Pending Rides:');
        foreach ($recentRides as $ride) {
            $this->line("- Ride #{$ride->ride_number}, Vehicle: {$ride->vehicle_type}, Status: {$ride->status}");
        }

        // Check ride assignments
        $assignments = RideAssignment::with(['ride', 'driver'])->where('status', 'assigned')->latest()->take(10)->get();
        $this->newLine();
        $this->info('Active Assignments:');
        foreach ($assignments as $assignment) {
            $this->line("- Assignment ID: {$assignment->id}, Ride: #{$assignment->ride->ride_number}, Driver: {$assignment->driver_id}, Status: {$assignment->status}");
        }

        $this->newLine();
        $this->info('=== Test Complete ===');
    }
}
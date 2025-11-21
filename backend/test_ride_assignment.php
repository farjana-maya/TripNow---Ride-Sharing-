<?php
require_once 'vendor/autoload.php';

use App\Models\Driver;
use App\Models\Ride;
use App\Models\RideAssignment;
use App\Models\User;

// Test ride assignment functionality
echo "=== Testing Ride Assignment System ===\n\n";

// Check available drivers
$drivers = Driver::with('user')
    ->where('status', 'approved')
    ->where('is_available', true)
    ->get();

echo "Available Drivers:\n";
foreach ($drivers as $driver) {
    echo "- Driver ID: {$driver->user_id}, Vehicle: {$driver->vehicle_type}, Status: {$driver->status}, Available: " . ($driver->is_available ? 'Yes' : 'No') . "\n";
}

// Check recent rides
$recentRides = Ride::with('rider')->where('status', 'pending')->latest()->take(5)->get();
echo "\nRecent Pending Rides:\n";
foreach ($recentRides as $ride) {
    echo "- Ride #{$ride->ride_number}, Vehicle: {$ride->vehicle_type}, Status: {$ride->status}\n";
}

// Check ride assignments
$assignments = RideAssignment::with(['ride', 'driver'])->where('status', 'assigned')->latest()->take(10)->get();
echo "\nActive Assignments:\n";
foreach ($assignments as $assignment) {
    echo "- Assignment ID: {$assignment->id}, Ride: #{$assignment->ride->ride_number}, Driver: {$assignment->driver_id}, Status: {$assignment->status}\n";
}

echo "\n=== Test Complete ===\n";
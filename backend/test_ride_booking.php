<?php

require_once 'vendor/autoload.php';

use Illuminate\Foundation\Application;
use Illuminate\Contracts\Console\Kernel;
use Illuminate\Http\Request;

$app = require_once 'bootstrap/app.php';
$app->make(Kernel::class)->bootstrap();

echo "Testing ride booking...\n";

try {
    // Create a test ride
    $ride = App\Models\Ride::create([
        'rider_id' => 1,
        'pickup_location' => 'Test Pickup',
        'pickup_latitude' => 23.8103,
        'pickup_longitude' => 90.4125,
        'drop_location' => 'Test Dropoff',
        'drop_latitude' => 23.8203,
        'drop_longitude' => 90.4225,
        'scheduled_at' => now()->addHour(),
        'vehicle_type' => 'standard',
        'status' => 'pending',
        'payment_status' => 'unpaid',
    ]);

    echo "Ride created with ID: " . $ride->id . "\n";

    // Check available drivers
    $drivers = App\Models\Driver::with('user')
        ->where('status', 'approved')
        ->where('is_available', true)
        ->where('vehicle_type', 'standard')
        ->whereHas('user', function($query) {
            $query->where('status', 'online');
        })
        ->get();

    echo "Available drivers: " . $drivers->count() . "\n";

    if ($drivers->count() > 0) {
        echo "Driver details:\n";
        foreach ($drivers as $driver) {
            echo "- ID: {$driver->id}, User ID: {$driver->user_id}, Status: {$driver->status}, Available: " . ($driver->is_available ? 'Yes' : 'No') . "\n";
        }
    }

    // Test the booking logic
    $request = new Request([
        'pickup_location' => 'Test Pickup',
        'pickup_latitude' => 23.8103,
        'pickup_longitude' => 90.4125,
        'dropoff_location' => 'Test Dropoff',
        'dropoff_latitude' => 23.8203,
        'dropoff_longitude' => 90.4225,
        'scheduled_at' => now()->addHour()->toISOString(),
        'vehicle_type' => 'standard',
        'notes' => 'Test booking'
    ]);

    // Mock authenticated user
    $user = App\Models\User::where('email', 'test@example.com')->first();
    if ($user) {
        $request->setUserResolver(function () use ($user) {
            return $user;
        });
    }

    $controller = new App\Http\Controllers\RideController();
    $response = $controller->bookRide($request);

    echo "Booking response status: " . $response->getStatusCode() . "\n";

    if ($response->getStatusCode() === 201) {
        $data = json_decode($response->getContent(), true);
        echo "Booking successful: " . ($data['success'] ? 'Yes' : 'No') . "\n";
        if ($data['success']) {
            echo "Ride ID: " . $data['ride']['id'] . "\n";
        }
    } else {
        $data = json_decode($response->getContent(), true);
        echo "Booking failed: " . ($data['message'] ?? 'Unknown error') . "\n";
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . ":" . $e->getLine() . "\n";
}

<?php

require_once 'vendor/autoload.php';

use Illuminate\Foundation\Application;
use Illuminate\Contracts\Console\Kernel;

$app = require_once 'bootstrap/app.php';
$app->make(Kernel::class)->bootstrap();

echo "Updating drivers...\n";

// Update all drivers with old vehicle types to new ones
App\Models\Driver::where('vehicle_type', 'car')->update(['vehicle_type' => 'standard']);
App\Models\Driver::where('vehicle_type', 'auto')->update(['vehicle_type' => 'bike']);
App\Models\Driver::where('vehicle_type', 'luxury')->update(['vehicle_type' => 'premium']);

// Make some standard drivers available
App\Models\Driver::where('vehicle_type', 'standard')->where('status', 'approved')->update(['is_available' => true]);

echo "Drivers updated!\n";

<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Driver;
use App\Models\User;

class FixDriverData extends Command
{
    protected $signature = 'fix:driver-data';
    protected $description = 'Fix duplicate driver records and ensure proper status';

    public function handle()
    {
        $this->info('=== Fixing Driver Data ===');
        
        // Get all drivers grouped by user_id
        $drivers = Driver::all()->groupBy('user_id');
        
        foreach ($drivers as $userId => $userDrivers) {
            if ($userDrivers->count() > 1) {
                $this->warn("User $userId has {$userDrivers->count()} driver records");
                
                // Keep the most recent one and delete others
                $latest = $userDrivers->sortByDesc('created_at')->first();
                $toDelete = $userDrivers->except($latest->id);
                
                foreach ($toDelete as $driver) {
                    $this->line("Deleting duplicate driver record ID: {$driver->id}");
                    $driver->delete();
                }
            }
        }
        
        // Update driver statuses to be consistent
        $this->info('Updating driver statuses...');
        Driver::where('status', 'online')->update(['status' => 'approved', 'is_available' => true]);
        Driver::where('status', 'offline')->update(['status' => 'approved', 'is_available' => false]);
        
        $this->info('=== Driver Data Fixed ===');
    }
}
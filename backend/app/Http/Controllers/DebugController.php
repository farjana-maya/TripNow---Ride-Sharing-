<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Driver;
use App\Models\Ride;
use App\Models\RideAssignment;
use App\Models\User;

class DebugController extends Controller
{
    public function testRideAssignments()
    {
        $data = [
            'drivers' => Driver::with('user')->get()->map(function($driver) {
                return [
                    'id' => $driver->id,
                    'user_id' => $driver->user_id,
                    'name' => $driver->user->name ?? 'Unknown',
                    'vehicle_type' => $driver->vehicle_type,
                    'status' => $driver->status,
                    'is_available' => $driver->is_available,
                ];
            }),
            'rides' => Ride::with('rider')->where('status', 'pending')->get()->map(function($ride) {
                return [
                    'id' => $ride->id,
                    'ride_number' => $ride->ride_number,
                    'vehicle_type' => $ride->vehicle_type,
                    'status' => $ride->status,
                    'rider' => $ride->rider->name ?? 'Unknown',
                ];
            }),
            'assignments' => RideAssignment::with(['ride', 'driver'])->where('status', 'assigned')->get()->map(function($assignment) {
                return [
                    'id' => $assignment->id,
                    'ride_number' => $assignment->ride->ride_number ?? 'Unknown',
                    'driver_id' => $assignment->driver_id,
                    'status' => $assignment->status,
                    'assigned_at' => $assignment->assigned_at,
                ];
            }),
        ];
        
        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }
}
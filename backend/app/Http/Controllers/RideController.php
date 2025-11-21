<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use App\Models\Ride;
use App\Models\User;
use App\Models\Notification;
use App\Models\Driver;
use App\Models\RideAssignment;

class RideController extends Controller
{
    // ✅ Book a new ride (Rider) - Notifies ALL available drivers
    public function bookRide(Request $request)
{
    try {
        $user = $request->user();

        if (!$user || $user->role !== 'user') {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'pickup_location' => 'required|string|max:255',
            'pickup_latitude' => 'required|numeric|between:-90,90',
            'pickup_longitude' => 'required|numeric|between:-180,180',
            'dropoff_location' => 'required|string|max:255',
            'dropoff_latitude' => 'required|numeric|between:-90,90',
            'dropoff_longitude' => 'required|numeric|between:-180,180',
            'scheduled_at' => 'required|date|after:now',
            'vehicle_type' => 'required|string|in:standard,premium,suv,bike',
            'notes' => 'nullable|string|max:500',
            'total_fare' => 'nullable|numeric|min:0',
            'distance' => 'nullable|numeric|min:0',
            'duration' => 'nullable|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();

        // Calculate fare if not provided
        $totalFare = $request->total_fare;
        if (!$totalFare) {
            // Default fare calculation based on vehicle type
            $baseFares = [
                'standard' => 50,
                'premium' => 75,
                'suv' => 100,
                'bike' => 25
            ];
            $perKmRates = [
                'standard' => 15,
                'premium' => 22,
                'suv' => 30,
                'bike' => 8
            ];
            
            $baseFare = $baseFares[$request->vehicle_type] ?? 50;
            $perKmRate = $perKmRates[$request->vehicle_type] ?? 15;
            $distance = $request->distance ?? 10; // Default 10km if not provided
            $duration = $request->duration ?? 20; // Default 20min if not provided
            
            $totalFare = $baseFare + ($distance * $perKmRate) + ($duration * 2);
        }

        // Create the ride
        $ride = Ride::create([
            'rider_id' => $user->id,
            'pickup_location' => $request->pickup_location,
            'pickup_latitude' => $request->pickup_latitude,
            'pickup_longitude' => $request->pickup_longitude,
            'drop_location' => $request->dropoff_location,
            'drop_latitude' => $request->dropoff_latitude,
            'drop_longitude' => $request->dropoff_longitude,
            'scheduled_at' => $request->scheduled_at,
            'vehicle_type' => $request->vehicle_type,
            'ride_type' => $request->vehicle_type,
            'status' => 'pending',
            'notes' => $request->notes,
            'payment_status' => 'unpaid',
            'total_fare' => $totalFare,
            'distance' => $request->distance ?? 10,
            'duration' => $request->duration ?? 20,
        ]);

        // Find ALL available drivers with MATCHING vehicle type
        $availableDrivers = Driver::with('user')
            ->where('vehicle_type', $request->vehicle_type) // MATCH VEHICLE TYPE
            ->whereIn('status', ['approved', 'online']) // Include both approved and online drivers
            ->where('is_available', true)
            ->whereHas('user', function($query) {
                $query->where('role', 'driver');
            })
            ->get();

        if ($availableDrivers->isEmpty()) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => "No {$request->vehicle_type} drivers available at the moment. Please try again later or choose a different vehicle type."
            ], 400);
        }

        // Create assignments for ALL available drivers
        foreach ($availableDrivers as $driver) {
            RideAssignment::create([
                'ride_id' => $ride->id,
                'driver_id' => $driver->user_id,
                'status' => 'assigned',
                'assigned_at' => now(),
            ]);

            // Notify each driver
            Notification::create([
                'user_id' => $driver->user_id,
                'role' => 'driver',
                'type' => 'ride_assigned',
                'title' => 'New Ride Request',
                'message' => "New {$request->vehicle_type} ride #{$ride->ride_number} available! From {$request->pickup_location} to {$request->dropoff_location}. Accept now!",
                'priority' => 'high',
            ]);
        }

        // Notify admins
        $admins = User::where('role', 'admin')->get();
        foreach ($admins as $admin) {
            Notification::create([
                'user_id' => $admin->id,
                'role' => 'admin',
                'type' => 'new_ride',
                'title' => 'New Ride Booking',
                'message' => "New {$request->vehicle_type} ride #{$ride->ride_number} booked by {$user->name}. {$availableDrivers->count()} drivers notified.",
                'priority' => 'high',
            ]);
        }

        DB::commit();

        return response()->json([
            'success' => true,
            'message' => 'Ride booked successfully! Searching for driver...',
            'ride' => $ride->load('rider'),
            'drivers_notified' => $availableDrivers->count()
        ], 201);

    } catch (\Exception $e) {
        DB::rollBack();
        Log::error('Ride Booking Error: ' . $e->getMessage());
        return response()->json(['success' => false, 'message' => 'Failed to book ride'], 500);
    }
}

    public function cancelRide(Request $request, $id)
    {
        try {
            $user = $request->user();

            if (!$user || $user->role !== 'user') {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
            }

            $ride = Ride::where('id', $id)
                       ->where('rider_id', $user->id)
                       ->whereIn('status', ['pending', 'assigned'])
                       ->firstOrFail();

            DB::beginTransaction();

            // Update ride status
            $ride->update([
                'status' => 'cancelled',
                'cancelled_at' => now(),
                'cancelled_by' => $user->id,
                'cancellation_reason' => 'Cancelled by rider',
            ]);

            // Cancel all ride assignments
            RideAssignment::where('ride_id', $id)
                         ->where('status', 'assigned')
                         ->update([
                             'status' => 'cancelled',
                             'responded_at' => now(),
                         ]);

            // Notify driver if assigned
            if ($ride->driver_id) {
                Notification::create([
                    'user_id' => $ride->driver_id,
                    'role' => 'driver',
                    'type' => 'ride_cancelled',
                    'title' => 'Ride Cancelled',
                    'message' => "Ride #{$ride->ride_number} has been cancelled by the rider.",
                    'priority' => 'high',
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Ride cancelled successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Cancel Ride Error: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Failed to cancel ride'], 500);
        }
    }

    // ✅ Get user's rides (Rider)
    public function getUserRides(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
            }

            $status = $request->query('status');

            $query = Ride::with(['rider', 'driver', 'review'])
                ->where('rider_id', $user->id);

            if ($status) {
                $statuses = explode(',', $status);
                $query->whereIn('status', $statuses);
            }

            $rides = $query->orderBy('created_at', 'desc')
                          ->paginate(10);

            return response()->json([
                'success' => true,
                'rides' => $rides
            ]);

        } catch (\Exception $e) {
            Log::error('Get User Rides Error: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Failed to get rides'], 500);
        }
    }

    // ✅ Get ride details
    public function getRide($id, Request $request)
    {
        try {
            $user = $request->user();

            $ride = Ride::with(['rider', 'driver'])
                       ->findOrFail($id);

            // Check if user has permission to view this ride
            if ($user->role === 'user' && $ride->rider_id !== $user->id) {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
            }

            if ($user->role === 'driver' && $ride->driver_id !== $user->id) {
                // Check if driver has an assignment for this ride
                $assignment = RideAssignment::where('ride_id', $id)
                                           ->where('driver_id', $user->id)
                                           ->first();
                
                if (!$assignment) {
                    return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
                }
            }

            return response()->json([
                'success' => true,
                'ride' => $ride
            ]);

        } catch (\Exception $e) {
            Log::error('Get Ride Error: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Ride not found'], 404);
        }
    }

    // ✅ Update ride location (Driver)
    public function updateLocation(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user || $user->role !== 'driver') {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
            }

            $validator = Validator::make($request->all(), [
                'ride_id' => 'required|exists:rides,id',
                'latitude' => 'required|numeric|between:-90,90',
                'longitude' => 'required|numeric|between:-180,180',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $ride = Ride::where('id', $request->ride_id)
                       ->where('driver_id', $user->id)
                       ->whereIn('status', ['accepted', 'arrived', 'started'])
                       ->firstOrFail();

            // Update driver's current location (store in database or cache)
            Log::info("Driver {$user->id} location update for ride {$request->ride_id}: {$request->latitude}, {$request->longitude}");

            return response()->json([
                'success' => true,
                'message' => 'Location updated successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Update Location Error: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Failed to update location'], 500);
        }
    }

    // ✅ Add ride review (Rider)
    public function addReview(Request $request, $id)
    {
        try {
            $user = $request->user();

            if (!$user || $user->role !== 'user') {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
            }

            $validator = Validator::make($request->all(), [
                'rating' => 'required|integer|min:1|max:5',
                'comment' => 'nullable|string|max:500',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $ride = Ride::where('id', $id)
                       ->where('rider_id', $user->id)
                       ->where('status', 'completed')
                       ->firstOrFail();

            if ($ride->review) {
                return response()->json(['success' => false, 'message' => 'Review already exists'], 400);
            }

            $review = \App\Models\RideReview::create([
                'ride_id' => $ride->id,
                'user_id' => $user->id,
                'driver_id' => $ride->driver_id,
                'rating' => $request->rating,
                'comment' => $request->comment,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Review added successfully',
                'review' => $review
            ]);

        } catch (\Exception $e) {
            Log::error('Add Review Error: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Failed to add review'], 500);
        }
    }
}
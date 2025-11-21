<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use App\Models\Ride;
use App\Models\User;
use App\Models\Driver;
use App\Models\Notification;
use App\Models\RideAssignment;
use Carbon\Carbon;

class DriverRideController extends Controller
{
    // ✅ Get driver's rides
    public function getDriverRides(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user || $user->role !== 'driver') {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
            }

            $status = $request->query('status');

            if ($status === 'assigned') {
                // Get rides assigned to this driver via ride_assignments table
                $assignments = RideAssignment::with(['ride.rider'])
                    ->where('driver_id', $user->id)
                    ->where('status', 'assigned')
                    ->orderBy('assigned_at', 'desc')
                    ->paginate(10);

                $rides = $assignments->map(function ($assignment) {
                    $ride = $assignment->ride;
                    if ($ride) {
                        $ride->assignment_id = $assignment->id;
                        $ride->assigned_at = $assignment->assigned_at;
                        return $ride;
                    }
                    return null;
                })->filter();

                return response()->json([
                    'success' => true,
                    'rides' => [
                        'data' => $rides->values(),
                        'current_page' => $assignments->currentPage(),
                        'last_page' => $assignments->lastPage(),
                        'per_page' => $assignments->perPage(),
                        'total' => $assignments->total(),
                    ]
                ]);
            } else {
                // Get rides where driver is assigned (legacy)
                $query = Ride::with(['rider'])
                            ->where('driver_id', $user->id);

                if ($status) {
                    if ($status === 'active') {
                        $query->whereIn('status', ['accepted', 'arrived', 'started']);
                    } elseif ($status === 'completed') {
                        $query->where('status', 'completed');
                    }
                }

                $rides = $query->orderBy('created_at', 'desc')
                              ->paginate(10);

                return response()->json([
                    'success' => true,
                    'rides' => $rides
                ]);
            }

        } catch (\Exception $e) {
            Log::error('Get Driver Rides Error: ' . $e->getMessage() . ' Stack: ' . $e->getTraceAsString());
            return response()->json([
                'success' => false, 
                'message' => 'Failed to get rides: ' . $e->getMessage(),
                'debug' => config('app.debug') ? $e->getTraceAsString() : null
            ], 500);
        }
    }

    // ✅ Accept ride (Driver)
    public function acceptRide(Request $request, $id)
    {
        try {
            $user = $request->user();

            if (!$user || $user->role !== 'driver') {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
            }

            DB::beginTransaction();

            // Check if ride is assigned via ride_assignments table
            $assignment = RideAssignment::where('ride_id', $id)
                                       ->where('driver_id', $user->id)
                                       ->where('status', 'assigned')
                                       ->first();

            if ($assignment) {
                // Update assignment status
                $assignment->update([
                    'status' => 'accepted',
                    'responded_at' => now(),
                ]);

                // Update ride status and assign driver
                $ride = Ride::findOrFail($id);
                $ride->update([
                    'status' => 'accepted',
                    'driver_id' => $user->id,
                    'accepted_at' => now(),
                ]);

                // Mark other assignments as rejected
                RideAssignment::where('ride_id', $id)
                             ->where('driver_id', '!=', $user->id)
                             ->where('status', 'assigned')
                             ->update(['status' => 'rejected', 'responded_at' => now()]);
            } else {
                // Legacy check - direct assignment
                $ride = Ride::where('id', $id)
                           ->where('driver_id', $user->id)
                           ->where('status', 'assigned')
                           ->firstOrFail();

                $ride->update([
                    'status' => 'accepted',
                    'accepted_at' => now(),
                ]);
            }

            // Notify rider
            Notification::create([
                'user_id' => $ride->rider_id,
                'role' => 'rider',
                'type' => 'ride_accepted',
                'title' => 'Driver Accepted',
                'message' => "Your ride #{$ride->ride_number} has been accepted. Driver is on the way.",
                'priority' => 'high',
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Ride accepted successfully',
                'ride' => $ride->load(['rider', 'driver'])
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Accept Ride Error: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Failed to accept ride'], 500);
        }
    }

    // ✅ Reject ride (Driver)
    public function rejectRide(Request $request, $id)
    {
        try {
            $user = $request->user();

            if (!$user || $user->role !== 'driver') {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
            }

            DB::beginTransaction();

            // Check if ride is assigned via ride_assignments table
            $assignment = RideAssignment::where('ride_id', $id)
                                       ->where('driver_id', $user->id)
                                       ->where('status', 'assigned')
                                       ->first();

            if ($assignment) {
                // Update assignment status to rejected
                $assignment->update([
                    'status' => 'rejected',
                    'responded_at' => now(),
                ]);

                $ride = Ride::findOrFail($id);

                // Check if all assignments are rejected, then set ride back to pending
                $activeAssignments = RideAssignment::where('ride_id', $id)
                                                  ->where('status', 'assigned')
                                                  ->count();

                if ($activeAssignments === 0) {
                    $ride->update([
                        'status' => 'pending',
                        'driver_id' => null,
                    ]);
                }
            } else {
                // Legacy check - direct assignment
                $ride = Ride::where('id', $id)
                           ->where('driver_id', $user->id)
                           ->where('status', 'assigned')
                           ->firstOrFail();

                $ride->update([
                    'status' => 'pending',
                    'driver_id' => null,
                ]);
            }

            // Notify admins about rejection
            $admins = User::where('role', 'admin')->get();
            foreach ($admins as $admin) {
                Notification::create([
                    'user_id' => $admin->id,
                    'role' => 'admin',
                    'type' => 'ride_rejected',
                    'title' => 'Ride Rejected by Driver',
                    'message' => "Ride #{$ride->ride_number} was rejected by driver. Please reassign.",
                    'priority' => 'high',
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Ride rejected successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Reject Ride Error: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Failed to reject ride'], 500);
        }
    }

    // ✅ Start ride (Driver)
    public function startRide(Request $request, $id)
    {
        try {
            $user = $request->user();

            if (!$user || $user->role !== 'driver') {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
            }

            $ride = Ride::where('id', $id)
                       ->where('driver_id', $user->id)
                       ->whereIn('status', ['accepted', 'arrived'])
                       ->firstOrFail();

            DB::beginTransaction();

            $ride->update([
                'status' => 'started',
                'started_at' => now(),
            ]);

            // Notify rider
            Notification::create([
                'user_id' => $ride->rider_id,
                'role' => 'rider',
                'type' => 'ride_started',
                'title' => 'Ride Started',
                'message' => "Your ride #{$ride->ride_number} has started. Safe journey!",
                'priority' => 'normal',
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Ride started successfully',
                'ride' => $ride
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Start Ride Error: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Failed to start ride'], 500);
        }
    }

    // ✅ Arrived at destination (Driver)
    public function arrived(Request $request, $id)
    {
        try {
            $user = $request->user();

            if (!$user || $user->role !== 'driver') {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
            }

            $ride = Ride::where('id', $id)
                       ->where('driver_id', $user->id)
                       ->where('status', 'accepted')
                       ->firstOrFail();

            DB::beginTransaction();

            $ride->update([
                'status' => 'arrived',
                'arrived_at' => now(),
            ]);

            // Notify rider
            Notification::create([
                'user_id' => $ride->rider_id,
                'role' => 'rider',
                'type' => 'driver_arrived',
                'title' => 'Driver Arrived',
                'message' => "Your driver has arrived at the pickup location for ride #{$ride->ride_number}.",
                'priority' => 'high',
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Arrival confirmed successfully',
                'ride' => $ride->load('rider')
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Arrived Error: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Failed to confirm arrival'], 500);
        }
    }

    // ✅ Payment received (Driver)
    public function paymentReceived(Request $request, $id)
{
    try {
        $user = $request->user();

        if (!$user || $user->role !== 'driver') {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'distance' => 'required|numeric|min:0',
            'duration' => 'nullable|numeric|min:0',
            'total_fare' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $ride = Ride::where('id', $id)
                   ->where('driver_id', $user->id)
                   ->whereIn('status', ['arrived', 'started'])
                   ->firstOrFail();

        DB::beginTransaction();

        // Calculate commission (20% for platform)
        $commission = $request->total_fare * 0.2;
        $driverEarnings = $request->total_fare - $commission;

        // Update ride
        $ride->update([
            'status' => 'completed',
            'completed_at' => now(),
            'distance' => $request->distance,
            'duration' => $request->duration,
            'total_fare' => $request->total_fare,
            'commission' => $commission,
            'driver_earnings' => $driverEarnings,
            'payment_status' => 'paid',
            'payment_method' => 'cash',
        ]);

        // Update driver stats
        $driver = Driver::where('user_id', $user->id)->first();
        if ($driver) {
            $driver->increment('completed_rides');
            $driver->increment('total_earnings', $driverEarnings);
            $driver->increment('wallet_balance', $driverEarnings);
            $driver->update(['last_ride_at' => now()]);
        }

        // Notify rider
        Notification::create([
            'user_id' => $ride->rider_id,
            'role' => 'rider',
            'type' => 'ride_completed',
            'title' => 'Ride Completed',
            'message' => "Your ride #{$ride->ride_number} has been completed. Total fare: ৳{$request->total_fare}. Thank you for riding with us!",
            'priority' => 'high',
        ]);

        // Notify admins
        $admins = User::where('role', 'admin')->get();
        foreach ($admins as $admin) {
            Notification::create([
                'user_id' => $admin->id,
                'role' => 'admin',
                'type' => 'ride_completed',
                'title' => 'Ride Completed',
                'message' => "Ride #{$ride->ride_number} completed. Driver earnings: ৳{$driverEarnings}. Payment received.",
                'priority' => 'normal',
            ]);
        }

        DB::commit();

        return response()->json([
            'success' => true,
            'message' => 'Payment received and ride completed successfully',
            'ride' => $ride->load('rider')
        ]);

    } catch (\Exception $e) {
        DB::rollBack();
        Log::error('Payment Received Error: ' . $e->getMessage());
        return response()->json(['success' => false, 'message' => 'Failed to process payment'], 500);
    }
}


    // ✅ Complete ride (Driver) - Legacy method, keeping for backward compatibility
    public function completeRide(Request $request, $id)
    {
        try {
            $user = $request->user();

            if (!$user || $user->role !== 'driver') {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
            }

            $validator = Validator::make($request->all(), [
                'distance' => 'required|numeric|min:0',
                'duration' => 'nullable|numeric|min:0',
                'total_fare' => 'required|numeric|min:0',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $ride = Ride::where('id', $id)
                       ->where('driver_id', $user->id)
                       ->where('status', 'started')
                       ->firstOrFail();

            DB::beginTransaction();

            // Calculate earnings (total_fare - commission)
            $commission = $request->total_fare * 0.2; // 20% commission
            $driverEarnings = $request->total_fare - $commission;

            $ride->update([
                'status' => 'completed',
                'completed_at' => now(),
                'distance' => $request->distance,
                'duration' => $request->duration,
                'total_fare' => $request->total_fare,
                'commission' => $commission,
                'driver_earnings' => $driverEarnings,
            ]);

            // Notify rider
            Notification::create([
                'user_id' => $ride->rider_id,
                'role' => 'rider',
                'type' => 'ride_completed',
                'title' => 'Ride Completed',
                'message' => "Your ride #{$ride->ride_number} has been completed. Total fare: $${$request->total_fare}. Please rate your experience.",
                'priority' => 'high',
            ]);

            // Notify admins
            $admins = User::where('role', 'admin')->get();
            foreach ($admins as $admin) {
                Notification::create([
                    'user_id' => $admin->id,
                    'role' => 'admin',
                    'type' => 'ride_completed',
                    'title' => 'Ride Completed',
                    'message' => "Ride #{$ride->ride_number} completed. Driver earnings: $${driverEarnings}.",
                    'priority' => 'normal',
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Ride completed successfully',
                'ride' => $ride
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Complete Ride Error: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Failed to complete ride'], 500);
        }
    }
}

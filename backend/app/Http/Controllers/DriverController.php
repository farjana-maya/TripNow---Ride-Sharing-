<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Models\User;
use App\Models\Driver;
use App\Models\Notification;
use App\Mail\DriverApprovalNotification;
use Illuminate\Validation\ValidationException;

class DriverController extends Controller
{
    // ✅ Get Driver Info
    public function getDriverInfo(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user || $user->role !== 'driver') {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
            }

            $driver = Driver::where('user_id', $user->id)->first();

            return response()->json([
                'success' => true,
                'has_submitted' => $driver ? true : false,
                'driver' => $driver
            ]);
        } catch (\Exception $e) {
            Log::error('Get Driver Info Error: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Server error'], 500);
        }
    }

    // ✅ Submit Driver Info
    public function submitDriverInfo(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user || $user->role !== 'driver') {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
            }

           $validated = $request->validate([
                'license_number'  => 'required|string|max:50',
                'license_expiry'  => 'required|date|after:today',
                'vehicle_type'    => 'required|string|in:standard,premium,suv,bike',
                'vehicle_model'   => 'required|string|max:100',
                'vehicle_number'  => 'required|string|max:20',
                'vehicle_color'   => 'required|string|max:50',
                'vehicle_year'    => 'required|integer|min:2010|max:' . (date('Y') + 1),
                'nid_number'      => 'required|string|max:50',
                'address'         => 'nullable|string|max:255',
                'city'            => 'nullable|string|max:100',
                'state'           => 'nullable|string|max:100',
                'postal_code'     => 'nullable|string|max:20',

                // নতুনগুলো:
                'nid_copy'              => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
                'license_paper'         => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
                'vehicle_documents'     => 'required|array|min:1',
                'vehicle_documents.*'   => 'file|mimes:jpg,jpeg,png,pdf|max:5120',
                ]);


            // Handle file uploads
            if ($request->hasFile('nid_copy')) {
                $validated['nid_copy_path'] = $request->file('nid_copy')->store('drivers/nid', 'public');
            }
            if ($request->hasFile('license_paper')) {
                $validated['license_copy_path'] = $request->file('license_paper')->store('drivers/license', 'public');
            }
            if ($request->hasFile('vehicle_documents')) {
                $vehicleDocs = [];
                foreach ($request->file('vehicle_documents') as $file) {
                    $vehicleDocs[] = $file->store('drivers/vehicle', 'public');
                }
                $validated['vehicle_documents'] = $vehicleDocs;
            }

            DB::beginTransaction();

            $driver = Driver::updateOrCreate(
                ['user_id' => $user->id],
                array_merge($validated, [
                    'status' => 'pending',
                    'rejection_reason' => null,
                ])
            );

            Notification::create([
                'user_id' => $user->id,
                'role' => 'driver',
                'type' => 'driver_submission',
                'title' => 'Application Submitted',
                'message' => 'Your driver application has been submitted successfully! Our admin team will review within 24-48 hours.',
                'priority' => 'high',
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Driver information submitted successfully!',
                'driver' => $driver
            ], 201);

        } catch (ValidationException $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => 'Validation failed', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Driver Submission Error: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Server error: ' . $e->getMessage()], 500);
        }
    }

    // ✅ Approve Driver (Admin)
    public function approveDriver(Request $request, $id)
    {
        try {
            $driver = Driver::findOrFail($id);

            if ($driver->status === 'approved') {
                return response()->json(['success' => false, 'message' => 'Driver already approved'], 400);
            }

            $driver->update([
                'status' => 'approved',
                'approved_at' => now(),
                'approved_by' => $request->user()->id,
                'rejection_reason' => null
            ]);

            Notification::create([
                'user_id' => $driver->user_id,
                'role' => 'driver',
                'type' => 'approval',
                'title' => 'Application Approved! 🎉',
                'message' => 'Congratulations! Your driver application has been approved. You can now start accepting rides.',
                'priority' => 'high',
            ]);

            // Send email notification
            try {
                $user = User::find($driver->user_id);
                if ($user && $user->email) {
                    Mail::to($user->email)->send(new DriverApprovalNotification($driver, $user));
                }
            } catch (\Exception $e) {
                Log::error('Failed to send approval email: ' . $e->getMessage());
                // Don't fail the approval if email fails
            }

            return response()->json(['success' => true, 'message' => 'Driver approved successfully']);
        } catch (\Exception $e) {
            Log::error('Approve Driver Error: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Failed to approve driver'], 500);
        }
    }

    // ✅ Reject Driver (Admin)
    public function rejectDriver(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'rejection_reason' => 'required|string|max:500',
            ]);

            $driver = Driver::findOrFail($id);

            $driver->update([
                'status' => 'rejected',
                'rejected_at' => now(),
                'rejected_by' => $request->user()->id,
                'rejection_reason' => $validated['rejection_reason']
            ]);

            Notification::create([
                'user_id' => $driver->user_id,
                'role' => 'driver',
                'type' => 'rejection',
                'title' => 'Application Rejected',
                'message' => 'Your driver application has been rejected. Reason: ' . $validated['rejection_reason'],
                'priority' => 'high',
            ]);

            return response()->json(['success' => true, 'message' => 'Driver rejected successfully']);
        } catch (\Exception $e) {
            Log::error('Reject Driver Error: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Failed to reject driver'], 500);
        }
    }

    // ✅ Toggle Block/Unblock
    public function toggleBlockDriver(Request $request, $id)
    {
        try {
            $driver = Driver::findOrFail($id);
            $driver->is_blocked = !$driver->is_blocked;
            $driver->blocked_at = $driver->is_blocked ? now() : null;
            $driver->blocked_by = $driver->is_blocked ? $request->user()->id : null;
            $driver->save();

            return response()->json([
                'success' => true,
                'message' => $driver->is_blocked ? 'Driver blocked' : 'Driver unblocked'
            ]);
        } catch (\Exception $e) {
            Log::error('Toggle Block Driver Error: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Failed to update driver status'], 500);
        }
    }

    // Add this method to DriverController.php

public function getDriverStats(Request $request)
{
    try {
        $user = $request->user();

        if (!$user || $user->role !== 'driver') {
            return response()->json(['success' => false, 'message' => 'Unauthorized - Not a driver'], 403);
        }

        $driver = Driver::where('user_id', $user->id)->first();

        if (!$driver) {
            return response()->json([
                'success' => true,
                'stats' => [
                    'total_rides' => 0,
                    'total_earnings' => 0,
                    'today_rides' => 0,
                    'today_earnings' => 0,
                    'rating' => 0,
                    'wallet_balance' => 0,
                ]
            ]);
        }

        // Calculate today's rides and earnings
        $todayRides = \App\Models\Ride::where('driver_id', $user->id)
            ->where('status', 'completed')
            ->whereDate('completed_at', today())
            ->count();

        $todayEarnings = \App\Models\Ride::where('driver_id', $user->id)
            ->where('status', 'completed')
            ->whereDate('completed_at', today())
            ->sum('driver_earnings');

        // Get all-time completed rides count
        $totalCompletedRides = \App\Models\Ride::where('driver_id', $user->id)
            ->where('status', 'completed')
            ->count();

        // Get all-time earnings
        $totalEarnings = \App\Models\Ride::where('driver_id', $user->id)
            ->where('status', 'completed')
            ->sum('driver_earnings');

        // Update driver record with latest stats
        $driver->update([
            'completed_rides' => $totalCompletedRides,
            'total_earnings' => $totalEarnings,
        ]);

        $stats = [
            'total_rides' => $totalCompletedRides,
            'total_earnings' => $totalEarnings ?? 0,
            'today_rides' => $todayRides,
            'today_earnings' => $todayEarnings ?? 0,
            'rating' => $driver->rating ?? 0,
            'wallet_balance' => $driver->wallet_balance ?? 0,
        ];

        return response()->json(['success' => true, 'stats' => $stats]);
    } catch (\Exception $e) {
        Log::error('Get Driver Stats Error: ' . $e->getMessage());
        return response()->json(['success' => false, 'message' => 'Failed to get stats'], 500);
    }
}
    public function toggleAvailability(Request $request)
    {
        try {
            $driver = Driver::where('user_id', $request->user()->id)->first();

            if (!$driver) {
                return response()->json(['success' => false, 'message' => 'Driver not found'], 404);
            }

            $driver->is_available = !$driver->is_available;
            $driver->status = $driver->is_available ? 'online' : 'offline';
            $driver->last_online_at = now();
            $driver->save();

            return response()->json([
                'success' => true,
                'message' => $driver->is_available ? 'You are now online' : 'You are now offline',
                'is_available' => $driver->is_available
            ]);
        } catch (\Exception $e) {
            Log::error('Toggle Availability Error: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Failed to update status'], 500);
        }
    }

    // ✅ Update Driver Status (Online/Offline)
    public function updateDriverStatus(Request $request)
    {
        try {
            $validated = $request->validate([
                'status' => 'required|string|in:online,offline',
            ]);

            $driver = Driver::where('user_id', $request->user()->id)->first();

            if (!$driver) {
                return response()->json(['success' => false, 'message' => 'Driver not found'], 404);
            }

            $driver->status = $validated['status'];
            $driver->last_online_at = $validated['status'] === 'online' ? now() : $driver->last_online_at;
            $driver->is_available = $validated['status'] === 'online';
            $driver->save();

            return response()->json([
                'success' => true,
                'message' => 'Status updated successfully',
                'status' => $driver->status,
                'is_available' => $driver->is_available
            ]);
        } catch (\Exception $e) {
            Log::error('Update Driver Status Error: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Failed to update status'], 500);
        }
    }

    // ✅ Get All Drivers
    public function getAllDrivers(Request $request)
    {
        try {
            $query = Driver::with('user');

            // Apply filters
            if ($request->has('status') && $request->status) {
                if ($request->status === 'approved') {
                    // Include approved, offline, and online drivers in approved tab
                    $query->whereIn('status', ['approved', 'offline', 'online']);
                } else {
                    $query->where('status', $request->status);
                }
            }

            if ($request->has('vehicle_type') && $request->vehicle_type) {
                // Map frontend vehicle types to backend types if needed
                $vehicleType = $request->vehicle_type;
                if ($vehicleType === 'standard') {
                    $query->where('vehicle_type', 'standard');
                } elseif ($vehicleType === 'premium') {
                    $query->where('vehicle_type', 'premium');
                } else {
                    $query->where('vehicle_type', $vehicleType);
                }
            }

            if ($request->has('is_available') && $request->is_available !== '') {
                $query->where('is_available', $request->boolean('is_available'));
            }

            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->whereHas('user', function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhere('phone', 'like', "%{$search}%");
                })->orWhere('vehicle_number', 'like', "%{$search}%")
                  ->orWhere('license_number', 'like', "%{$search}%");
            }

            $perPage = $request->get('per_page', 15);
            $drivers = $query->orderBy('created_at', 'desc')->paginate($perPage);

            // Calculate stats
            $stats = [
                'total' => Driver::count(),
                'pending' => Driver::where('status', 'pending')->count(),
                'approved' => Driver::whereIn('status', ['approved', 'offline', 'online'])->count(),
                'rejected' => Driver::where('status', 'rejected')->count(),
                'online' => Driver::where('status', 'online')->count(),
            ];

            return response()->json([
                'success' => true,
                'data' => $drivers,
                'stats' => $stats
            ]);
        } catch (\Exception $e) {
            Log::error('Get All Drivers Error: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Failed to get drivers'], 500);
        }
    }

    // ✅ Get Pending Drivers
    public function getPendingDrivers()
    {
        try {
            $drivers = Driver::with('user')->where('status', 'pending')->get();
            return response()->json(['success' => true, 'drivers' => $drivers]);
        } catch (\Exception $e) {
            Log::error('Get Pending Drivers Error: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Failed to get pending drivers'], 500);
        }
    }
}

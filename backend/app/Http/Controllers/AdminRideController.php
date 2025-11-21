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
use Carbon\Carbon;

class AdminRideController extends Controller
{
    // ===================================
    // EXISTING METHODS (From your file)
    // ===================================

    /**
     * Get all rides (Admin) - Original Method
     */
    public function getAllRides(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user || $user->role !== 'admin') {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
            }

            $status = $request->query('status');
            $page = $request->query('page', 1);
            $perPage = $request->query('per_page', 20);

            $query = Ride::with(['rider', 'driver']);

            if ($status) {
                $query->where('status', $status);
            }

            $rides = $query->orderBy('created_at', 'desc')
                          ->paginate($perPage, ['*'], 'page', $page);

            return response()->json([
                'success' => true,
                'rides' => $rides
            ]);

        } catch (\Exception $e) {
            Log::error('Get All Rides Error: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Failed to get rides'], 500);
        }
    }

    /**
     * Get pending rides (Admin) - Original Method
     */
    public function getPendingRides(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user || $user->role !== 'admin') {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
            }

            $rides = Ride::with(['rider'])
                        ->where('status', 'pending')
                        ->orderBy('created_at', 'desc')
                        ->get();

            return response()->json([
                'success' => true,
                'rides' => $rides
            ]);

        } catch (\Exception $e) {
            Log::error('Get Pending Rides Error: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Failed to get pending rides'], 500);
        }
    }

    /**
     * Assign driver to ride (Admin) - Original Method
     */
    public function assignDriver(Request $request, $id)
    {
        try {
            $user = $request->user();

            if (!$user || $user->role !== 'admin') {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
            }

            $validator = Validator::make($request->all(), [
                'driver_id' => 'required|exists:users,id',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $ride = Ride::findOrFail($id);

            if ($ride->status !== 'pending') {
                return response()->json(['success' => false, 'message' => 'Ride is not in pending status'], 400);
            }

            // Check if driver is available
            $driver = Driver::where('user_id', $request->driver_id)
                           ->where('status', 'online')
                           ->first();

            if (!$driver) {
                return response()->json(['success' => false, 'message' => 'Driver is not available'], 400);
            }

            DB::beginTransaction();

            $ride->update([
                'driver_id' => $request->driver_id,
                'status' => 'assigned',
            ]);

            // Notify driver
            Notification::create([
                'user_id' => $request->driver_id,
                'role' => 'driver',
                'type' => 'ride_assigned',
                'title' => 'New Ride Assigned',
                'message' => "You have been assigned to ride #{$ride->ride_number}. Please accept or reject within 5 minutes.",
                'priority' => 'high',
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Driver assigned successfully',
                'ride' => $ride->load(['rider', 'driver'])
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Assign Driver Error: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Failed to assign driver'], 500);
        }
    }

    /**
     * Get ride statistics (Admin) - Original Method
     */
    public function getRideStats(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user || $user->role !== 'admin') {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
            }

            $stats = [
                'total_rides' => Ride::count(),
                'pending_rides' => Ride::where('status', 'pending')->count(),
                'ongoing_rides' => Ride::whereIn('status', ['assigned', 'accepted', 'arrived', 'started'])->count(),
                'completed_rides' => Ride::where('status', 'completed')->count(),
                'cancelled_rides' => Ride::where('status', 'cancelled')->count(),
                'total_revenue' => Ride::where('status', 'completed')->sum('total_fare'),
                'today_rides' => Ride::whereDate('created_at', today())->count(),
                'today_revenue' => Ride::where('status', 'completed')->whereDate('completed_at', today())->sum('total_fare'),
            ];

            return response()->json([
                'success' => true,
                'stats' => $stats
            ]);

        } catch (\Exception $e) {
            Log::error('Get Ride Stats Error: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Failed to get stats'], 500);
        }
    }

    /**
     * Clear all active rides (Admin) - Original Method
     */
    public function clearActiveRides(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user || $user->role !== 'admin') {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
            }

            DB::beginTransaction();

            $activeRides = Ride::whereIn('status', ['pending', 'assigned', 'accepted', 'arrived', 'started'])->get();
            $count = $activeRides->count();

            foreach ($activeRides as $ride) {
                $ride->update([
                    'status' => 'cancelled',
                    'cancelled_at' => now(),
                    'cancellation_reason' => 'Admin cleared all active rides'
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => "Successfully cleared {$count} active rides",
                'cleared_count' => $count
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Clear Active Rides Error: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Failed to clear active rides'], 500);
        }
    }

    // ===================================
    // NEW ENHANCED METHODS
    // ===================================

    /**
     * Get all rides with ADVANCED filters and pagination
     * Enhanced version with more filter options
     */
    public function index(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user || $user->role !== 'admin') {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
            }

            $perPage = $request->input('per_page', 20);
            $page = $request->input('page', 1);
            $search = $request->input('search', '');
            $status = $request->input('status', '');
            $paymentStatus = $request->input('payment_status', '');
            $vehicleType = $request->input('vehicle_type', '');
            $dateFrom = $request->input('date_from', '');
            $dateTo = $request->input('date_to', '');
            $sortBy = $request->input('sort_by', 'created_at');
            $sortOrder = $request->input('sort_order', 'desc');

            $query = Ride::with(['rider', 'driver']);

            // Search functionality
            if ($search) {
                $query->where(function($q) use ($search) {
                    $q->where('ride_number', 'like', "%{$search}%")
                      ->orWhereHas('rider', function($q) use ($search) {
                          $q->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%")
                            ->orWhere('phone', 'like', "%{$search}%");
                      })
                      ->orWhereHas('driver', function($q) use ($search) {
                          $q->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                      });
                });
            }

            // Status filter
            if ($status) {
                $query->where('status', $status);
            }

            // Payment status filter
            if ($paymentStatus) {
                $query->where('payment_status', $paymentStatus);
            }

            // Vehicle type filter
            if ($vehicleType) {
                $query->where('vehicle_type', $vehicleType);
            }

            // Date range filter
            if ($dateFrom) {
                $query->whereDate('created_at', '>=', $dateFrom);
            }
            if ($dateTo) {
                $query->whereDate('created_at', '<=', $dateTo);
            }

            // Sorting
            $query->orderBy($sortBy, $sortOrder);

            $rides = $query->paginate($perPage, ['*'], 'page', $page);

            return response()->json([
                'success' => true,
                'rides' => $rides
            ]);

        } catch (\Exception $e) {
            Log::error('Get All Rides Error: ' . $e->getMessage());
            return response()->json([
                'success' => false, 
                'message' => 'Failed to fetch rides'
            ], 500);
        }
    }

    /**
     * Get ongoing rides (assigned, accepted, arrived, started)
     */
    public function ongoing(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user || $user->role !== 'admin') {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
            }

            $rides = Ride::with(['rider', 'driver'])
                        ->whereIn('status', ['assigned', 'accepted', 'arrived', 'started'])
                        ->orderBy('created_at', 'desc')
                        ->get();

            return response()->json([
                'success' => true,
                'rides' => $rides,
                'count' => $rides->count()
            ]);

        } catch (\Exception $e) {
            Log::error('Get Ongoing Rides Error: ' . $e->getMessage());
            return response()->json([
                'success' => false, 
                'message' => 'Failed to fetch ongoing rides'
            ], 500);
        }
    }

    /**
     * Get completed rides with analytics
     */
    public function completed(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user || $user->role !== 'admin') {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
            }

            $perPage = $request->input('per_page', 20);
            $dateFrom = $request->input('date_from', '');
            $dateTo = $request->input('date_to', '');

            $query = Ride::with(['rider', 'driver'])
                        ->where('status', 'completed');

            if ($dateFrom) {
                $query->whereDate('completed_at', '>=', $dateFrom);
            }
            if ($dateTo) {
                $query->whereDate('completed_at', '<=', $dateTo);
            }

            $rides = $query->orderBy('completed_at', 'desc')
                          ->paginate($perPage);

            // Analytics
            $analytics = [
                'total_completed' => Ride::where('status', 'completed')->count(),
                'total_revenue' => Ride::where('status', 'completed')->sum('total_fare'),
                'total_commission' => Ride::where('status', 'completed')->sum('commission'),
                'driver_earnings' => Ride::where('status', 'completed')->sum('driver_earnings'),
                'avg_fare' => Ride::where('status', 'completed')->avg('total_fare'),
                'today_completed' => Ride::where('status', 'completed')
                    ->whereDate('completed_at', today())->count(),
                'this_month_completed' => Ride::where('status', 'completed')
                    ->whereMonth('completed_at', now()->month)->count(),
            ];

            return response()->json([
                'success' => true,
                'rides' => $rides,
                'analytics' => $analytics
            ]);

        } catch (\Exception $e) {
            Log::error('Get Completed Rides Error: ' . $e->getMessage());
            return response()->json([
                'success' => false, 
                'message' => 'Failed to fetch completed rides'
            ], 500);
        }
    }

    /**
     * Get cancelled rides with reasons
     */
    public function cancelled(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user || $user->role !== 'admin') {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
            }

            $perPage = $request->input('per_page', 20);
            $dateFrom = $request->input('date_from', '');
            $dateTo = $request->input('date_to', '');
            $cancelledBy = $request->input('cancelled_by', '');

            $query = Ride::with(['rider', 'driver'])
                        ->where('status', 'cancelled');

            if ($dateFrom) {
                $query->whereDate('cancelled_at', '>=', $dateFrom);
            }
            if ($dateTo) {
                $query->whereDate('cancelled_at', '<=', $dateTo);
            }
            if ($cancelledBy) {
                $query->where('cancelled_by', $cancelledBy);
            }

            $rides = $query->orderBy('cancelled_at', 'desc')
                          ->paginate($perPage);

            // Cancellation analytics
            $analytics = [
                'total_cancelled' => Ride::where('status', 'cancelled')->count(),
                'cancelled_by_rider' => Ride::where('status', 'cancelled')
                    ->where('cancelled_by', 'rider')->count(),
                'cancelled_by_driver' => Ride::where('status', 'cancelled')
                    ->where('cancelled_by', 'driver')->count(),
                'cancelled_by_admin' => Ride::where('status', 'cancelled')
                    ->where('cancelled_by', 'admin')->count(),
                'top_reasons' => Ride::where('status', 'cancelled')
                    ->whereNotNull('cancellation_reason')
                    ->select('cancellation_reason', DB::raw('count(*) as count'))
                    ->groupBy('cancellation_reason')
                    ->orderBy('count', 'desc')
                    ->limit(5)
                    ->get(),
            ];

            return response()->json([
                'success' => true,
                'rides' => $rides,
                'analytics' => $analytics
            ]);

        } catch (\Exception $e) {
            Log::error('Get Cancelled Rides Error: ' . $e->getMessage());
            return response()->json([
                'success' => false, 
                'message' => 'Failed to fetch cancelled rides'
            ], 500);
        }
    }

    /**
     * Get single ride details
     */
    public function show(Request $request, $id)
    {
        try {
            $user = $request->user();

            if (!$user || $user->role !== 'admin') {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
            }

            $ride = Ride::with([
                'rider', 
                'driver', 
                'payment', 
                'ratings',
                'review'
            ])->findOrFail($id);

            return response()->json([
                'success' => true,
                'ride' => $ride
            ]);

        } catch (\Exception $e) {
            Log::error('Get Ride Details Error: ' . $e->getMessage());
            return response()->json([
                'success' => false, 
                'message' => 'Ride not found'
            ], 404);
        }
    }

    /**
     * Export rides to CSV
     */
    public function export(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user || $user->role !== 'admin') {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
            }

            $status = $request->input('status', '');
            $dateFrom = $request->input('date_from', '');
            $dateTo = $request->input('date_to', '');

            $query = Ride::with(['rider', 'driver']);

            if ($status) {
                $query->where('status', $status);
            }
            if ($dateFrom) {
                $query->whereDate('created_at', '>=', $dateFrom);
            }
            if ($dateTo) {
                $query->whereDate('created_at', '<=', $dateTo);
            }

            $rides = $query->orderBy('created_at', 'desc')->get();

            // Create CSV data
            $csvData = [];
            $csvData[] = [
                'Ride Number',
                'Rider Name',
                'Rider Email',
                'Driver Name',
                'Driver Email',
                'Pickup Location',
                'Drop Location',
                'Vehicle Type',
                'Status',
                'Distance (km)',
                'Duration (min)',
                'Total Fare',
                'Commission',
                'Driver Earnings',
                'Payment Method',
                'Payment Status',
                'Scheduled At',
                'Completed At',
                'Created At'
            ];

            foreach ($rides as $ride) {
                $csvData[] = [
                    $ride->ride_number,
                    $ride->rider->name ?? 'N/A',
                    $ride->rider->email ?? 'N/A',
                    $ride->driver->name ?? 'Not Assigned',
                    $ride->driver->email ?? 'N/A',
                    $ride->pickup_location,
                    $ride->drop_location,
                    ucfirst($ride->vehicle_type),
                    ucfirst($ride->status),
                    $ride->distance ?? 'N/A',
                    $ride->duration ?? 'N/A',
                    $ride->total_fare,
                    $ride->commission,
                    $ride->driver_earnings,
                    $ride->payment_method ?? 'N/A',
                    $ride->payment_status,
                    $ride->scheduled_at,
                    $ride->completed_at ?? 'N/A',
                    $ride->created_at
                ];
            }

            return response()->json([
                'success' => true,
                'data' => $csvData,
                'filename' => 'rides_export_' . now()->format('Y-m-d_His') . '.csv'
            ]);

        } catch (\Exception $e) {
            Log::error('Export Rides Error: ' . $e->getMessage());
            return response()->json([
                'success' => false, 
                'message' => 'Failed to export rides'
            ], 500);
        }
    }

    /**
     * Get comprehensive ride statistics for dashboard
     */
    public function statistics(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user || $user->role !== 'admin') {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
            }

            $stats = [
                'total_rides' => Ride::count(),
                'pending_rides' => Ride::where('status', 'pending')->count(),
                'ongoing_rides' => Ride::whereIn('status', ['assigned', 'accepted', 'arrived', 'started'])->count(),
                'completed_rides' => Ride::where('status', 'completed')->count(),
                'cancelled_rides' => Ride::where('status', 'cancelled')->count(),
                
                'total_revenue' => Ride::where('status', 'completed')->sum('total_fare'),
                'total_commission' => Ride::where('status', 'completed')->sum('commission'),
                'total_driver_earnings' => Ride::where('status', 'completed')->sum('driver_earnings'),
                
                'today_rides' => Ride::whereDate('created_at', today())->count(),
                'today_revenue' => Ride::where('status', 'completed')
                    ->whereDate('completed_at', today())->sum('total_fare'),
                'today_completed' => Ride::where('status', 'completed')
                    ->whereDate('completed_at', today())->count(),
                
                'this_week_rides' => Ride::whereBetween('created_at', [
                    now()->startOfWeek(), now()->endOfWeek()
                ])->count(),
                
                'this_month_rides' => Ride::whereMonth('created_at', now()->month)->count(),
                'this_month_revenue' => Ride::where('status', 'completed')
                    ->whereMonth('completed_at', now()->month)->sum('total_fare'),
                
                'avg_fare' => round(Ride::where('status', 'completed')->avg('total_fare'), 2),
                'avg_distance' => round(Ride::where('status', 'completed')->avg('distance'), 2),
                'avg_duration' => round(Ride::where('status', 'completed')->avg('duration'), 2),
                
                'vehicle_type_distribution' => Ride::select('vehicle_type', DB::raw('count(*) as count'))
                    ->groupBy('vehicle_type')
                    ->get(),
                
                'payment_method_distribution' => Ride::where('status', 'completed')
                    ->select('payment_method', DB::raw('count(*) as count'))
                    ->groupBy('payment_method')
                    ->get(),
                
                'hourly_distribution' => Ride::select(
                        DB::raw('HOUR(created_at) as hour'),
                        DB::raw('count(*) as count')
                    )
                    ->whereDate('created_at', today())
                    ->groupBy('hour')
                    ->orderBy('hour')
                    ->get(),
            ];

            return response()->json([
                'success' => true,
                'stats' => $stats
            ]);

        } catch (\Exception $e) {
            Log::error('Get Ride Statistics Error: ' . $e->getMessage());
            return response()->json([
                'success' => false, 
                'message' => 'Failed to fetch statistics'
            ], 500);
        }
    }

    /**
     * Update ride status (Admin intervention)
     */
    public function updateStatus(Request $request, $id)
    {
        try {
            $user = $request->user();

            if (!$user || $user->role !== 'admin') {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
            }

            $request->validate([
                'status' => 'required|in:pending,assigned,accepted,arrived,started,completed,cancelled',
                'reason' => 'required_if:status,cancelled'
            ]);

            $ride = Ride::findOrFail($id);

            $updateData = ['status' => $request->status];

            if ($request->status === 'cancelled') {
                $updateData['cancelled_at'] = now();
                $updateData['cancelled_by'] = 'admin';
                $updateData['cancellation_reason'] = $request->reason;
            }

            $ride->update($updateData);

            return response()->json([
                'success' => true,
                'message' => 'Ride status updated successfully',
                'ride' => $ride->load(['rider', 'driver'])
            ]);

        } catch (\Exception $e) {
            Log::error('Update Ride Status Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update ride status'
            ], 500);
        }
    }

    /**
     * Bulk update ride status (Admin intervention)
     */
    public function bulkUpdateStatus(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user || $user->role !== 'admin') {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
            }

            $request->validate([
                'ride_ids' => 'required|array|min:1',
                'ride_ids.*' => 'required|integer|exists:rides,id',
                'status' => 'required|in:completed,cancelled',
                'reason' => 'required_if:status,cancelled'
            ]);

            DB::beginTransaction();

            $updateData = ['status' => $request->status];

            if ($request->status === 'cancelled') {
                $updateData['cancelled_at'] = now();
                $updateData['cancelled_by'] = 'admin';
                $updateData['cancellation_reason'] = $request->reason;
            }

            $updatedCount = Ride::whereIn('id', $request->ride_ids)
                               ->update($updateData);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => "Successfully updated {$updatedCount} rides",
                'updated_count' => $updatedCount
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Bulk Update Ride Status Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to bulk update ride status'
            ], 500);
        }
    }
}
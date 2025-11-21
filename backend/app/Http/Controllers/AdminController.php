<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Driver;
use App\Models\Ride;
use App\Models\Payment;
use App\Models\Rating;
use App\Models\Notification;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    /**
     * Get enhanced admin dashboard with real-time data
     */
    public function dashboard(Request $request)
    {
        try {
            $today = Carbon::today();
            $yesterday = Carbon::yesterday();
            
            // Get comprehensive statistics
            $statistics = [
                'total_users' => User::where('role', 'user')->count(),
                'total_drivers' => Driver::count(),
                'total_rides' => Ride::count(),
                'ongoing_rides' => Ride::whereIn('status', ['accepted', 'arrived', 'started'])->count(),
                'completed_rides' => Ride::where('status', 'completed')->count(),
                'cancelled_rides' => Ride::where('status', 'cancelled')->count(),
                'total_revenue' => Ride::where('status', 'completed')->sum('total_fare'),
                'total_commission' => Ride::where('status', 'completed')->sum('commission'),
                
                // Today's stats
                'today_rides' => Ride::whereDate('created_at', $today)->count(),
                'today_revenue' => Ride::where('status', 'completed')
                    ->whereDate('completed_at', $today)
                    ->sum('total_fare'),
                'today_new_users' => User::whereDate('created_at', $today)->count(),
                'today_new_drivers' => Driver::whereDate('created_at', $today)->count(),
                
                // Yesterday's stats for comparison
                'yesterday_rides' => Ride::whereDate('created_at', $yesterday)->count(),
                'yesterday_revenue' => Ride::where('status', 'completed')
                    ->whereDate('completed_at', $yesterday)
                    ->sum('total_fare'),
                
                // Driver stats
                'pending_driver_approvals' => Driver::where('status', 'pending')->count(),
                'online_drivers' => Driver::where('status', 'online')->count(),
                'offline_drivers' => Driver::where('status', 'offline')->count(),
                'blocked_drivers' => Driver::where('is_blocked', true)->count(),
                
                // Payment stats
                'total_payments' => Payment::where('status', 'success')->sum('amount'),
                'pending_payments' => Payment::where('status', 'pending')->sum('amount'),
                'failed_payments' => Payment::where('status', 'failed')->count(),
                
                // User stats
                'active_users' => User::where('is_active', true)->count(),
                'blocked_users' => User::where('is_active', false)->count(),
                
                // Rating stats
                'average_rating' => round(Rating::avg('rating'), 2),
                'total_ratings' => Rating::count(),
                '5_star_ratings' => Rating::where('rating', 5)->count(),
            ];

            // Calculate trends (percentage change from yesterday)
            $statistics['rides_trend'] = $this->calculateTrend(
                $statistics['today_rides'], 
                $statistics['yesterday_rides']
            );
            $statistics['revenue_trend'] = $this->calculateTrend(
                $statistics['today_revenue'], 
                $statistics['yesterday_revenue']
            );

            // Get recent users (last 10)
            $recentUsers = User::orderBy('created_at', 'desc')
                ->take(10)
                ->get(['id', 'name', 'email', 'role', 'phone', 'is_active', 'created_at']);

            // Get recent rides with relationships
            // Note: In rides table, driver_id references users.id directly
            $recentRides = Ride::with([
                'rider:id,name,email',
                'driver:id,name,email'
            ])
                ->orderBy('created_at', 'desc')
                ->take(10)
                ->get();

            // Get top drivers by rating and rides
            $topDrivers = Driver::with('user:id,name,email,phone')
                ->where('status', 'approved')
                ->where('total_rides', '>', 0)
                ->orderBy('rating', 'desc')
                ->orderBy('total_rides', 'desc')
                ->take(5)
                ->get();

            // Revenue chart data (last 7 days)
            $revenueChart = [];
            for ($i = 6; $i >= 0; $i--) {
                $date = now()->subDays($i);
                $revenue = Ride::where('status', 'completed')
                    ->whereDate('completed_at', $date)
                    ->sum('total_fare');
                $revenueChart[] = [
                    'date' => $date->format('Y-m-d'),
                    'day' => $date->format('D'),
                    'revenue' => (float) $revenue,
                ];
            }

            // Rides chart data (last 7 days)
            $ridesChart = [];
            for ($i = 6; $i >= 0; $i--) {
                $date = now()->subDays($i);
                $rides = Ride::whereDate('created_at', $date)->count();
                $completed = Ride::where('status', 'completed')
                    ->whereDate('completed_at', $date)
                    ->count();
                $cancelled = Ride::where('status', 'cancelled')
                    ->whereDate('updated_at', $date)
                    ->count();
                
                $ridesChart[] = [
                    'date' => $date->format('Y-m-d'),
                    'day' => $date->format('D'),
                    'rides' => $rides,
                    'completed' => $completed,
                    'cancelled' => $cancelled,
                ];
            }

            // Hourly rides distribution for today
            $hourlyRides = Ride::whereDate('created_at', $today)
                ->select(DB::raw('HOUR(created_at) as hour'), DB::raw('COUNT(*) as count'))
                ->groupBy('hour')
                ->orderBy('hour')
                ->get();

            // Payment method breakdown
            $paymentMethods = Payment::where('status', 'success')
                ->select('payment_method', DB::raw('COUNT(*) as count'), DB::raw('SUM(amount) as total'))
                ->groupBy('payment_method')
                ->get();

            // Ride status breakdown
            $rideStatusBreakdown = Ride::select('status', DB::raw('COUNT(*) as count'))
                ->groupBy('status')
                ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'statistics' => $statistics,
                    'recent_users' => $recentUsers,
                    'recent_rides' => $recentRides,
                    'top_drivers' => $topDrivers,
                    'revenue_chart' => $revenueChart,
                    'rides_chart' => $ridesChart,
                    'hourly_rides' => $hourlyRides,
                    'payment_methods' => $paymentMethods,
                    'ride_status_breakdown' => $rideStatusBreakdown,
                ],
                'timestamp' => now()->toIso8601String(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load dashboard: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Clear all active rides (for testing/cleanup)
     */
    public function clearActiveRides(Request $request)
    {
        try {
            $activeStatuses = ['pending', 'accepted', 'arrived', 'started'];
            
            $clearedCount = Ride::whereIn('status', $activeStatuses)
                ->update([
                    'status' => 'cancelled',
                    'cancellation_reason' => 'Admin cleared all active rides',
                    'cancelled_at' => now()
                ]);

            return response()->json([
                'success' => true,
                'message' => 'Successfully cleared active rides',
                'cleared_count' => $clearedCount
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to clear active rides: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get real-time notifications
     */
    public function getNotifications(Request $request)
    {
        try {
            $notifications = Notification::where(function($query) use ($request) {
                $query->where('user_id', $request->user()->id)
                      ->orWhere('role', 'admin');
            })
                ->orderBy('created_at', 'desc')
                ->take(50)
                ->get();

            $unreadCount = Notification::where(function($query) use ($request) {
                $query->where('user_id', $request->user()->id)
                      ->orWhere('role', 'admin');
            })
                ->where('is_read', false)
                ->count();

            return response()->json([
                'success' => true,
                'data' => [
                    'notifications' => $notifications,
                    'unread_count' => $unreadCount,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch notifications: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Mark notification as read
     */
    public function markNotificationRead(Request $request, $id)
    {
        try {
            $notification = Notification::findOrFail($id);
            $notification->update(['is_read' => true, 'read_at' => now()]);

            return response()->json([
                'success' => true,
                'message' => 'Notification marked as read',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update notification',
            ], 500);
        }
    }

    /**
     * Mark all notifications as read
     */
    public function markAllNotificationsRead(Request $request)
    {
        try {
            Notification::where(function($query) use ($request) {
                $query->where('user_id', $request->user()->id)
                      ->orWhere('role', 'admin');
            })
                ->where('is_read', false)
                ->update(['is_read' => true, 'read_at' => now()]);

            return response()->json([
                'success' => true,
                'message' => 'All notifications marked as read',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update notifications',
            ], 500);
        }
    }

    /**
     * Helper function to calculate percentage trend
     */
    private function calculateTrend($current, $previous)
    {
        if ($previous == 0) {
            return $current > 0 ? 100 : 0;
        }
        return round((($current - $previous) / $previous) * 100, 1);
    }
}
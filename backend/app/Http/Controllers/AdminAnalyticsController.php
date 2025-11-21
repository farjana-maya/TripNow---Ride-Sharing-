<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Ride;
use App\Models\User;
use App\Models\Driver;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AdminAnalyticsController extends Controller
{
    public function getOverview(Request $request)
    {
        $period = $request->get('period', 'week');
        
        $startDate = match($period) {
            'week' => Carbon::now()->subDays(7),
            'month' => Carbon::now()->subDays(30),
            'year' => Carbon::now()->subYear(),
            default => Carbon::now()->subDays(7)
        };
        
        $endDate = Carbon::now();
        
        // Current period stats
        $totalRevenue = Ride::where('status', 'completed')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->sum('total_fare') ?? 0;
            
        $totalRides = Ride::whereBetween('created_at', [$startDate, $endDate])->count();
        
        $activeUsers = User::where('role', 'user')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->count();
            
        $avgRideValue = $totalRides > 0 ? round($totalRevenue / $totalRides, 2) : 0;
        
        // Previous period for growth calculation
        $prevStartDate = match($period) {
            'week' => Carbon::now()->subDays(14),
            'month' => Carbon::now()->subDays(60),
            'year' => Carbon::now()->subYears(2),
            default => Carbon::now()->subDays(14)
        };
        
        $prevRevenue = Ride::where('status', 'completed')
            ->whereBetween('created_at', [$prevStartDate, $startDate])
            ->sum('total_fare') ?? 0;
            
        $prevRides = Ride::whereBetween('created_at', [$prevStartDate, $startDate])->count();
        
        // Growth calculations
        $revenueGrowth = $prevRevenue > 0 ? round((($totalRevenue - $prevRevenue) / $prevRevenue) * 100, 1) : 0;
        $ridesGrowth = $prevRides > 0 ? round((($totalRides - $prevRides) / $prevRides) * 100, 1) : 0;
        
        // Ride status distribution
        $completedRides = Ride::where('status', 'completed')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->count();
            
        $cancelledRides = Ride::where('status', 'cancelled')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->count();
            
        $activeRides = Ride::whereIn('status', ['pending', 'assigned', 'accepted', 'arrived', 'started'])
            ->count();
        
        // Vehicle type distribution
        $vehicleStats = Ride::whereBetween('created_at', [$startDate, $endDate])
            ->select('vehicle_type', DB::raw('count(*) as count'))
            ->groupBy('vehicle_type')
            ->get()
            ->pluck('count', 'vehicle_type');
            
        // Payment method distribution (assuming cash for now)
        $totalPayments = Ride::where('status', 'completed')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->count();
        
        // Performance metrics
        $avgRating = 4.5; // Placeholder
        $acceptanceRate = 85; // Placeholder
        $cancellationRate = $totalRides > 0 ? round(($cancelledRides / $totalRides) * 100, 1) : 0;
        
        // Financial breakdown
        $commission = Ride::where('status', 'completed')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->sum('commission') ?? 0;
            
        $driverEarnings = Ride::where('status', 'completed')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->sum('driver_earnings') ?? 0;
            
        $profitMargin = $totalRevenue > 0 ? round(($commission / $totalRevenue) * 100, 1) : 0;
        
        // Hourly ride distribution
        $hourlyRides = [];
        for ($hour = 0; $hour < 24; $hour++) {
            $hourlyRides[$hour] = Ride::whereBetween('created_at', [$startDate, $endDate])
                ->whereRaw('HOUR(created_at) = ?', [$hour])
                ->count();
        }
        
        return response()->json([
            'totalRevenue' => round($totalRevenue, 2),
            'totalRides' => $totalRides,
            'activeUsers' => $activeUsers,
            'avgRideValue' => $avgRideValue,
            'revenueGrowth' => $revenueGrowth,
            'ridesGrowth' => $ridesGrowth,
            'usersGrowth' => 12.5, // Placeholder
            'avgValueGrowth' => 8.3, // Placeholder
            'completedRides' => $completedRides,
            'cancelledRides' => $cancelledRides,
            'activeRides' => $activeRides,
            'standardRides' => $vehicleStats['standard'] ?? 0,
            'premiumRides' => $vehicleStats['premium'] ?? 0,
            'economyRides' => $vehicleStats['economy'] ?? 0,
            'cashPayments' => $totalPayments,
            'cardPayments' => 0,
            'digitalPayments' => 0,
            'avgWaitTime' => 5, // Placeholder
            'acceptanceRate' => $acceptanceRate,
            'avgRating' => $avgRating,
            'cancellationRate' => $cancellationRate,
            'commission' => round($commission, 2),
            'driverEarnings' => round($driverEarnings, 2),
            'profitMargin' => $profitMargin,
            'hourlyRides' => $hourlyRides
        ]);
    }
    
    public function getRideStats(Request $request)
    {
        $period = $request->get('period', 'week');
        
        $startDate = match($period) {
            'week' => Carbon::now()->subDays(7),
            'month' => Carbon::now()->subDays(30),
            'year' => Carbon::now()->subYear(),
            default => Carbon::now()->subDays(7)
        };
        
        $data = [];
        
        if ($period === 'week') {
            for ($i = 6; $i >= 0; $i--) {
                $date = Carbon::now()->subDays($i);
                $rides = Ride::whereDate('created_at', $date)->count();
                $data[] = [
                    'date' => $date->format('M d'),
                    'rides' => $rides,
                    'completed' => Ride::whereDate('created_at', $date)->where('status', 'completed')->count(),
                    'cancelled' => Ride::whereDate('created_at', $date)->where('status', 'cancelled')->count()
                ];
            }
        } elseif ($period === 'month') {
            for ($i = 29; $i >= 0; $i--) {
                $date = Carbon::now()->subDays($i);
                $rides = Ride::whereDate('created_at', $date)->count();
                $data[] = [
                    'date' => $date->format('M d'),
                    'rides' => $rides,
                    'completed' => Ride::whereDate('created_at', $date)->where('status', 'completed')->count(),
                    'cancelled' => Ride::whereDate('created_at', $date)->where('status', 'cancelled')->count()
                ];
            }
        } else {
            for ($i = 11; $i >= 0; $i--) {
                $date = Carbon::now()->subMonths($i)->startOfMonth();
                $endDate = Carbon::now()->subMonths($i)->endOfMonth();
                $rides = Ride::whereBetween('created_at', [$date, $endDate])->count();
                $data[] = [
                    'date' => $date->format('M Y'),
                    'rides' => $rides,
                    'completed' => Ride::whereBetween('created_at', [$date, $endDate])->where('status', 'completed')->count(),
                    'cancelled' => Ride::whereBetween('created_at', [$date, $endDate])->where('status', 'cancelled')->count()
                ];
            }
        }
        
        return response()->json($data);
    }
    
    public function getDriverVehicleTypes(Request $request)
    {
        try {
            $vehicleTypes = Driver::select('vehicle_type', DB::raw('COUNT(*) as count'))
                ->whereNotNull('vehicle_type')
                ->groupBy('vehicle_type')
                ->get();
            
            $result = [
                'standard' => 0,
                'premium' => 0,
                'suv' => 0,
                'bike' => 0
            ];
            
            foreach ($vehicleTypes as $type) {
                $vehicleType = strtolower($type->vehicle_type);
                if (isset($result[$vehicleType])) {
                    $result[$vehicleType] = $type->count;
                }
            }
            
            return response()->json($result);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    
    public function getPeakHours(Request $request)
    {
        try {
            $hourlyData = [];
            
            for ($hour = 0; $hour < 24; $hour++) {
                $rides = Ride::whereRaw('HOUR(created_at) = ?', [$hour])
                    ->whereDate('created_at', '>=', now()->subDays(7))
                    ->select('vehicle_type', DB::raw('COUNT(*) as count'))
                    ->groupBy('vehicle_type')
                    ->get();
                
                $hourData = [
                    'hour' => $hour,
                    'standard' => 0,
                    'premium' => 0,
                    'suv' => 0,
                    'bike' => 0,
                    'total' => 0
                ];
                
                foreach ($rides as $ride) {
                    $vehicleType = strtolower($ride->vehicle_type);
                    if (isset($hourData[$vehicleType])) {
                        $hourData[$vehicleType] = $ride->count;
                    }
                    $hourData['total'] += $ride->count;
                }
                
                $hourlyData[] = $hourData;
            }
            
            return response()->json($hourlyData);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
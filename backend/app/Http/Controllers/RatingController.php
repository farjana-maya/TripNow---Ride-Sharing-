<?php

// FILE: app/Http/Controllers/RatingController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Rating;
use App\Models\Driver;

class RatingController extends Controller
{
    // Get all ratings
    public function index(Request $request)
    {
        try {
            $perPage = $request->input('per_page', 20);
            $ratedBy = $request->input('rated_by', '');
            $isFlagged = $request->input('is_flagged', '');

            $query = Rating::with(['ride', 'rider', 'driver']);

            // Filter by rated_by
            if ($ratedBy) {
                $query->where('rated_by', $ratedBy);
            }

            // Filter by flagged
            if ($isFlagged !== '') {
                $query->where('is_flagged', $isFlagged);
            }

            $ratings = $query->orderBy('created_at', 'desc')->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $ratings,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch ratings: ' . $e->getMessage(),
            ], 500);
        }
    }

    // Get single rating
    public function show($id)
    {
        try {
            $rating = Rating::with(['ride', 'rider', 'driver'])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $rating,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Rating not found',
            ], 404);
        }
    }

    // Create rating
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'ride_id' => 'required|exists:rides,id',
                'rider_id' => 'required|exists:users,id',
                'driver_id' => 'required|exists:users,id',
                'rated_by' => 'required|in:rider,driver',
                'rating' => 'required|integer|min:1|max:5',
                'review' => 'nullable|string',
                'feedback_tags' => 'nullable|string',
            ]);

            $rating = Rating::create($validated);

            // Update driver's average rating
            if ($validated['rated_by'] === 'rider') {
                $this->updateDriverRating($validated['driver_id']);
            }

            return response()->json([
                'success' => true,
                'message' => 'Rating submitted successfully',
                'data' => $rating,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to submit rating: ' . $e->getMessage(),
            ], 500);
        }
    }

    // Update rating
    public function update(Request $request, $id)
    {
        try {
            $rating = Rating::findOrFail($id);

            $validated = $request->validate([
                'rating' => 'sometimes|required|integer|min:1|max:5',
                'review' => 'nullable|string',
                'feedback_tags' => 'nullable|string',
            ]);

            $rating->update($validated);

            // Update driver's average rating if rating value changed
            if (isset($validated['rating']) && $rating->rated_by === 'rider') {
                $this->updateDriverRating($rating->driver_id);
            }

            return response()->json([
                'success' => true,
                'message' => 'Rating updated successfully',
                'data' => $rating,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update rating: ' . $e->getMessage(),
            ], 500);
        }
    }

    // Flag/unflag rating
    public function toggleFlag(Request $request, $id)
    {
        try {
            $rating = Rating::findOrFail($id);

            $validated = $request->validate([
                'flag_reason' => 'required_if:is_flagged,true|nullable|string',
            ]);

            $isFlagged = !$rating->is_flagged;

            $rating->update([
                'is_flagged' => $isFlagged,
                'flag_reason' => $isFlagged ? $validated['flag_reason'] : null,
            ]);

            return response()->json([
                'success' => true,
                'message' => $isFlagged ? 'Rating flagged' : 'Rating unflagged',
                'data' => $rating,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to toggle flag: ' . $e->getMessage(),
            ], 500);
        }
    }

    // Delete rating
    public function destroy($id)
    {
        try {
            $rating = Rating::findOrFail($id);
            $driverId = $rating->driver_id;
            $ratedBy = $rating->rated_by;
            
            $rating->delete();

            // Recalculate driver rating if it was a rider rating
            if ($ratedBy === 'rider') {
                $this->updateDriverRating($driverId);
            }

            return response()->json([
                'success' => true,
                'message' => 'Rating deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete rating: ' . $e->getMessage(),
            ], 500);
        }
    }

    // Get rating statistics
    public function statistics()
    {
        try {
            $stats = [
                'total_ratings' => Rating::count(),
                'average_rating' => round(Rating::avg('rating'), 2),
                'flagged_ratings' => Rating::where('is_flagged', true)->count(),
                'ratings_by_riders' => Rating::where('rated_by', 'rider')->count(),
                'ratings_by_drivers' => Rating::where('rated_by', 'driver')->count(),
                'rating_distribution' => Rating::selectRaw('rating, COUNT(*) as count')
                    ->groupBy('rating')
                    ->orderBy('rating', 'desc')
                    ->get(),
                'recent_ratings' => Rating::with(['rider', 'driver', 'ride'])
                    ->orderBy('created_at', 'desc')
                    ->limit(10)
                    ->get(),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch statistics: ' . $e->getMessage(),
            ], 500);
        }
    }

    // Get ratings for a specific driver
    public function driverRatings($driverId)
    {
        try {
            $ratings = Rating::with(['rider', 'ride'])
                ->where('driver_id', $driverId)
                ->where('rated_by', 'rider')
                ->orderBy('created_at', 'desc')
                ->paginate(20);

            $averageRating = Rating::where('driver_id', $driverId)
                ->where('rated_by', 'rider')
                ->avg('rating');

            return response()->json([
                'success' => true,
                'data' => [
                    'ratings' => $ratings,
                    'average_rating' => round($averageRating, 2),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch driver ratings: ' . $e->getMessage(),
            ], 500);
        }
    }

    // Get ratings for a specific rider
    public function riderRatings($riderId)
    {
        try {
            $ratings = Rating::with(['driver', 'ride'])
                ->where('rider_id', $riderId)
                ->where('rated_by', 'driver')
                ->orderBy('created_at', 'desc')
                ->paginate(20);

            $averageRating = Rating::where('rider_id', $riderId)
                ->where('rated_by', 'driver')
                ->avg('rating');

            return response()->json([
                'success' => true,
                'data' => [
                    'ratings' => $ratings,
                    'average_rating' => round($averageRating, 2),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch rider ratings: ' . $e->getMessage(),
            ], 500);
        }
    }

    // Helper function to update driver's average rating
    private function updateDriverRating($driverId)
    {
        try {
            $driver = Driver::whereHas('user', function($q) use ($driverId) {
                $q->where('id', $driverId);
            })->first();

            if ($driver) {
                $avgRating = Rating::where('driver_id', $driverId)
                    ->where('rated_by', 'rider')
                    ->avg('rating');

                $totalRatings = Rating::where('driver_id', $driverId)
                    ->where('rated_by', 'rider')
                    ->count();

                $driver->update([
                    'rating' => $avgRating ? round($avgRating, 2) : 0,
                    'total_ratings' => $totalRatings,
                ]);
            }
        } catch (\Exception $e) {
            // Log error but don't throw exception to avoid breaking the main operation
            \Log::error('Failed to update driver rating: ' . $e->getMessage());
        }
    }
}
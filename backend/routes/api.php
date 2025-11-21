<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\DriverController;
use App\Http\Controllers\RideController;
use App\Http\Controllers\AdminRideController;
use App\Http\Controllers\AdminRiderController;
use App\Http\Controllers\AdminFinanceController;
use App\Http\Controllers\AdminAnalyticsController;
use App\Http\Controllers\DriverRideController;
use App\Http\Controllers\DebugController;

// ========== PUBLIC ROUTES ==========
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Debug route (remove in production)
Route::get('/debug/assignments', [DebugController::class, 'testRideAssignments']);

// ========== AUTHENTICATED ROUTES ==========
Route::middleware('auth:sanctum')->group(function () {

    // Common Auth Routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);

    // ========== ADMIN ROUTES ==========
    Route::middleware('role:admin')->prefix('admin')->group(function () {

        // Dashboard
        Route::get('/dashboard', [AdminController::class, 'dashboard']);
        Route::get('/dashboard/export', [AdminController::class, 'exportDashboardData']);

        // Live Tracking
        Route::get('/live-rides', [AdminController::class, 'liveRides']);

        // Notifications
        Route::get('/notifications', [AdminController::class, 'getNotifications']);
        Route::post('/notifications/{id}/read', [AdminController::class, 'markNotificationRead']);
        Route::post('/notifications/read-all', [AdminController::class, 'markAllNotificationsRead']);

        // Analytics
        Route::get('/analytics/peak-hours', [AdminController::class, 'getPeakHoursAnalysis']);
        Route::get('/analytics/areas', [AdminController::class, 'getAreaStatistics']);

        // User Management
        Route::prefix('users')->group(function () {
            Route::get('/', [AdminController::class, 'getUsers']);
            Route::get('/{id}', [AdminController::class, 'getUser']);
            Route::put('/{id}', [AdminController::class, 'updateUser']);
            Route::delete('/{id}', [AdminController::class, 'deleteUser']);
            Route::post('/{id}/toggle-status', [AdminController::class, 'toggleUserStatus']);
        });

        // Driver Management (Admin Only)
        Route::prefix('drivers')->group(function () {
            Route::get('/all', [DriverController::class, 'getAllDrivers']);
            Route::get('/pending', [DriverController::class, 'getPendingDrivers']);
            Route::post('/{id}/approve', [DriverController::class, 'approveDriver']);
            Route::post('/{id}/reject', [DriverController::class, 'rejectDriver']);
            Route::post('/{id}/block', [DriverController::class, 'toggleBlockDriver']);
            Route::get('/{id}/stats', [DriverController::class, 'getDriverStats']);
        });

        // Ride Management (Admin Only)
        Route::prefix('rides')->group(function () {
            // Main list endpoint with advanced filters
            Route::get('/', [AdminRideController::class, 'index']); // Enhanced with filters

            // Get rides by status
            Route::get('/ongoing', [AdminRideController::class, 'ongoing']); // Get ongoing rides
            Route::get('/completed', [AdminRideController::class, 'completed']); // Get completed rides with analytics
            Route::get('/cancelled', [AdminRideController::class, 'cancelled']); // Get cancelled rides with reasons

            // Legacy routes for backward compatibility
            Route::get('/pending', [AdminRideController::class, 'getPendingRides']); // Original pending endpoint
            Route::get('/stats', [AdminRideController::class, 'getRideStats']); // Original stats endpoint

            // Statistics and analytics
            Route::get('/statistics', [AdminRideController::class, 'statistics']); // Comprehensive statistics

            // Single ride operations
            Route::get('/{id}', [AdminRideController::class, 'show']); // Get single ride details
            Route::patch('/{id}/status', [AdminRideController::class, 'updateStatus']); // Update ride status
            Route::post('/{id}/assign-driver', [AdminRideController::class, 'assignDriver']); // Assign driver

            // Bulk operations
            Route::post('/clear-active', [AdminRideController::class, 'clearActiveRides']); // Clear all active rides
            Route::post('/bulk-update-status', [AdminRideController::class, 'bulkUpdateStatus']); // Bulk update ride status

            // Export functionality
            Route::get('/export/csv', [AdminRideController::class, 'export']); // Export rides to CSV
        });

        // Rider Management (Admin Only)
        Route::prefix('riders')->group(function () {
            Route::get('/', [AdminRiderController::class, 'getAllRiders']);
            Route::get('/{id}', [AdminRiderController::class, 'getRiderProfile']);
            Route::post('/{id}/block', [AdminRiderController::class, 'blockRider']);
            Route::post('/{id}/unblock', [AdminRiderController::class, 'unblockRider']);
        });

        // Feedback Management
        Route::prefix('feedback')->group(function () {
            Route::get('/', [AdminRiderController::class, 'getRiderFeedback']);
            Route::post('/{id}/respond', [AdminRiderController::class, 'respondToFeedback']);
        });

        // Loyalty Program
        Route::prefix('loyalty')->group(function () {
            Route::get('/stats', [AdminRiderController::class, 'getLoyaltyStats']);
        });

        // Finance Management
        Route::prefix('finance')->group(function () {
            Route::get('/stats', [AdminFinanceController::class, 'getFinancialStats']);
            Route::get('/transactions', [AdminFinanceController::class, 'getTransactions']);
            Route::get('/payment-methods', [AdminFinanceController::class, 'getPaymentMethodStats']);
            Route::get('/revenue-chart', [AdminFinanceController::class, 'getRevenueChart']);
            Route::post('/export-report', [AdminFinanceController::class, 'exportReport']);
        });
        
        // Analytics Management
        Route::prefix('analytics')->group(function () {
            Route::get('/overview', [AdminAnalyticsController::class, 'getOverview']);
            Route::get('/ride-stats', [AdminAnalyticsController::class, 'getRideStats']);
            Route::get('/driver-vehicle-types', [AdminAnalyticsController::class, 'getDriverVehicleTypes']);
            Route::get('/peak-hours', [AdminAnalyticsController::class, 'getPeakHours']);
        });
    });

    // Payment Management Routes (if you have PaymentController)
    Route::prefix('payments')->group(function () {
        Route::get('/', [PaymentController::class, 'index']);
        Route::get('/statistics', [PaymentController::class, 'statistics']);
        Route::get('/{id}', [PaymentController::class, 'show']);
        Route::post('/', [PaymentController::class, 'store']);
        Route::patch('/{id}/status', [PaymentController::class, 'updateStatus']);
        Route::delete('/{id}', [PaymentController::class, 'destroy']);
    });

    // ========== RIDER ROUTES ==========
    Route::prefix('rides')->group(function () {
        Route::post('/book', [RideController::class, 'bookRide']);
        Route::get('/', [RideController::class, 'getUserRides']);
        Route::get('/{id}', [RideController::class, 'getRide']);
        Route::post('/{id}/cancel', [RideController::class, 'cancelRide']);
        Route::post('/{id}/review', [RideController::class, 'addReview']);
        Route::post('/update-location', [RideController::class, 'updateLocation']);
    });

    // ========== DRIVER ROUTES ==========
    Route::middleware('role:driver')->prefix('driver')->group(function () {
        // Driver profile & info (available to ALL drivers)
        Route::post('/submit-info', [DriverController::class, 'submitDriverInfo']);
        Route::get('/info', [DriverController::class, 'getDriverInfo']);
        Route::get('/stats', [DriverController::class, 'getDriverStats']);
        Route::post('/update-status', [DriverController::class, 'updateDriverStatus']);
        Route::post('/toggle-availability', [DriverController::class, 'toggleAvailability']);
        Route::post('/update-location', [DriverController::class, 'updateLocation']);
        Route::get('/earnings', [DriverController::class, 'getDriverEarnings']);
        
        // Allow all drivers to view rides (including assignments)
        Route::get('/rides', [DriverRideController::class, 'getDriverRides']);

        // Driver ride operations (available to approved drivers only)
        Route::middleware('driver.approved')->group(function () {
            Route::post('/rides/{id}/accept', [DriverRideController::class, 'acceptRide']);
            Route::post('/rides/{id}/reject', [DriverRideController::class, 'rejectRide']);
            Route::post('/rides/{id}/arrived', [DriverRideController::class, 'arrived']);
            Route::post('/rides/{id}/payment-received', [DriverRideController::class, 'paymentReceived']);
            Route::post('/rides/{id}/start', [DriverRideController::class, 'startRide']);
            Route::post('/rides/{id}/complete', [DriverRideController::class, 'completeRide']);
        });
    });
});
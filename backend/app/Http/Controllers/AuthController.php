<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use App\Models\User;
use App\Models\Driver;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        try {
            Log::info('Registration attempt', ['data' => $request->except(['password', 'confirmPassword'])]);

            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'username' => 'required|string|max:50|unique:users|regex:/^[a-zA-Z0-9_]+$/',
                'email' => 'required|string|email|max:255|unique:users',
                'phone' => 'nullable|string|max:20|unique:users',
                'password' => 'required|string|min:6',
                'confirmPassword' => 'required|string|same:password',
                'role' => 'required|in:user,driver',
            ], [
                'confirmPassword.same' => 'The passwords do not match.',
                'email.unique' => 'This email is already registered.',
                'phone.unique' => 'This phone number is already registered.',
                'username.unique' => 'This username is already taken.',
                'username.regex' => 'Username can only contain letters, numbers, and underscores.',
            ]);

            // Prevent using 'admin' as username
            if (strtolower($validated['username']) === 'admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'Username "admin" is reserved. Please choose a different username.',
                    'errors' => [
                        'username' => ['Username "admin" is reserved. Please choose a different username.']
                    ]
                ], 422);
            }

            // Create the user
            $user = User::create([
                'name' => $validated['name'],
                'username' => $validated['username'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
                'password' => Hash::make($validated['password']),
                'role' => $validated['role'],
                'is_active' => true,
            ]);

            // Create authentication token
            $token = $user->createToken('auth_token')->plainTextToken;

            Log::info('User registered successfully', ['user_id' => $user->id]);

            return response()->json([
                'success' => true,
                'message' => 'User registered successfully',
                'user' => $user,
                'token' => $token,
                'next_step' => $validated['role'] === 'driver' ? 'complete_driver_form' : null,
            ], 201);
            
        } catch (ValidationException $e) {
            Log::warning('Validation failed', ['errors' => $e->errors()]);
            
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
            
        } catch (\Exception $e) {
            Log::error('Registration failed', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Registration failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function login(Request $request)
    {
        try {
            $validated = $request->validate([
                'username' => 'required|string|max:255',
                'password' => 'required',
            ]);

            // Attempt login with username or email
            $loginField = filter_var($validated['username'], FILTER_VALIDATE_EMAIL) ? 'email' : 'username';

            if (!Auth::attempt([$loginField => $validated['username'], 'password' => $validated['password']])) {
                return response()->json([
                    'success' => false,
                    'message' => 'The provided credentials are incorrect.',
                    'errors' => [
                        'username' => ['The provided credentials are incorrect.']
                    ]
                ], 401);
            }

            $user = Auth::user();

            // Check if account is active
            if (!$user->is_active) {
                Auth::logout();
                return response()->json([
                    'success' => false,
                    'message' => 'Your account has been deactivated. Please contact support.',
                ], 403);
            }

            // Update driver status to online when logging in
            if ($user->role === 'driver') {
                $driver = Driver::where('user_id', $user->id)->first();
                if ($driver && $driver->status === 'approved') {
                    $driver->update(['status' => 'online']);
                }
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            // For drivers, include driver status information
            $driverInfo = null;
            if ($user->role === 'driver') {
                $driverInfo = $this->getDriverStatusInfo($user->id);
            }

            // For admins, include notification count
            $notificationCount = 0;
            if ($user->role === 'admin') {
                $notificationCount = \App\Models\Notification::where('is_read', false)->count();
            }

            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'user' => $user,
                'token' => $token,
                'driver_info' => $driverInfo,
                'notification_count' => $notificationCount,
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);

        } catch (\Exception $e) {
            Log::error('Login failed', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Login failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get driver status information for routing decisions
     */
    private function getDriverStatusInfo($userId)
    {
        $driver = Driver::where('user_id', $userId)->first();

        if (!$driver) {
            return [
                'has_submitted' => false,
                'status' => 'not_submitted',
                'can_access_dashboard' => false,
                'redirect_to' => '/driver-form',
                'message' => 'Please complete your driver profile to continue.'
            ];
        }

        // Check if blocked
        if ($driver->is_blocked) {
            return [
                'has_submitted' => true,
                'status' => 'blocked',
                'can_access_dashboard' => false,
                'redirect_to' => '/driver/blocked',
                'message' => 'Your account has been blocked. ' . ($driver->block_reason ?? ''),
                'block_type' => $driver->block_type,
                'blocked_until' => $driver->block_until,
            ];
        }

        // Check status
        switch ($driver->status) {
            case 'pending':
                return [
                    'has_submitted' => true,
                    'status' => 'pending',
                    'can_access_dashboard' => false,
                    'redirect_to' => '/driver/pending',
                    'message' => 'Your driver application is under review. You will be notified once approved.'
                ];

            case 'rejected':
                return [
                    'has_submitted' => true,
                    'status' => 'rejected',
                    'can_access_dashboard' => false,
                    'redirect_to' => '/driver/rejected',
                    'message' => 'Your driver application was not approved.',
                    'rejection_reason' => $driver->rejection_reason
                ];

            case 'approved':
            case 'online':
            case 'offline':
                return [
                    'has_submitted' => true,
                    'status' => $driver->status,
                    'can_access_dashboard' => true,
                    'redirect_to' => '/driver/dashboard',
                    'message' => 'Welcome back! You can now access your dashboard.'
                ];

            default:
                return [
                    'has_submitted' => true,
                    'status' => 'unknown',
                    'can_access_dashboard' => false,
                    'redirect_to' => '/contact',
                    'message' => 'Unable to determine account status. Please contact support.'
                ];
        }
    }

    public function logout(Request $request)
    {
        try {
            $user = $request->user();

            // Update driver status to offline when logging out
            if ($user->role === 'driver') {
                $driver = Driver::where('user_id', $user->id)->first();
                if ($driver && $driver->status === 'online') {
                    $driver->update(['status' => 'offline']);
                }
            }

            $user->currentAccessToken()->delete();

            return response()->json([
                'success' => true,
                'message' => 'Logged out successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Logout failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function user(Request $request)
    {
        $user = $request->user();
        
        // For drivers, include driver info
        $driverInfo = null;
        if ($user->role === 'driver') {
            $driverInfo = $this->getDriverStatusInfo($user->id);
        }

        return response()->json([
            'success' => true,
            'user' => $user,
            'driver_info' => $driverInfo,
        ]);
    }

    public function updateProfile(Request $request)
    {
        try {
            $user = $request->user();

            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'email' => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
                'phone' => 'sometimes|nullable|string|max:20|unique:users,phone,' . $user->id,
                'address' => 'sometimes|nullable|string|max:500',
                'date_of_birth' => 'sometimes|nullable|date',
                'password' => 'sometimes|string|min:6',
            ]);

            if (isset($validated['password'])) {
                $validated['password'] = Hash::make($validated['password']);
            }

            $user->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully',
                'user' => $user,
            ]);
            
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Update failed: ' . $e->getMessage(),
            ], 500);
        }
    }
}
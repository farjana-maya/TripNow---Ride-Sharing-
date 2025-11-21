<?php
// FILE: app/Http/Controllers/PaymentController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payment;

class PaymentController extends Controller
{
    // Get all payments
    public function index(Request $request)
    {
        try {
            $perPage = $request->input('per_page', 20);
            $search = $request->input('search', '');
            $status = $request->input('status', '');
            $paymentMethod = $request->input('payment_method', '');

            $query = Payment::with(['ride', 'user']);

            // Search
            if ($search) {
                $query->where(function($q) use ($search) {
                    $q->where('transaction_id', 'like', "%{$search}%")
                      ->orWhereHas('user', function($q) use ($search) {
                          $q->where('name', 'like', "%{$search}%");
                      });
                });
            }

            // Status filter
            if ($status) {
                $query->where('status', $status);
            }

            // Payment method filter
            if ($paymentMethod) {
                $query->where('payment_method', $paymentMethod);
            }

            $payments = $query->orderBy('created_at', 'desc')->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $payments,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch payments: ' . $e->getMessage(),
            ], 500);
        }
    }

    // Get single payment
    public function show($id)
    {
        try {
            $payment = Payment::with(['ride', 'user'])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $payment,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Payment not found',
            ], 404);
        }
    }

    // Create payment
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'ride_id' => 'nullable|exists:rides,id',
                'user_id' => 'required|exists:users,id',
                'payment_type' => 'required|in:ride_payment,wallet_topup,driver_payout,refund',
                'amount' => 'required|numeric|min:0',
                'payment_method' => 'required|in:cash,card,wallet,upi,bank_transfer',
                'gateway' => 'nullable|string',
                'description' => 'nullable|string',
            ]);

            $payment = Payment::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Payment created successfully',
                'data' => $payment,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create payment: ' . $e->getMessage(),
            ], 500);
        }
    }

    // Update payment status
    public function updateStatus(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'status' => 'required|in:pending,success,failed,refunded',
                'gateway_transaction_id' => 'nullable|string',
                'gateway_response' => 'nullable|string',
            ]);

            $payment = Payment::findOrFail($id);
            
            $validated['processed_at'] = now();
            $payment->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Payment status updated',
                'data' => $payment,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update payment: ' . $e->getMessage(),
            ], 500);
        }
    }

    // Get payment statistics
    public function statistics()
    {
        try {
            $stats = [
                'total_transactions' => Payment::count(),
                'successful_payments' => Payment::success()->count(),
                'pending_payments' => Payment::pending()->count(),
                'failed_payments' => Payment::failed()->count(),
                'total_revenue' => Payment::success()->sum('amount'),
                'today_revenue' => Payment::success()->whereDate('processed_at', today())->sum('amount'),
                'payment_methods' => Payment::success()
                    ->selectRaw('payment_method, COUNT(*) as count, SUM(amount) as total')
                    ->groupBy('payment_method')
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

    // Delete payment (optional - for admin cleanup)
    public function destroy($id)
    {
        try {
            $payment = Payment::findOrFail($id);
            $payment->delete();

            return response()->json([
                'success' => true,
                'message' => 'Payment deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete payment: ' . $e->getMessage(),
            ], 500);
        }
    }
}
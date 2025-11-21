<?php
namespace App\Http\Middleware;
use Closure;
use Illuminate\Http\Request;
use App\Models\Driver;

class CheckDriverApproved
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();
        if (!$user || $user->role !== 'driver') {
            return response()->json(['success' => false], 403);
        }
        $driver = Driver::where('user_id', $user->id)->first();
        if (!$driver || !in_array($driver->status, ['approved', 'online', 'offline'])) {
            return response()->json(['success' => false], 403);
        }
        return $next($request);
    }
}
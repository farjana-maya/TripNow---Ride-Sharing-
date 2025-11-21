<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class DriverMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if (!$request->user() || !$request->user()->isDriver()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Driver access required.',
            ], 403);
        }

        return $next($request);
    }
}
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureApiAccess
{
    /**
     * Ensure only users and coaches can access the API.
     * Admins should not be able to access API endpoints.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user()) {
            return response()->json([
                'message' => 'Unauthenticated.',
            ], 401);
        }

        // Check if user has API access permission
        if (! $request->user()->hasPermissionTo('access_api')) {
            return response()->json([
                'message' => 'Unauthorized. Only users and coaches can access the API.',
            ], 403);
        }

        return $next($request);
    }
}


<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdminWebAccess
{
    /**
     * Ensure only admin users can access the web dashboard.
     * Admins should not be able to access API, only the web panel.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user()) {
            return redirect()->route('home')->with('error', 'Please login to access the dashboard.');
        }

        // Check if user has admin role
        if (! $request->user()->hasRole('admin')) {
            abort(403, 'Unauthorized. Only administrators can access this area.');
        }

        // Check if user has web access permission
        if (! $request->user()->hasPermissionTo('access_web')) {
            abort(403, 'Unauthorized. You do not have permission to access the web dashboard.');
        }

        return $next($request);
    }
}

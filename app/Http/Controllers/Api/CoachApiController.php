<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Coach;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CoachApiController extends Controller
{
    /**
     * Display a listing of the coaches.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        // Check permission
        if (! $user->can('view_clients')) {
            abort(403, 'You do not have permission to view coaches.');
        }

        // Only coaches can access their own data
        if ($user->hasAnyRole(['coach', 'coach-pro', 'coach-enterprise'])) {
            $coaches = Coach::where('user_id', $user->id)->get();
        } else {
            $coaches = Coach::all();
        }

        return response()->json([
            'coaches' => $coaches,
        ]);
    }

    /**
     * Display the specified coach.
     */
    public function show(Request $request, string $id): JsonResponse
    {
        $user = $request->user();
        $coach = Coach::findOrFail($id);

        // Coaches can only access their own data
        if ($user->isCoach() && $coach->user_id !== $user->id) {
            return response()->json([
                'message' => 'Unauthorized access.',
            ], 403);
        }

        return response()->json([
            'coach' => $coach,
        ]);
    }

    /**
     * Update the coach profile.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $user = $request->user();
        $coach = Coach::findOrFail($id);

        // Check permission
        if (! $user->can('edit_profile')) {
            return response()->json([
                'message' => 'You do not have permission to edit profiles.',
            ], 403);
        }

        // Only the coach owner can update
        if ($coach->user_id !== $user->id) {
            return response()->json([
                'message' => 'Unauthorized access.',
            ], 403);
        }

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'bio' => 'nullable|string',
            'avatar' => 'nullable|string',
            'specialties' => 'nullable|array',
            'badges' => 'nullable|array',
            'language' => 'nullable|string|max:255',
        ]);

        $coach->update($request->only([
            'name',
            'bio',
            'avatar',
            'specialties',
            'badges',
            'language',
        ]));

        return response()->json([
            'message' => 'Coach updated successfully',
            'coach' => $coach,
        ]);
    }
}
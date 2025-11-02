<?php

namespace App\Http\Controllers\Api;

use App\Enums\ApiErrorCode;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\UpdateCoachProfileRequest;
use App\Models\Coach;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CoachApiController extends Controller
{
    use ApiResponse;

    /**
     * Display a listing of the coaches.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        // Check permission
        if (! $user->can('view_clients')) {
            return $this->unauthorizedResponse(
                message: 'You do not have permission to view coaches.',
                errorCode: ApiErrorCode::INSUFFICIENT_PERMISSIONS
            );
        }

        // Only coaches can access their own data
        if ($user->isCoach()) {
            $coaches = Coach::where('user_id', $user->id)->get();
        } else {
            $coaches = Coach::all();
        }

        return $this->successResponse(
            data: $coaches,
            message: 'Coaches retrieved successfully'
        );
    }

    /**
     * Display the specified coach.
     */
    public function show(Request $request, string $id): JsonResponse
    {
        $user = $request->user();
        $coach = Coach::find($id);

        if (! $coach) {
            return $this->notFoundResponse(
                message: 'Coach not found',
                errorCode: ApiErrorCode::COACH_NOT_FOUND
            );
        }

        // Coaches can only access their own data
        if ($user->isCoach() && $coach->user_id !== $user->id) {
            return $this->unauthorizedResponse(
                message: 'You can only view your own profile.',
                errorCode: ApiErrorCode::ACCESS_DENIED
            );
        }

        return $this->successResponse(
            data: $coach,
            message: 'Coach retrieved successfully'
        );
    }

    /**
     * Update the coach profile.
     */
    public function update(UpdateCoachProfileRequest $request, string $id): JsonResponse
    {
        $user = $request->user();
        $coach = Coach::find($id);

        if (! $coach) {
            return $this->notFoundResponse(
                message: 'Coach not found',
                errorCode: ApiErrorCode::COACH_NOT_FOUND
            );
        }

        // Check permission
        if (! $user->can('edit_profile')) {
            return $this->unauthorizedResponse(
                message: 'You do not have permission to edit profiles.',
                errorCode: ApiErrorCode::INSUFFICIENT_PERMISSIONS
            );
        }

        // Only the coach owner can update
        if ($coach->user_id !== $user->id) {
            return $this->unauthorizedResponse(
                message: 'You can only update your own profile.',
                errorCode: ApiErrorCode::ACCESS_DENIED
            );
        }

        $coach->update($request->only([
            'name',
            'email',
            'bio',
            'avatar',
            'specialties',
            'badges',
            'language',
        ]));

        return $this->updatedResponse(
            data: $coach->fresh(),
            message: 'Coach profile updated successfully'
        );
    }
}

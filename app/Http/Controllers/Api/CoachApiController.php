<?php

namespace App\Http\Controllers\Api;

use App\Enums\ApiErrorCode;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\UpdateCoachProfileRequest;
use App\Models\CoachProfile;
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
            $coaches = CoachProfile::where('user_id', $user->id)->with('user:id,name,email')->get();
        } else {
            $coaches = CoachProfile::with('user:id,name,email')->get();
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
        $coachProfile = CoachProfile::with('user:id,name,email')->find($id);

        if (! $coachProfile) {
            return $this->notFoundResponse(
                message: 'Coach profile not found',
                errorCode: ApiErrorCode::COACH_NOT_FOUND
            );
        }

        // Coaches can only access their own data
        if ($user->isCoach() && $coachProfile->user_id !== $user->id) {
            return $this->unauthorizedResponse(
                message: 'You can only view your own profile.',
                errorCode: ApiErrorCode::ACCESS_DENIED
            );
        }

        return $this->successResponse(
            data: $coachProfile,
            message: 'Coach profile retrieved successfully'
        );
    }

    /**
     * Update the coach profile.
     */
    public function update(UpdateCoachProfileRequest $request, string $id): JsonResponse
    {
        $user = $request->user();
        $coachProfile = CoachProfile::find($id);

        if (! $coachProfile) {
            return $this->notFoundResponse(
                message: 'Coach profile not found',
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
        if ($coachProfile->user_id !== $user->id) {
            return $this->unauthorizedResponse(
                message: 'You can only update your own profile.',
                errorCode: ApiErrorCode::ACCESS_DENIED
            );
        }

        $coachProfile->update($request->only([
            'phone',
            'bio',
            'avatar',
            'specialties',
            'certifications',
            'badges',
            'languages',
            'years_of_experience',
            'hourly_rate',
            'timezone',
            'is_available',
            'availability_schedule',
        ]));

        return $this->updatedResponse(
            data: $coachProfile->fresh()->load('user:id,name,email'),
            message: 'Coach profile updated successfully'
        );
    }
}

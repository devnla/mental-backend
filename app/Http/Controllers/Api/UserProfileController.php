<?php

namespace App\Http\Controllers\Api;

use App\Enums\ApiErrorCode;
use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserProfileController extends Controller
{
    use ApiResponse;

    /**
     * Display the authenticated user's profile.
     */
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();

        // Ensure user is a regular user
        if (! $user->isUser()) {
            return $this->unauthorizedResponse(
                message: 'Only regular users can access user profiles.',
                errorCode: ApiErrorCode::ACCESS_DENIED
            );
        }

        $userProfile = $user->userProfile;

        if (! $userProfile) {
            return $this->notFoundResponse(
                message: 'User profile not found. Please create one first.',
                errorCode: ApiErrorCode::RESOURCE_NOT_FOUND
            );
        }

        return $this->successResponse(
            data: $userProfile,
            message: 'User profile retrieved successfully'
        );
    }

    /**
     * Create or update the authenticated user's profile.
     */
    public function upsert(Request $request): JsonResponse
    {
        $user = $request->user();

        // Ensure user is a regular user
        if (! $user->isUser()) {
            return $this->unauthorizedResponse(
                message: 'Only regular users can manage user profiles.',
                errorCode: ApiErrorCode::ACCESS_DENIED
            );
        }

        $validated = $request->validate([
            'phone' => ['nullable', 'string', 'max:50'],
            'date_of_birth' => ['nullable', 'date', 'before:today'],
            'gender' => ['nullable', Rule::in(['male', 'female', 'other', 'prefer_not_to_say'])],
            'avatar' => ['nullable', 'string', 'max:500'],
            'bio' => ['nullable', 'string', 'max:1000'],
            'address' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:100'],
            'state' => ['nullable', 'string', 'max:100'],
            'country' => ['nullable', 'string', 'max:100'],
            'postal_code' => ['nullable', 'string', 'max:20'],
            'preferences' => ['nullable', 'array'],
        ]);

        $userProfile = $user->userProfile()->updateOrCreate(
            ['user_id' => $user->id],
            $validated
        );

        return $this->successResponse(
            data: $userProfile->fresh(),
            message: $userProfile->wasRecentlyCreated
                ? 'User profile created successfully'
                : 'User profile updated successfully'
        );
    }
}

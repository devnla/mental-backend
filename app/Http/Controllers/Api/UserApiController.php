<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\UpdatePasswordRequest;
use App\Http\Requests\API\UpdateProfileRequest;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserApiController extends Controller
{
    use ApiResponse;

    /**
     * Display authenticated user with their profile.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        // Load appropriate profile based on role
        if ($user->isCoach()) {
            $user->load('coachProfile');
            $profile = $user->coachProfile;
        } else {
            $user->load('userProfile');
            $profile = $user->userProfile;
        }

        return $this->successResponse(
            data: [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'email_verified_at' => $user->email_verified_at,
                'roles' => $user->getRoleNames(),
                'permissions' => $user->getAllPermissions()->pluck('name'),
                'profile' => $profile,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
            ],
            message: 'Profile retrieved successfully'
        );
    }

    /**
     * Update authenticated user account details.
     */
    public function update(UpdateProfileRequest $request): JsonResponse
    {
        $user = $request->user();

        $user->update($request->only(['name', 'email']));

        return $this->updatedResponse(
            data: [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'email_verified_at' => $user->email_verified_at,
                'updated_at' => $user->updated_at,
            ],
            message: 'Account updated successfully'
        );
    }

    /**
     * Update user password.
     */
    public function updatePassword(UpdatePasswordRequest $request): JsonResponse
    {
        $user = $request->user();

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        // Revoke all tokens except current
        $user->tokens()->where('id', '!=', $user->currentAccessToken()->id)->delete();

        return $this->updatedResponse(
            message: 'Password updated successfully. All other sessions have been logged out.'
        );
    }
}

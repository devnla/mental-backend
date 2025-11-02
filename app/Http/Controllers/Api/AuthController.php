<?php

namespace App\Http\Controllers\Api;

use App\Enums\ApiErrorCode;
use App\Helpers\DeviceHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\LoginRequest;
use App\Http\Requests\API\RegisterRequest;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    use ApiResponse;

    /**
     * Login user and return token
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = User::where('email', $validated['email'])->first();

        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            return $this->errorResponse(
                message: ApiErrorCode::INVALID_CREDENTIALS->message(),
                errorCode: ApiErrorCode::INVALID_CREDENTIALS
            );
        }

        // Check if user is allowed to access API (coach or user only)
        if (! $user->canAccessApi()) {
            return $this->errorResponse(
                message: ApiErrorCode::ADMIN_API_ACCESS_DENIED->message(),
                errorCode: ApiErrorCode::ADMIN_API_ACCESS_DENIED
            );
        }

        // Get device name from User-Agent
        $deviceName = DeviceHelper::getDeviceName($request);
        $token = $user->createToken($deviceName)->plainTextToken;

        return $this->successResponse(
            data: [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'email_verified_at' => $user->email_verified_at,
                    'roles' => $user->getRoleNames(),
                    'permissions' => $user->getAllPermissions()->pluck('name'),
                ],
                'token' => $token,
            ],
            message: 'Login successful'
        );
    }

    /**
     * Get authenticated user info
     */
    public function user(Request $request): JsonResponse
    {
        $user = $request->user();

        return $this->successResponse(
            data: [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'email_verified_at' => $user->email_verified_at,
                'roles' => $user->getRoleNames(),
                'permissions' => $user->getAllPermissions()->pluck('name'),
                'created_at' => $user->created_at,
            ],
            message: 'User retrieved successfully'
        );
    }

    /**
     * Logout user
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->tokens()->delete();

        return $this->successResponse(
            message: 'Logged out successfully'
        );
    }

    /**
     * Register a new user
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        $user->assignRole('user');

        // Get device name from User-Agent
        $deviceName = DeviceHelper::getDeviceName($request);
        $token = $user->createToken($deviceName)->plainTextToken;

        return $this->createdResponse(
            data: [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'email_verified_at' => $user->email_verified_at,
                    'roles' => $user->getRoleNames(),
                    'permissions' => $user->getAllPermissions()->pluck('name'),
                ],
                'token' => $token,
            ],
            message: 'Registration successful'
        );
    }
}

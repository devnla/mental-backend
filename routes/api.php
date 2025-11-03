<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CoachApiController;
use App\Http\Controllers\Api\UserApiController;
use App\Http\Controllers\Api\UserProfileController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Public routes
    Route::prefix('auth')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);
    });

    // Protected routes - Only users and coaches can access API
    Route::middleware(['auth:sanctum', 'api.access'])->group(function () {
        // Auth routes
        Route::get('/user', [AuthController::class, 'user']);
        Route::post('/logout', [AuthController::class, 'logout']);

        // User account routes (all authenticated users can access)
        Route::prefix('account')->group(function () {
            Route::get('/', [UserApiController::class, 'index']);
            Route::put('/', [UserApiController::class, 'update']);
            Route::put('/password', [UserApiController::class, 'updatePassword']);
        });

        // User profile routes (regular users only)
        Route::prefix('user-profile')->middleware('role:user')->group(function () {
            Route::get('/', [UserProfileController::class, 'show']);
            Route::post('/', [UserProfileController::class, 'upsert']);
            Route::put('/', [UserProfileController::class, 'upsert']);
        });

        // Coach profile routes
        Route::prefix('coach-profile')->group(function () {
            // List coaches (all authenticated users can view)
            Route::get('/', [CoachApiController::class, 'index']);
            Route::get('/{id}', [CoachApiController::class, 'show']);

            // Update coach profile (coaches only)
            Route::put('/{id}', [CoachApiController::class, 'update'])->middleware('role:coach');
        });
    });
});

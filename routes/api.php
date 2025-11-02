<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\CoachApiController;
use App\Http\Controllers\API\UserApiController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Public routes
    Route::prefix('auth')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/register-coach', [AuthController::class, 'registerCoach']);
        Route::post('/login', [AuthController::class, 'login']);
    });

    // Protected routes - Only users and coaches can access API
    Route::middleware(['auth:sanctum', 'api.access'])->group(function () {
        // Auth routes
        Route::get('/user', [AuthController::class, 'user']);
        Route::post('/logout', [AuthController::class, 'logout']);

        // Coach routes (coaches can access these)
        Route::prefix('coaches')->middleware('role:coach')->group(function () {
            Route::get('/', [CoachApiController::class, 'index']);
            Route::get('/{id}', [CoachApiController::class, 'show']);
            Route::put('/{id}', [CoachApiController::class, 'update']);
        });

        // User routes (all authenticated users can access)
        Route::prefix('user')->group(function () {
            Route::get('/profile', [UserApiController::class, 'index']);
            Route::put('/profile', [UserApiController::class, 'update']);
            Route::put('/password', [UserApiController::class, 'updatePassword']);
        });
    });
});

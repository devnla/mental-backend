<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CoachApiController;
use App\Http\Controllers\Api\UserApiController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Public routes
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {
        // Auth routes
        Route::get('/user', [AuthController::class, 'user']);
        Route::post('/logout', [AuthController::class, 'logout']);

        // Coach routes (coaches can access these)
        Route::prefix('coaches')->middleware('role:coach,coach-pro,coach-enterprise,admin')->group(function () {
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

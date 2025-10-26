<?php

use App\Http\Controllers\CoachController;
use App\Http\Controllers\ExportController;
use App\Http\Controllers\UserController;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // User management routes
    Route::resource('users', UserController::class);
    Route::get('users-api', [UserController::class, 'api'])->name('users.api');
    Route::post('users/bulk-delete', [UserController::class, 'bulkDelete'])->name('users.bulk-delete');
    Route::get('users-export', [UserController::class, 'export'])->name('users.export');

    // Coach management routes
    Route::resource('coaches', CoachController::class);

    Route::get('data-export/{type}', [ExportController::class, '__invoke'])->name('data-export');
});

require __DIR__.'/settings.php';

<?php

use App\Http\Controllers\CoachController;
use App\Http\Controllers\ExportController;
use App\Http\Controllers\InviteController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

// Invite link: validate token and redirect to registration with invite info
Route::get('/invite/{token}', function ($token, Request $request) {
    $inv = \App\Models\Invitation::where('token', $token)->first();

    if (! $inv || $inv->isExpired() || $inv->isUsed()) {
        abort(404, 'Invitation invalid or expired.');
    }

    // store into session so Fortify register view can pick it up
    $request->session()->put('invite_email', $inv->email);
    $request->session()->put('invite_token', $token);

    return redirect()->route('register', ['invite_token' => $token, 'invite_email' => $inv->email]);
})->name('invite.show');

Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // User management routes
    Route::resource('users', UserController::class);
    Route::get('users-api', [UserController::class, 'api'])->name('users.api');
    Route::post('users/bulk-delete', [UserController::class, 'bulkDelete'])->name('users.bulk-delete');
    Route::get('users-export', [UserController::class, 'export'])->name('users.export');

    // Coach management routes
    Route::get('coaches', [CoachController::class, 'index'])->name('coaches.index');
    Route::get('coaches/{id}', [CoachController::class, 'show'])->name('coaches.show');
    Route::post('coaches', [CoachController::class, 'store'])->name('coaches.store');
    Route::post('coaches/{coach}', [CoachController::class, 'update'])->name('coaches.update');
    Route::delete('coaches/{coach}', [CoachController::class, 'destroy'])->name('coaches.destroy');

    Route::get('data-export/{type}', [ExportController::class, '__invoke'])->name('data-export');

    // Admin can create invites
    Route::post('invites', [InviteController::class, 'store'])->name('invites.store');
    Route::get('invites/create', [InviteController::class, 'create'])->name('invites.create');
});

require __DIR__.'/settings.php';

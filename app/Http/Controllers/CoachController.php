<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCoachRequest;
use App\Http\Requests\UpdateCoachRequest;
use App\Models\Coach;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class CoachController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('coaches/index', [
            'coaches' => Coach::where('user_id', auth()->user()->id)
                ->latest()
                ->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCoachRequest $request): RedirectResponse
    {
        $user = auth()->user();

        // Get latest coach number
        $latestCoach = $user->coaches()
            ->orderBy('coach_number', 'desc')
            ->first();
        $number = $latestCoach ? (int) explode('-', $latestCoach->coach_number)[1] : 0;
        $formattedNumber = 'CH-'.str_pad($number + 1, 5, '0', STR_PAD_LEFT);

        $coach = $user->coaches()->create($request->merge([
            'coach_number' => $formattedNumber,
        ])->all());

        if ($request->hasFile('avatar')) {
            $coach->avatar = $request->file('avatar')->store('avatars', 'public');
            $coach->save();
        }

        return to_route('coaches.index')->with('success', 'Coach created successfully.')
            ->with('description', $formattedNumber.' has been created.')
            ->with('timestamp', now()->timestamp);
    }

    /**
     * Display the specified resource.
     */
    public function show(Coach $coach): Response
    {
        return Inertia::render('coaches/index', [
            'coaches' => Coach::where('user_id', auth()->user()->id)
                ->latest()
                ->get(),
            'show' => $coach->coach_number,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCoachRequest $request, Coach $coach): RedirectResponse
    {
        $validated = $request->validated();
        unset($validated['avatar']);
        unset($validated['remove_avatar']);
        $coach->fill($validated);

        if ($request->hasFile('avatar') && $request->file('avatar') !== null) {
            // Delete the old avatar if it exists
            if ($coach->avatar) {
                Storage::disk('public')->delete($coach->avatar);
            }

            $coach->avatar = $request->file('avatar')->store('avatars', 'public');
        }

        if ($request->boolean('remove_avatar')) {
            if ($coach->avatar) {
                Storage::disk('public')->delete($coach->avatar);
            }
            $coach->avatar = null;
        }

        $coach->save();

        return to_route('coaches.index')->with('success', 'Coach updated successfully.')
            ->with('description', $coach->coach_number.' has been updated.')
            ->with('timestamp', now()->timestamp);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Coach $coach): RedirectResponse
    {
        if ($coach->avatar) {
            Storage::disk('public')->delete($coach->avatar);
        }

        $coach->delete();

        return to_route('coaches.index')->with('success', 'Coach deleted successfully.')
            ->with('description', $coach->coach_number.' has been deleted.')
            ->with('timestamp', now()->timestamp);
    }
}


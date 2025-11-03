<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCoachRequest;
use App\Http\Requests\UpdateCoachRequest;
use App\Models\CoachProfile;
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
            'coaches' => CoachProfile::with('user')
                ->latest()
                ->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCoachRequest $request): RedirectResponse
    {
        // Get latest coach number
        $latestCoach = CoachProfile::orderBy('coach_number', 'desc')->first();
        $number = $latestCoach ? (int) explode('-', $latestCoach->coach_number)[1] : 0;
        $formattedNumber = 'COACH-'.str_pad($number + 1, 5, '0', STR_PAD_LEFT);

        $coach = CoachProfile::create($request->merge([
            'coach_number' => $formattedNumber,
        ])->all());

        if ($request->hasFile('avatar')) {
            $coach->avatar = $request->file('avatar')->store('avatars', 'public');
            $coach->save();
        }

        return to_route('coaches.index')->with('success', 'Coach profile created successfully.')
            ->with('description', $formattedNumber.' has been created.')
            ->with('timestamp', now()->timestamp);
    }

    /**
     * Display the specified resource.
     */
    public function show(CoachProfile $coachProfile): Response
    {
        return Inertia::render('coaches/index', [
            'coaches' => CoachProfile::with('user')
                ->latest()
                ->get(),
            'show' => $coachProfile->coach_number,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCoachRequest $request, CoachProfile $coachProfile): RedirectResponse
    {
        $validated = $request->validated();
        unset($validated['avatar']);
        unset($validated['remove_avatar']);
        $coachProfile->fill($validated);

        if ($request->hasFile('avatar') && $request->file('avatar') !== null) {
            // Delete the old avatar if it exists
            if ($coachProfile->avatar) {
                Storage::disk('public')->delete($coachProfile->avatar);
            }

            $coachProfile->avatar = $request->file('avatar')->store('avatars', 'public');
        }

        if ($request->boolean('remove_avatar')) {
            if ($coachProfile->avatar) {
                Storage::disk('public')->delete($coachProfile->avatar);
            }
            $coachProfile->avatar = null;
        }

        $coachProfile->save();

        return to_route('coaches.index')->with('success', 'Coach profile updated successfully.')
            ->with('description', $coachProfile->coach_number.' has been updated.')
            ->with('timestamp', now()->timestamp);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CoachProfile $coachProfile): RedirectResponse
    {
        if ($coachProfile->avatar) {
            Storage::disk('public')->delete($coachProfile->avatar);
        }

        $coachProfile->delete();

        return to_route('coaches.index')->with('success', 'Coach profile deleted successfully.')
            ->with('description', $coachProfile->coach_number.' has been deleted.')
            ->with('timestamp', now()->timestamp);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Invitation;
use App\Mail\InviteMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class InviteController extends Controller
{
    /**
     * Store a new invitation and send email.
     */
    public function store(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email', 'max:255'],
            'days' => ['nullable', 'integer', 'min:1', 'max:365'],
        ]);

        $email = $request->input('email');
        $days = $request->input('days', 7);

        $inv = Invitation::generateFor($email, $days);

        Mail::to($email)->send(new InviteMail($inv));

        // If this was an API / JSON request, return JSON instead of redirect/back
        if ($request->wantsJson() || $request->expectsJson()) {
            return response()->json([
                'message' => 'Invitation created',
                'invitation' => [
                    'email' => $inv->email,
                    'token' => $inv->token,
                    'expires_at' => $inv->expires_at,
                ],
            ], 201);
        }

        return back()->with('success', 'Invitation sent to ' . $email . '. Open Mailpit to view it.');
    }

    /**
     * Show the invite creation form for admins.
     */
    public function create(Request $request)
    {
        return Inertia::render('admin/invites/create', [
            'status' => $request->session()->get('success'),
        ]);
    }
}

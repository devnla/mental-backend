<?php

namespace App\Actions\Fortify;

use App\Models\User;
use App\Models\Invitation;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique(User::class),
            ],
            'password' => $this->passwordRules(),
            'invite_token' => ['required', 'string'],
        ])->after(function ($validator) use ($input) {
            $inv = Invitation::where('token', $input['invite_token'] ?? null)->first();

            if (! $inv || ($inv->email !== ($input['email'] ?? null))) {
                $validator->errors()->add('invite_token', 'Invalid invitation token for this email.');
                return;
            }

            if ($inv->isExpired() || $inv->isUsed()) {
                $validator->errors()->add('invite_token', 'Invitation expired or already used.');
            }
        })->validate();

        // at this point validation passed and invitation exists
        $user = User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'password' => Hash::make($input['password']),
        ]);

        // assign default role
        $user->assignRole('user');

        // mark invitation used
        $inv = Invitation::where('token', $input['invite_token'])->first();
        if ($inv) {
            $inv->markUsedBy($user->id);
        }

        return $user;
    }
}

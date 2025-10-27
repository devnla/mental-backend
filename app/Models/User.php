<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable, HasApiTokens, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    /**
     * Get the coaches for the user.
     */
    public function coaches(): HasMany
    {
        return $this->hasMany(Coach::class);
    }

    /**
     * Check if the user is an admin (using Spatie roles).
     */
    public function isAdmin(): bool
    {
        return $this->hasRole('admin');
    }

    /**
     * Check if the user is a coach (using Spatie roles).
     */
    public function isCoach(): bool
    {
        return $this->hasAnyRole(['coach', 'coach-pro', 'coach-enterprise']);
    }

    /**
     * Check if the user is a regular user (using Spatie roles).
     */
    public function isUser(): bool
    {
        return $this->hasAnyRole(['user', 'user-premium']);
    }

    /**
     * Check if the user can access the web dashboard (admin only).
     */
    public function canAccessWeb(): bool
    {
        return $this->hasPermissionTo('access_web');
    }

    /**
     * Check if the user can access the API (coach or user).
     */
    public function canAccessApi(): bool
    {
        return $this->hasPermissionTo('access_api');
    }

    /**
     * Get the user's primary role name.
     */
    public function getPrimaryRole(): ?string
    {
        return $this->roles()->first()?->name;
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CoachProfile extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'coach_number',
        'phone',
        'avatar',
        'bio',
        'specialties',
        'certifications',
        'badges',
        'languages',
        'years_of_experience',
        'hourly_rate',
        'timezone',
        'is_available',
        'is_verified',
        'availability_schedule',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'specialties' => 'array',
            'certifications' => 'array',
            'badges' => 'array',
            'languages' => 'array',
            'availability_schedule' => 'array',
            'is_available' => 'boolean',
            'is_verified' => 'boolean',
            'hourly_rate' => 'decimal:2',
        ];
    }

    /**
     * Get the user that owns the coach profile.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

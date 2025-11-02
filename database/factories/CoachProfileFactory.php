<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CoachProfile>
 */
class CoachProfileFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'coach_number' => 'COACH-'.str_pad($this->faker->unique()->numberBetween(1, 99999), 5, '0', STR_PAD_LEFT),
            'phone' => $this->faker->phoneNumber,
            'avatar' => null,
            'bio' => $this->faker->paragraph(3),
            'specialties' => $this->faker->randomElements([
                'Life Coaching',
                'Career Coaching',
                'Executive Coaching',
                'Leadership Development',
                'Business Coaching',
                'Health & Wellness',
                'Relationship Coaching',
                'Performance Coaching',
                'Mental Health',
                'Stress Management',
            ], $this->faker->numberBetween(2, 4)),
            'certifications' => $this->faker->randomElements([
                'ICF Certified',
                'ACC Credential',
                'PCC Credential',
                'MCC Credential',
                'Certified Life Coach',
                'Certified Executive Coach',
            ], $this->faker->numberBetween(1, 3)),
            'badges' => $this->faker->randomElements([
                'Top Rated',
                'Verified',
                'Professional',
                'Expert',
                '5 Star Rating',
            ], $this->faker->numberBetween(1, 3)),
            'languages' => $this->faker->randomElements([
                'English',
                'Spanish',
                'French',
                'German',
                'Chinese',
                'Japanese',
            ], $this->faker->numberBetween(1, 2)),
            'years_of_experience' => $this->faker->numberBetween(1, 20),
            'hourly_rate' => $this->faker->randomFloat(2, 50, 300),
            'timezone' => $this->faker->timezone,
            'is_available' => true,
            'is_verified' => $this->faker->boolean(80),
            'availability_schedule' => [
                'monday' => ['09:00-17:00'],
                'tuesday' => ['09:00-17:00'],
                'wednesday' => ['09:00-17:00'],
                'thursday' => ['09:00-17:00'],
                'friday' => ['09:00-17:00'],
            ],
        ];
    }
}

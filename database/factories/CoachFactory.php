<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Coach>
 */
class CoachFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        static $coachNumber = 1;
        $createdAt = $this->faker->dateTimeBetween('-1 year');

        return [
            'user_id' => 1,
            'coach_number' => 'CH-'.str_pad($coachNumber++, 5, '0', STR_PAD_LEFT),
            'name' => $this->faker->name,
            'email' => $this->faker->unique()->safeEmail,
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
                'Performance Coaching'
            ], $this->faker->numberBetween(1, 4)),
            'badges' => $this->faker->randomElements(['ICF', 'EMCC', 'BCC', 'AC'], $this->faker->numberBetween(0, 2)),
            'language' => $this->faker->randomElement(['English', 'Burmese', 'Thai', 'Chinese']),
            'created_at' => $createdAt,
            'updated_at' => $this->faker->dateTimeBetween($createdAt),
        ];
    }
}


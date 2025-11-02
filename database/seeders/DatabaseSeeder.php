<?php

namespace Database\Seeders;

use App\Models\CoachProfile;
use App\Models\User;
use App\Models\UserProfile;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed roles and permissions
        $this->call(RolesAndPermissionsSeeder::class);

        // Create admin user
        $admin = User::firstOrCreate(
            ['email' => 'admin@test.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        // Assign admin role
        if (! $admin->hasRole('admin')) {
            $admin->assignRole('admin');
        }

        // Create coach user
        $coach = User::firstOrCreate(
            ['email' => 'coach@example.com'],
            [
                'name' => 'Coach User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        // Assign coach role
        if (! $coach->hasRole('coach')) {
            $coach->assignRole('coach');
        }

        // Create coach profile for coach user
        if (! $coach->coachProfile()->exists()) {
            CoachProfile::create([
                'user_id' => $coach->id,
                'coach_number' => 'COACH-00001',
                'phone' => '+1-555-0100',
                'bio' => 'Experienced mental health coach with years of experience helping individuals achieve their goals.',
                'specialties' => ['Mental Health', 'Life Coaching', 'Stress Management', 'Work-Life Balance'],
                'certifications' => ['ICF Certified', 'Licensed Therapist', 'Certified Life Coach'],
                'badges' => ['Top Rated', 'Verified', 'Professional'],
                'languages' => ['English'],
                'years_of_experience' => 10,
                'hourly_rate' => 150.00,
                'timezone' => 'America/New_York',
                'is_available' => true,
                'is_verified' => true,
                'availability_schedule' => [
                    'monday' => ['09:00-17:00'],
                    'tuesday' => ['09:00-17:00'],
                    'wednesday' => ['09:00-17:00'],
                    'thursday' => ['09:00-17:00'],
                    'friday' => ['09:00-15:00'],
                ],
            ]);
        }

        // Create regular user
        $user = User::firstOrCreate(
            ['email' => 'user@example.com'],
            [
                'name' => 'Regular User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        // Assign user role and create profile
        if (! $user->hasRole('user')) {
            $user->assignRole('user');
        }
        if (! $user->userProfile()->exists()) {
            UserProfile::create([
                'user_id' => $user->id,
                'phone' => '+1-555-0101',
                'date_of_birth' => '1990-01-01',
                'gender' => 'prefer_not_to_say',
                'bio' => 'Regular user looking for coaching services.',
                'preferences' => [
                    'notifications_enabled' => true,
                    'email_notifications' => true,
                    'theme' => 'light',
                ],
            ]);
        }

        // Create additional test users with roles and profiles
        $admins = User::factory()->count(5)->create();
        foreach ($admins as $adminUser) {
            $adminUser->assignRole('admin');
        }

        $coaches = User::factory()->count(10)->create();
        foreach ($coaches as $coachUser) {
            $coachUser->assignRole('coach');
            CoachProfile::factory()->create(['user_id' => $coachUser->id]);
        }

        $users = User::factory()->count(20)->create();
        foreach ($users as $regularUser) {
            $regularUser->assignRole('user');
            UserProfile::factory()->create(['user_id' => $regularUser->id]);
        }

        $this->command->info('Users seeded successfully!');
        $this->command->info('Admin: admin@test.com / password');
        $this->command->info('Coach: coach@example.com / password');
        $this->command->info('User: user@example.com / password');
    }
}

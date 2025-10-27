<?php

namespace Database\Seeders;

use App\Models\Coach;
use App\Models\User;
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
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        // Assign admin role
        if (!$admin->hasRole('admin')) {
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
        if (!$coach->hasRole('coach')) {
            $coach->assignRole('coach');
        }

        // Create coach profile for coach user
        if (!$coach->coaches()->exists()) {
            Coach::create([
                'user_id' => $coach->id,
                'coach_number' => 'COACH-' . str_pad($coach->id, 4, '0', STR_PAD_LEFT),
                'name' => 'Coach User',
                'email' => 'coach@example.com',
                'bio' => 'Experienced fitness coach',
                'specialties' => ['Fitness', 'Nutrition'],
                'badges' => ['Certified'],
                'language' => 'en',
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

        // Assign user role
        if (!$user->hasRole('user')) {
            $user->assignRole('user');
        }

        // Create additional test users with roles
        $admins = User::factory()->count(5)->create();
        foreach ($admins as $adminUser) {
            $adminUser->assignRole('admin');
        }

        $coaches = User::factory()->count(10)->create();
        foreach ($coaches as $coachUser) {
            $coachUser->assignRole('coach');
        }

        $users = User::factory()->count(20)->create();
        foreach ($users as $regularUser) {
            $regularUser->assignRole('user');
        }

        $this->command->info('Users seeded successfully!');
        $this->command->info('Admin: admin@test.com / password');
        $this->command->info('Coach: coach@example.com / password');
        $this->command->info('User: user@example.com / password');
    }
}
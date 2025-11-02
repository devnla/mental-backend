<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            // Admin permissions
            'manage_users',
            'manage_coaches',
            'manage_subscriptions',
            'view_analytics',
            'manage_settings',
            'export_data',

            // Coach permissions
            'view_profile',
            'edit_profile',
            'manage_schedule',
            'view_clients',
            'message_clients',
            'view_reports',

            // User permissions
            'book_session',
            'view_sessions',
            'cancel_session',
            'rate_coach',
            'view_history',

            // Shared permissions
            'access_api',
            'access_web',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create roles and assign permissions

        // Admin Role - Only web dashboard access
        $admin = Role::firstOrCreate(['name' => 'admin']);
        $adminPermissions = [
            'access_web',
            'manage_users',
            'manage_coaches',
            'manage_subscriptions',
            'view_analytics',
            'manage_settings',
            'export_data',
        ];
        if (! $admin->hasAllPermissions($adminPermissions)) {
            $admin->syncPermissions($adminPermissions);
        }

        // Coach Role - API access with coach permissions
        $coach = Role::firstOrCreate(['name' => 'coach']);
        $coachPermissions = [
            'access_api',
            'view_profile',
            'edit_profile',
            'manage_schedule',
            'view_clients',
            'message_clients',
            'view_reports',
        ];
        if (! $coach->hasAllPermissions($coachPermissions)) {
            $coach->syncPermissions($coachPermissions);
        }

        // User Role - API access with user permissions
        $user = Role::firstOrCreate(['name' => 'user']);
        $userPermissions = [
            'access_api',
            'book_session',
            'view_sessions',
            'cancel_session',
            'rate_coach',
            'view_history',
        ];
        if (! $user->hasAllPermissions($userPermissions)) {
            $user->syncPermissions($userPermissions);
        }
        
        $this->command->info('Roles and permissions created successfully!');
    }
}

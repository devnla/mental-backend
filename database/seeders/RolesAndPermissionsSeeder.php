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

        // Admin Role - All permissions
        $admin = Role::firstOrCreate(['name' => 'admin']);
        if (!$admin->hasAllPermissions(Permission::all())) {
            $admin->givePermissionTo(Permission::all());
        }

        // Coach Roles
        $coach = Role::firstOrCreate(['name' => 'coach']);
        if (!$coach->hasAllPermissions([
            'access_api',
            'view_profile',
            'edit_profile',
            'manage_schedule',
            'view_clients',
            'message_clients',
            'view_reports',
        ])) {
            $coach->givePermissionTo([
                'access_api',
                'view_profile',
                'edit_profile',
                'manage_schedule',
                'view_clients',
                'message_clients',
                'view_reports',
            ]);
        }

        // Coach Pro (paid plan)
        $coachPro = Role::firstOrCreate(['name' => 'coach-pro']);
        if (!$coachPro->hasAllPermissions([
            'access_api',
            'view_profile',
            'edit_profile',
            'manage_schedule',
            'view_clients',
            'message_clients',
            'view_reports',
            'view_analytics',
            'export_data',
        ])) {
            $coachPro->givePermissionTo($coach->permissions);
            $coachPro->givePermissionTo([
                'view_analytics',
                'export_data',
            ]);
        }

        // Coach Enterprise (premium plan)
        $coachEnterprise = Role::firstOrCreate(['name' => 'coach-enterprise']);
        if (!$coachEnterprise->hasAllPermissions([
            'access_api',
            'view_profile',
            'edit_profile',
            'manage_schedule',
            'view_clients',
            'message_clients',
            'view_reports',
            'view_analytics',
            'export_data',
            'manage_settings',
        ])) {
            $coachEnterprise->givePermissionTo($coachPro->permissions);
            $coachEnterprise->givePermissionTo([
                'manage_settings',
            ]);
        }

        // User Roles
        $user = Role::firstOrCreate(['name' => 'user']);
        if (!$user->hasAllPermissions([
            'access_api',
            'book_session',
            'view_sessions',
            'cancel_session',
            'rate_coach',
            'view_history',
        ])) {
            $user->givePermissionTo([
                'access_api',
                'book_session',
                'view_sessions',
                'cancel_session',
                'rate_coach',
                'view_history',
            ]);
        }

        // User Premium (paid plan)
        $userPremium = Role::firstOrCreate(['name' => 'user-premium']);
        if (!$userPremium->hasAllPermissions([
            'access_api',
            'book_session',
            'view_sessions',
            'cancel_session',
            'rate_coach',
            'view_history',
            'view_reports',
        ])) {
            $userPremium->givePermissionTo($user->permissions);
            $userPremium->givePermissionTo([
                'view_reports', // Premium users can view detailed reports
            ]);
        }

        $this->command->info('Roles and permissions created successfully!');
    }
}
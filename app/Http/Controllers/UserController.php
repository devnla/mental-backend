<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * Display a listing of the users.
     */
    public function index(Request $request): Response
    {
        // Get search term
        $search = $request->get('search');

        // Get sorting parameters
        $sort = $request->get('sort', 'id'); // Default sort by id
        $direction = $request->get('direction', 'desc'); // Default descending

        // Get pagination parameters
        $perPage = $request->get('per_page', 10); // Default 10 items per page

        // Build query
        $query = User::query();

        // Apply search filter
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Apply sorting
        $allowedSortColumns = ['id', 'name', 'email', 'email_verified_at', 'created_at', 'updated_at'];
        $sortColumn = in_array($sort, $allowedSortColumns) ? $sort : 'id';
        $sortDirection = in_array($direction, ['asc', 'desc']) ? $direction : 'desc';

        $query->orderBy($sortColumn, $sortDirection);

        // Apply pagination
        $users = $query->paginate($perPage)->withQueryString();

        // Get pagination info
        $paginationInfo = [
            'current_page' => $users->currentPage(),
            'last_page' => $users->lastPage(),
            'per_page' => $users->perPage(),
            'total' => $users->total(),
            'from' => $users->firstItem(),
            'to' => $users->lastItem(),
            'has_more_pages' => $users->hasMorePages(),
        ];

        return Inertia::render('users/index', [
            'users' => $users,
            'filters' => [
                'search' => $search,
                'sort' => $sortColumn,
                'direction' => $sortDirection,
                'per_page' => $perPage,
            ],
            'pagination' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
                'from' => $users->firstItem(),
                'to' => $users->lastItem(),
                'has_more_pages' => $users->hasMorePages(),
            ],
        ]);
    }

    /**
     * Show the form for creating a new user.
     */
    public function create(): Response
    {
        return Inertia::render('users/create');
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
        ]);

        return redirect()->route('users.index')
            ->with('success', 'User created successfully.');
    }

    /**
     * Display the specified user.
     */
    public function show(User $user): Response
    {
        return Inertia::render('users/show', [
            'user' => $user,
        ]);
    }

    /**
     * Show the form for editing the specified user.
     */
    public function edit(User $user): Response
    {
        return Inertia::render('users/edit', [
            'user' => $user,
        ]);
    }

    /**
     * Update the specified user in storage.
     */
    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
        ]);

        $updateData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
        ];

        if (! empty($validated['password'])) {
            $updateData['password'] = bcrypt($validated['password']);
        }

        $user->update($updateData);

        return redirect()->route('users.index')
            ->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(User $user): RedirectResponse
    {
        $user->delete();

        return redirect()->route('users.index')
            ->with('success', 'User deleted successfully.');
    }

    /**
     * Get users data for API/export purposes.
     */
    public function api(Request $request)
    {
        $search = $request->get('search');
        $sort = $request->get('sort', 'id');
        $direction = $request->get('direction', 'desc');
        $perPage = $request->get('per_page', 10);

        $query = User::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $allowedSortColumns = ['id', 'name', 'email', 'email_verified_at', 'created_at', 'updated_at'];
        $sortColumn = in_array($sort, $allowedSortColumns) ? $sort : 'id';
        $sortDirection = in_array($direction, ['asc', 'desc']) ? $direction : 'desc';

        $users = $query->orderBy($sortColumn, $sortDirection)->paginate($perPage);

        return response()->json([
            'data' => $users->items(),
            'pagination' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
                'from' => $users->firstItem(),
                'to' => $users->lastItem(),
            ],
            'filters' => [
                'search' => $search,
                'sort' => $sortColumn,
                'direction' => $sortDirection,
            ],
        ]);
    }

    /**
     * Bulk delete users.
     */
    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:users,id',
        ]);

        $deletedCount = User::whereIn('id', $request->ids)->delete();

        return response()->json([
            'message' => "Successfully deleted {$deletedCount} users.",
            'deleted_count' => $deletedCount,
        ]);
    }

    /**
     * Export users to CSV.
     */
    public function export(Request $request)
    {
        $search = $request->get('search');
        $sort = $request->get('sort', 'id');
        $direction = $request->get('direction', 'desc');

        $query = User::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $allowedSortColumns = ['id', 'name', 'email', 'email_verified_at', 'created_at', 'updated_at'];
        $sortColumn = in_array($sort, $allowedSortColumns) ? $sort : 'id';
        $sortDirection = in_array($direction, ['asc', 'desc']) ? $direction : 'desc';

        $users = $query->orderBy($sortColumn, $sortDirection)->get();

        $filename = 'users_'.now()->format('Y-m-d_H-i-s').'.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="'.$filename.'"',
        ];

        $callback = function () use ($users) {
            $file = fopen('php://output', 'w');

            // CSV headers
            fputcsv($file, ['ID', 'Name', 'Email', 'Email Verified', 'Created At', 'Updated At']);

            // CSV data
            foreach ($users as $user) {
                fputcsv($file, [
                    $user->id,
                    $user->name,
                    $user->email,
                    $user->email_verified_at ? 'Yes' : 'No',
                    $user->created_at->format('Y-m-d H:i:s'),
                    $user->updated_at->format('Y-m-d H:i:s'),
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}

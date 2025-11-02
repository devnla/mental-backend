import { DataTable } from '@/components/data-table/data-table';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Download, Plus } from 'lucide-react';
import { columns } from './columns';

type User = {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
};

export default function UsersIndex() {
    const { props } = usePage();
    const users = (props as any).users ?? { data: [] };
    const pagination = (props as any).pagination ?? {};
    const filters = (props as any).filters ?? {};

    const handleExport = () => {
        const params = new URLSearchParams(filters);
        window.open(`/users-export?${params.toString()}`, '_blank');
    };

    return (
        <AppLayout>
            <Head title="Users" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl leading-tight font-semibold">
                            Users Management
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Manage admin users • Total: {pagination.total || 0}{' '}
                            users
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={handleExport}>
                            <Download className="mr-2 h-4 w-4" />
                            Export CSV
                        </Button>

                        <Link href="/invites/create_invite">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Add User
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats Cards */}
                {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Users</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{pagination.total || 0}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400">Verified Users</div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {users.data?.filter((user: User) => user.email_verified_at).length || 0}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400">Unverified Users</div>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {users.data?.filter((user: User) => !user.email_verified_at).length || 0}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400">Current Page</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {pagination.current_page || 1} of {pagination.last_page || 1}
            </div>
          </div>
        </div> */}

                <div className="mt-4">
                    <DataTable
                        columns={columns}
                        data={users.data as User[]}
                        sortableColumns={[
                            { value: 'id', label: 'ID' },
                            { value: 'name', label: 'Name' },
                            { value: 'email', label: 'Email' },
                            { value: 'email_verified_at', label: 'Verified' },
                            { value: 'created_at', label: 'Created At' },
                        ]}
                        show={filters.search}
                        useFilter={true}
                        usePagination={true}
                    />
                </div>
            </div>
        </AppLayout>
    );
}

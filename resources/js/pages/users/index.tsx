import { DataTable } from '@/components/data-table/data-table';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { Download } from 'lucide-react';
import { useState } from 'react';
import { columns } from './columns';
import CreateUserDialog from './create';

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
    const [open, setOpen] = useState(false);

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

                        <CreateUserDialog open={open} setOpen={setOpen} />
                    </div>
                </div>

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

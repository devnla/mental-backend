import { DataTable } from '@/components/data-table/data-table';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { Download } from 'lucide-react';
import { useState } from 'react';
import { columns } from './columns';
import CreateCoachDialog from './create';

type Coach = {
    id: number;
    coach_number: string;
    name: string;
    email: string;
    avatar?: string;
    specialties?: string[];
    badges?: string[];
    language?: string;
    created_at: string;
    updated_at: string;
};

interface CoachesPageProps {
    app: {
        locale: string;
        currency: string;
        timezone: string;
    };
    flash: {
        success?: string;
        error?: string;
        description?: string;
        timestamp?: string;
    };
    coaches: Coach[];
    show?: string;
    [key: string]: unknown;
}

export default function CoachesIndex() {
    const { props } = usePage();
    const coachesData = (props as any).coaches ?? [];
    const pagination = (props as any).pagination ?? {};
    const filters = (props as any).filters ?? {};
    const [open, setOpen] = useState(false);

    const handleExport = () => {
        const params = new URLSearchParams(filters);
        window.open(`/coaches-export?${params.toString()}`, '_blank');
    };

    return (
        <AppLayout>
            <Head title="Coaches" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl leading-tight font-semibold">
                            Coaches Management
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Manage coaches and their details • Total:{' '}
                            {(coachesData && coachesData.length) || 0} coaches
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={handleExport}>
                            <Download className="mr-2 h-4 w-4" />
                            Export CSV
                        </Button>

                        <CreateCoachDialog open={open} setOpen={setOpen} />
                    </div>
                </div>

                <div className="mt-4">
                    <DataTable
                        columns={columns}
                        data={coachesData || []}
                        sortableColumns={[
                            { value: 'coach_number', label: 'ID' },
                            { value: 'name', label: 'Coach Name' },
                            { value: 'email', label: 'Contact' },
                            { value: 'specialties', label: 'Specialties' },
                            { value: 'badges', label: 'Badges' },
                            { value: 'language', label: 'Language' },
                            { value: 'updated_at', label: 'Last Updated' },
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

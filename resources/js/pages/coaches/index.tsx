import { DataTable } from '@/components/data-table/data-table';
import Heading from '@/components/heading';
import TimestampCell from '@/components/timestamp-cell';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useInitials } from '@/hooks/use-initials';
import AppLayout from '@/layouts/app-layout';
import AddCoachForm from '@/pages/coaches/add-coach-form';
import DeleteCoachForm from '@/pages/coaches/delete-coach-form';
import { dataExport } from '@/routes';
import { type BreadcrumbItem, Coach } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Download, Plus, SquarePen } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import EditCoachForm from './edit-coach-form';

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

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Coaches',
        href: '/coaches',
    },
];

export default function Coaches({ coaches, show }: CoachesPageProps) {
    const { app, flash } = usePage<CoachesPageProps>().props;
    const getInitials = useInitials();

    const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);

    const openEditDialog = (coach: Coach) => {
        setSelectedCoach(coach);
        setEditDialogOpen(true);
    };

    useEffect(() => {
        if (show) {
            router.visit('/coaches', {
                replace: true,
                preserveScroll: true,
                preserveState: true,
            });
        }
    }, [show]);

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success, {
                description: flash.description,
            });
        }

        if (flash.error) {
            toast.error(flash.error, {
                description: flash.description,
            });
        }
    }, [flash.success, flash.error, flash.description, flash.timestamp]);

    const columns: ColumnDef<Coach>[] = [
        {
            id: 'coach_number',
            accessorKey: 'coach_number',
            header: () => <div className="text-center">ID</div>,
            cell: ({ row }) => {
                return (
                    <div className="text-center">
                        {row.getValue('coach_number')}
                    </div>
                );
            },
        },
        {
            id: 'name',
            accessorKey: 'name',
            header: () => <div className="text-start">Coach Name</div>,
            cell: ({ row }) => {
                const coach = row.original;
                return (
                    <div className="flex flex-row items-center gap-x-2">
                        <Avatar className="h-8 w-8 overflow-hidden">
                            <AvatarImage
                                src={
                                    coach.avatar
                                        ? `/storage/${coach.avatar}`
                                        : undefined
                                }
                                alt={coach.name}
                            />
                            <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                {getInitials(coach.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="text-start font-medium">
                            {coach.name}
                        </div>
                    </div>
                );
            },
        },
        {
            id: 'email',
            accessorKey: 'email',
            header: () => <div className="text-start">Contact</div>,
            cell: ({ row }) => {
                return (
                    <div className="text-start font-medium">
                        {row.getValue('email')}
                    </div>
                );
            },
        },
        {
            id: 'specialties',
            accessorKey: 'specialties',
            header: () => <div className="text-start">Specialties</div>,
            cell: ({ row }) => {
                const specialties: string[] =
                    row.getValue('specialties') || [];
                return (
                    <div className="flex flex-wrap gap-1">
                        {specialties.length > 0 ? (
                            specialties.slice(0, 2).map((specialty, idx) => (
                                <Badge
                                    key={idx}
                                    variant="secondary"
                                    className="text-xs"
                                >
                                    {specialty}
                                </Badge>
                            ))
                        ) : (
                            <span className="text-muted-foreground">-</span>
                        )}
                        {specialties.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                                +{specialties.length - 2}
                            </Badge>
                        )}
                    </div>
                );
            },
        },
        {
            id: 'badges',
            accessorKey: 'badges',
            header: () => <div className="text-center">Badges</div>,
            cell: ({ row }) => {
                const badges: string[] = row.getValue('badges') || [];
                return (
                    <div className="flex flex-wrap justify-center gap-1">
                        {badges.length > 0 ? (
                            badges.map((badge, idx) => (
                                <Badge
                                    key={idx}
                                    variant="default"
                                    className="text-xs"
                                >
                                    {badge}
                                </Badge>
                            ))
                        ) : (
                            <span className="text-muted-foreground">-</span>
                        )}
                    </div>
                );
            },
        },
        {
            id: 'language',
            accessorKey: 'language',
            header: () => <div className="text-center">Language</div>,
            cell: ({ row }) => {
                const language: string = row.getValue('language') || '-';
                return <div className="text-center">{language}</div>;
            },
        },
        {
            id: 'updated_at',
            accessorKey: 'updated_at',
            header: () => <div className="text-center">Last Updated</div>,
            cell: ({ row }) => {
                return (
                    <TimestampCell
                        primaryDate={row.getValue('updated_at')}
                        secondaryDate={row.original.created_at}
                        locale={app.locale}
                        timezone={app.timezone}
                        primaryLabel="Last updated"
                        secondaryLabel="Created at"
                    />
                );
            },
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                const coach = row.original;

                return (
                    <div className="flex flex-row items-center justify-center gap-x-2">
                        <SquarePen
                            className="size-5 cursor-pointer text-primary transition-transform duration-300 hover:text-primary/70 active:scale-95"
                            onClick={() => openEditDialog(coach)}
                        />
                        <DeleteCoachForm coach={coach} />
                    </div>
                );
            },
        },
    ];

    const sortableColumns = [
        { value: 'coach_number', label: 'ID' },
        { value: 'name', label: 'Coach Name' },
        { value: 'email', label: 'Contact' },
        { value: 'specialties', label: 'Specialties' },
        { value: 'badges', label: 'Badges' },
        { value: 'language', label: 'Language' },
        { value: 'updated_at', label: 'Last Updated' },
        { value: 'actions', label: 'Actions' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Coaches" />

            <div className="p-4">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
                    <Heading
                        title="Coaches"
                        description="Manage your coaches and their details."
                    />

                    <div className="flex flex-row items-center gap-x-4 sm:justify-center">
                        <AddCoachForm>
                            <Button className="flex items-center gap-x-2">
                                <Plus className="size-5" />
                                Add New
                            </Button>
                        </AddCoachForm>

                        <Button variant="ghost" asChild>
                            <a
                                href={dataExport.url({ type: 'coaches' })}
                                download
                                target="_blank"
                                rel="noopener"
                                className="flex items-center gap-x-2"
                            >
                                <Download className="size-5" />
                                Export
                            </a>
                        </Button>
                    </div>
                </div>

                <div>
                    <DataTable
                        columns={columns}
                        data={coaches}
                        sortableColumns={sortableColumns}
                        show={show}
                    />
                </div>

                {selectedCoach && (
                    <EditCoachForm
                        coach={selectedCoach}
                        open={editDialogOpen}
                        setOpen={setEditDialogOpen}
                    />
                )}
            </div>
        </AppLayout>
    );
}


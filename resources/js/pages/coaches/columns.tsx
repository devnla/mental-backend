'use client';

import TimestampCell from '@/components/timestamp-cell';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useInitials } from '@/hooks/use-initials';
import { router, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Eye, MoreHorizontal, Trash2 } from 'lucide-react';
import { useState } from 'react';
import EditCoachDialog from './edit';
import ViewCoachDialog from './view';

export type Coach = {
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

export const columns: ColumnDef<Coach>[] = [
    {
        accessorKey: 'coach_number',
        header: 'ID',
        cell: ({ row }) => (
            <div className="font-medium">{row.getValue('coach_number')}</div>
        ),
    },
    {
        accessorKey: 'name',
        header: 'Coach Name',
        cell: ({ row }) => {
            const coach = row.original;
            const getInitials = useInitials();
            const coachName = coach.name || 'Unnamed Coach';
            return (
                <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8 overflow-hidden">
                        <AvatarImage
                            src={
                                coach.avatar
                                    ? `/storage/${coach.avatar}`
                                    : undefined
                            }
                            alt={coachName}
                        />
                        <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                            {getInitials(coachName)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="font-medium">{coachName}</div>
                </div>
            );
        },
    },
    {
        accessorKey: 'email',
        header: 'Contact',
        cell: ({ row }) => (
            <div className="text-blue-600 dark:text-blue-400">
                {row.getValue('email')}
            </div>
        ),
    },
    {
        accessorKey: 'specialties',
        header: 'Specialties',
        cell: ({ row }) => {
            const specialties: string[] = row.getValue('specialties') || [];
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
        accessorKey: 'badges',
        header: 'Badges',
        cell: ({ row }) => {
            const badges: string[] = row.getValue('badges') || [];
            return (
                <div className="flex flex-wrap justify-start gap-1">
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
        accessorKey: 'language',
        header: 'Language',
        cell: ({ row }) => {
            const language: string = row.getValue('language') || '-';
            return <div className="text-center">{language}</div>;
        },
    },
    {
        accessorKey: 'updated_at',
        header: 'Last Updated',
        cell: ({ row }) => {
            const { app } = usePage().props as any;
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
        header: 'Actions',
        cell: ({ row }) => {
            const coach = row.original;
            const [viewOpen, setViewOpen] = useState(false);
            const [editOpen, setEditOpen] = useState(false);

            const handleDelete = () => {
                if (confirm(`Are you sure you want to delete ${coach.name}?`)) {
                    router.delete(`/coaches/${coach.id}`);
                }
            };

            return (
                <>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() => setViewOpen(true)}
                                className="cursor-pointer"
                            >
                                <Eye className="mr-2 h-4 w-4" />
                                View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setEditOpen(true)}
                                className="cursor-pointer"
                            >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={handleDelete}
                                className="cursor-pointer text-red-600"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <ViewCoachDialog
                        coach={coach}
                        open={viewOpen}
                        setOpen={setViewOpen}
                    />
                    <EditCoachDialog
                        coach={coach}
                        open={editOpen}
                        setOpen={setEditOpen}
                    />
                </>
            );
        },
    },
];

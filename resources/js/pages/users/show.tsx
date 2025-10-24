import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}

interface ShowUserProps {
    user: User;
}

export default function ShowUser({ user }: ShowUserProps) {
    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete ${user.name}?`)) {
            router.delete(`/users/${user.id}`);
        }
    };

    return (
        <AppLayout>
            <Head title={`User: ${user.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Header */}
                            <div className="mb-6 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Link href="/users">
                                        <Button variant="ghost" size="sm">
                                            <ArrowLeft className="mr-2 h-4 w-4" />
                                            Back to Users
                                        </Button>
                                    </Link>
                                    <h2 className="text-2xl font-bold">
                                        User Details
                                    </h2>
                                </div>

                                <div className="flex gap-2">
                                    <Link href={`/users/${user.id}/edit`}>
                                        <Button
                                            variant="outline"
                                            className="flex items-center gap-2"
                                        >
                                            <Edit className="h-4 w-4" />
                                            Edit
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="destructive"
                                        onClick={handleDelete}
                                        className="flex items-center gap-2"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        Delete
                                    </Button>
                                </div>
                            </div>

                            {/* User Details */}
                            <div className="grid gap-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Basic Information</CardTitle>
                                        <CardDescription>
                                            User's basic account information
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">
                                                    Name
                                                </label>
                                                <p className="text-lg">
                                                    {user.name}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">
                                                    Email
                                                </label>
                                                <p className="text-lg">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">
                                                    Email Verification Status
                                                </label>
                                                <div className="mt-1">
                                                    <span
                                                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                            user.email_verified_at
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-red-100 text-red-800'
                                                        }`}
                                                    >
                                                        {user.email_verified_at
                                                            ? 'Verified'
                                                            : 'Not Verified'}
                                                    </span>
                                                </div>
                                            </div>
                                            {user.email_verified_at && (
                                                <div>
                                                    <label className="text-sm font-medium text-gray-500">
                                                        Verified At
                                                    </label>
                                                    <p className="text-lg">
                                                        {new Date(
                                                            user.email_verified_at,
                                                        ).toLocaleString()}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>
                                            Account Information
                                        </CardTitle>
                                        <CardDescription>
                                            Account creation and update
                                            timestamps
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">
                                                    Created At
                                                </label>
                                                <p className="text-lg">
                                                    {new Date(
                                                        user.created_at,
                                                    ).toLocaleString()}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">
                                                    Last Updated
                                                </label>
                                                <p className="text-lg">
                                                    {new Date(
                                                        user.updated_at,
                                                    ).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

export default function CreateUser() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/users');
    };

    return (
        <AppLayout>
            <Head title="Create User" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Header */}
                            <div className="mb-6 flex items-center gap-4">
                                <Link href="/users">
                                    <Button variant="ghost" size="sm">
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Back to Users
                                    </Button>
                                </Link>
                                <h2 className="text-2xl font-bold">
                                    Create New User
                                </h2>
                            </div>

                            {/* Form */}
                            <Card className="max-w-2xl">
                                <CardHeader>
                                    <CardTitle>User Information</CardTitle>
                                    <CardDescription>
                                        Enter the user's details below to create
                                        a new account.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form
                                        onSubmit={submit}
                                        className="space-y-6"
                                    >
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Name</Label>
                                            <Input
                                                id="name"
                                                type="text"
                                                value={data.name}
                                                onChange={(e) =>
                                                    setData(
                                                        'name',
                                                        e.target.value,
                                                    )
                                                }
                                                className={
                                                    errors.name
                                                        ? 'border-red-500'
                                                        : ''
                                                }
                                                placeholder="Enter user's name"
                                            />
                                            {errors.name && (
                                                <p className="text-sm text-red-600">
                                                    {errors.name}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) =>
                                                    setData(
                                                        'email',
                                                        e.target.value,
                                                    )
                                                }
                                                className={
                                                    errors.email
                                                        ? 'border-red-500'
                                                        : ''
                                                }
                                                placeholder="Enter user's email"
                                            />
                                            {errors.email && (
                                                <p className="text-sm text-red-600">
                                                    {errors.email}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="password">
                                                Password
                                            </Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                value={data.password}
                                                onChange={(e) =>
                                                    setData(
                                                        'password',
                                                        e.target.value,
                                                    )
                                                }
                                                className={
                                                    errors.password
                                                        ? 'border-red-500'
                                                        : ''
                                                }
                                                placeholder="Enter password"
                                            />
                                            {errors.password && (
                                                <p className="text-sm text-red-600">
                                                    {errors.password}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="password_confirmation">
                                                Confirm Password
                                            </Label>
                                            <Input
                                                id="password_confirmation"
                                                type="password"
                                                value={
                                                    data.password_confirmation
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        'password_confirmation',
                                                        e.target.value,
                                                    )
                                                }
                                                className={
                                                    errors.password_confirmation
                                                        ? 'border-red-500'
                                                        : ''
                                                }
                                                placeholder="Confirm password"
                                            />
                                            {errors.password_confirmation && (
                                                <p className="text-sm text-red-600">
                                                    {
                                                        errors.password_confirmation
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex gap-4">
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                            >
                                                {processing
                                                    ? 'Creating...'
                                                    : 'Create User'}
                                            </Button>
                                            <Link href="/users">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                >
                                                    Cancel
                                                </Button>
                                            </Link>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

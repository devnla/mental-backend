import { Form, Head, usePage } from '@inertiajs/react';
import AuthLayout from '@/layouts/auth-layout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import { Spinner } from '@/components/ui/spinner';

export default function InviteCreate() {
    const page = usePage();
    const props = page.props as { status?: string };

    return (
        <AuthLayout title="Send Invitation" description="Send invite emails to new users">
            <Head title="Create Invite" />

            <Form method="post" action="/invites" className="max-w-md">
                {({ processing, errors }) => (
                    <div className="grid gap-4">
                        {props.status && (
                            <div className="text-sm text-green-600">{props.status}</div>
                        )}

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="invitee@example.com" required />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="days">Expires (days)</Label>
                            <Input id="days" name="days" type="number" placeholder="7" />
                            <InputError message={errors.days} />
                        </div>

                        <Button type="submit" disabled={processing} className="w-full">
                            {processing && <Spinner />} Send invite
                        </Button>
                    </div>
                )}
            </Form>
        </AuthLayout>
    );
}

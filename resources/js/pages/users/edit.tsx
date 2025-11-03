import CrudDialog from '@/components/dialog/crud-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

export type EditUserDialogProps = {
    user: {
        id: number;
        name: string;
        email: string;
    };
    open: boolean;
    setOpen: (open: boolean) => void;
};

export default function EditUserDialog({
    user,
    open,
    setOpen,
}: EditUserDialogProps) {
    const [processing, setProcessing] = useState(false);
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: '' }));
        }
    };

    const handleEditUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            const response = await fetch(`/users/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setOpen(false);
                window.location.reload();
            } else {
                const data = await response.json();
                setErrors(data.errors || {});
            }
        } catch (error) {
            console.error('Error updating user:', error);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <CrudDialog
            mode="edit"
            title={`Edit ${user.name}`}
            description="Update the user's details below."
            open={open}
            setOpen={setOpen}
            onSubmit={handleEditUser}
            processing={processing}
            submitLabel="Save Changes"
            formContent={
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            value={formData.name}
                            onChange={(e) =>
                                handleInputChange('name', e.target.value)
                            }
                            className={errors.name ? 'border-destructive' : ''}
                            required
                        />
                        {errors.name && (
                            <p className="text-sm text-destructive">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                                handleInputChange('email', e.target.value)
                            }
                            className={errors.email ? 'border-destructive' : ''}
                            required
                        />
                        {errors.email && (
                            <p className="text-sm text-destructive">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">
                            New Password (optional)
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) =>
                                handleInputChange('password', e.target.value)
                            }
                            className={
                                errors.password ? 'border-destructive' : ''
                            }
                            placeholder="Leave blank to keep current"
                        />
                        {errors.password && (
                            <p className="text-sm text-destructive">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password_confirmation">
                            Confirm New Password
                        </Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            value={formData.password_confirmation}
                            onChange={(e) =>
                                handleInputChange(
                                    'password_confirmation',
                                    e.target.value,
                                )
                            }
                            className={
                                errors.password_confirmation
                                    ? 'border-destructive'
                                    : ''
                            }
                        />
                        {errors.password_confirmation && (
                            <p className="text-sm text-destructive">
                                {errors.password_confirmation}
                            </p>
                        )}
                    </div>
                </div>
            }
        />
    );
}

import CrudDialog from '@/components/dialog/crud-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export type CreateUserDialogProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
};

export default function CreateUserDialog({
    open,
    setOpen,
}: CreateUserDialogProps) {
    const [processing, setProcessing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
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

    const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            const response = await fetch('/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    password_confirmation: '',
                });
                setOpen(false);
                window.location.reload();
            } else {
                const data = await response.json();
                setErrors(data.errors || {});
            }
        } catch (error) {
            console.error('Error creating user:', error);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <CrudDialog
            mode="create"
            open={open}
            setOpen={setOpen}
            onSubmit={handleCreateUser}
            processing={processing}
            submitLabel="Create"
            trigger={
                <Button>
                    <Plus className="h-4 w-4" />
                    Add User
                </Button>
            }
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
                            placeholder="Enter user's name"
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
                            placeholder="Enter user's email"
                            required
                        />
                        {errors.email && (
                            <p className="text-sm text-destructive">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
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
                            placeholder="Enter password"
                            required
                        />
                        {errors.password && (
                            <p className="text-sm text-destructive">
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
                            placeholder="Confirm password"
                            required
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

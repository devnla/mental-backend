import CrudDialog from '@/components/dialog/crud-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export type CreateCoachDialogProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
};

export default function CreateCoachDialog({
    open,
    setOpen,
}: CreateCoachDialogProps) {
    const [processing, setProcessing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        specialties: '',
        badges: '',
        language: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: '' }));
        }
    };

    const handleCreateCoach = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            const response = await fetch('/coaches', {
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
                    specialties: '',
                    badges: '',
                    language: '',
                });
                setOpen(false);
                window.location.reload();
            } else {
                const data = await response.json();
                setErrors(data.errors || {});
            }
        } catch (error) {
            console.error('Error creating coach:', error);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <CrudDialog
            mode="create"
            open={open}
            setOpen={setOpen}
            onSubmit={handleCreateCoach}
            processing={processing}
            submitLabel="Create"
            trigger={
                <Button>
                    <Plus className="h-4 w-4" />
                    Add Coach
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
                            placeholder="Enter coach's name"
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
                            placeholder="Enter coach's email"
                            required
                        />
                        {errors.email && (
                            <p className="text-sm text-destructive">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="specialties">Specialties</Label>
                        <Input
                            id="specialties"
                            type="text"
                            value={formData.specialties}
                            onChange={(e) =>
                                handleInputChange('specialties', e.target.value)
                            }
                            className={
                                errors.specialties ? 'border-destructive' : ''
                            }
                            placeholder="Enter specialties (comma-separated)"
                        />
                        {errors.specialties && (
                            <p className="text-sm text-destructive">
                                {errors.specialties}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="badges">Badges</Label>
                        <Input
                            id="badges"
                            type="text"
                            value={formData.badges}
                            onChange={(e) =>
                                handleInputChange('badges', e.target.value)
                            }
                            className={
                                errors.badges ? 'border-destructive' : ''
                            }
                            placeholder="Enter badges (comma-separated)"
                        />
                        {errors.badges && (
                            <p className="text-sm text-destructive">
                                {errors.badges}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <Input
                            id="language"
                            type="text"
                            value={formData.language}
                            onChange={(e) =>
                                handleInputChange('language', e.target.value)
                            }
                            className={
                                errors.language ? 'border-destructive' : ''
                            }
                            placeholder="Enter language"
                        />
                        {errors.language && (
                            <p className="text-sm text-destructive">
                                {errors.language}
                            </p>
                        )}
                    </div>
                </div>
            }
        />
    );
}

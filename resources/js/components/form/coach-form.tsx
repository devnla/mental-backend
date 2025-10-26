import FormDialog from '@/components/dialog/form-dialog';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Ring } from 'ldrs/react';
import 'ldrs/react/Ring.css';
import { FormEventHandler, ReactNode } from 'react';

interface CoachFormProps {
    data: {
        name: string;
        email: string;
        avatar?: File | null;
        remove_avatar?: boolean;
        bio?: string;
        specialties?: string[];
        badges?: string[];
        language?: string;
    };
    setData: (key: string, value: unknown) => void;
    processing: boolean;
    errors: {
        name?: string;
        email?: string;
        avatar?: string;
        remove_avatar?: string;
        bio?: string;
        specialties?: string;
        badges?: string;
        language?: string;
    };
    submit: FormEventHandler;
    trigger: ReactNode;
    open: boolean;
    setOpen: (open: boolean) => void;

    [key: string]: unknown;
}

const availableSpecialties = [
    'Life Coaching',
    'Career Coaching',
    'Executive Coaching',
    'Leadership Development',
    'Business Coaching',
    'Health & Wellness',
    'Relationship Coaching',
    'Performance Coaching',
];

const availableBadges = ['ICF', 'EMCC', 'BCC', 'AC'];

const availableLanguages = ['English', 'Burmese', 'Thai', 'Chinese'];

export default function CoachForm({
    data,
    setData,
    processing,
    errors,
    submit,
    trigger,
    open,
    setOpen,
}: CoachFormProps) {
    const handleSpecialtyToggle = (specialty: string) => {
        const current = data.specialties || [];
        if (current.includes(specialty)) {
            setData(
                'specialties',
                current.filter((s) => s !== specialty),
            );
        } else {
            setData('specialties', [...current, specialty]);
        }
    };

    const handleBadgeToggle = (badge: string) => {
        const current = data.badges || [];
        if (current.includes(badge)) {
            setData(
                'badges',
                current.filter((b) => b !== badge),
            );
        } else {
            setData('badges', [...current, badge]);
        }
    };

    return (
        <form>
            <FormDialog
                title="Add New Coach"
                description="Fill in the details below to add a new coach to your database."
                trigger={trigger}
                formContent={
                    <div className="flex flex-col gap-y-4 p-4 sm:p-0">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                required
                                autoComplete="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                disabled={processing}
                                placeholder="Coach name"
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                disabled={processing}
                                placeholder="Coach email"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="avatar">Avatar (Optional)</Label>
                            <Input
                                id="avatar"
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setData(
                                        'avatar',
                                        e.target.files
                                            ? e.target.files[0]
                                            : null,
                                    )
                                }
                                disabled={processing || data.remove_avatar}
                            />
                            <InputError message={errors.avatar} />
                        </div>

                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="remove_avatar"
                                name="remove_avatar"
                                checked={data.remove_avatar}
                                onClick={() => {
                                    setData('avatar', null);
                                    setData(
                                        'remove_avatar',
                                        !data.remove_avatar,
                                    );
                                }}
                                tabIndex={3}
                            />
                            <Label htmlFor="remove_avatar">Remove avatar</Label>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="bio">Bio (Optional)</Label>
                            <Textarea
                                id="bio"
                                value={data.bio || ''}
                                onChange={(e) => setData('bio', e.target.value)}
                                disabled={processing}
                                placeholder="Coach bio"
                                rows={3}
                            />
                            <InputError message={errors.bio} />
                        </div>

                        <div className="grid gap-2">
                            <Label>Specialties (Optional)</Label>
                            <div className="grid grid-cols-2 gap-2">
                                {availableSpecialties.map((specialty) => (
                                    <div
                                        key={specialty}
                                        className="flex items-center gap-2"
                                    >
                                        <Checkbox
                                            id={`specialty-${specialty}`}
                                            checked={
                                                data.specialties?.includes(
                                                    specialty,
                                                ) || false
                                            }
                                            onCheckedChange={() =>
                                                handleSpecialtyToggle(specialty)
                                            }
                                            disabled={processing}
                                        />
                                        <Label
                                            htmlFor={`specialty-${specialty}`}
                                            className="cursor-pointer text-sm"
                                        >
                                            {specialty}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                            <InputError message={errors.specialties} />
                        </div>

                        <div className="grid gap-2">
                            <Label>Badges (Optional)</Label>
                            <div className="grid grid-cols-4 gap-2">
                                {availableBadges.map((badge) => (
                                    <div
                                        key={badge}
                                        className="flex items-center gap-2"
                                    >
                                        <Checkbox
                                            id={`badge-${badge}`}
                                            checked={
                                                data.badges?.includes(badge) ||
                                                false
                                            }
                                            onCheckedChange={() =>
                                                handleBadgeToggle(badge)
                                            }
                                            disabled={processing}
                                        />
                                        <Label
                                            htmlFor={`badge-${badge}`}
                                            className="cursor-pointer text-sm"
                                        >
                                            {badge}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                            <InputError message={errors.badges} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="language">Language (Optional)</Label>
                            <Select
                                value={data.language || ''}
                                onValueChange={(value) =>
                                    setData('language', value)
                                }
                                disabled={processing}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel className="text-muted-foreground">
                                            Language
                                        </SelectLabel>
                                        {availableLanguages.map((lang) => (
                                            <SelectItem key={lang} value={lang}>
                                                {lang}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.language} />
                        </div>
                    </div>
                }
                formButton={
                    <Button disabled={processing} onClick={submit}>
                        {processing && (
                            <Ring
                                size="14"
                                stroke="2"
                                speed="2.5"
                                color="gray"
                            />
                        )}
                        Save Coach
                    </Button>
                }
                open={open}
                setOpen={setOpen}
            />
        </form>
    );
}


import CoachForm from '@/components/form/coach-form';
import { update } from '@/routes/coaches';
import { Coach } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, ReactNode, useEffect } from 'react';

interface EditCoachFormProps {
    coach: Coach;
    children?: ReactNode;
    open: boolean;
    setOpen: (open: boolean) => void;
}

type EditCoachForm = {
    name: string;
    email: string;
    avatar?: File | null;
    remove_avatar?: boolean;
    bio?: string;
    specialties?: string[];
    badges?: string[];
    language?: string;
};

export default function EditCoachForm({
    coach,
    children,
    open,
    setOpen,
}: EditCoachFormProps) {
    const { data, setData, patch, processing, errors } = useForm<
        Required<EditCoachForm>
    >({
        name: coach.name,
        email: coach.email,
        avatar: null,
        remove_avatar: false,
        bio: coach.bio || '',
        specialties: coach.specialties || [],
        badges: coach.badges || [],
        language: coach.language || '',
    });

    useEffect(() => {
        setData({
            name: coach.name,
            email: coach.email,
            avatar: null,
            remove_avatar: false,
            bio: coach.bio || '',
            specialties: coach.specialties || [],
            badges: coach.badges || [],
            language: coach.language || '',
        });
    }, [coach]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(update.url({ coach: coach.id }), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setOpen(false);
                setData({
                    name: '',
                    email: '',
                    avatar: null,
                    remove_avatar: false,
                    bio: '',
                    specialties: [],
                    badges: [],
                    language: '',
                });
            },
        });
    };

    return (
        <CoachForm
            data={data}
            setData={setData}
            processing={processing}
            errors={errors}
            submit={submit}
            trigger={children}
            open={open}
            setOpen={setOpen}
        />
    );
}


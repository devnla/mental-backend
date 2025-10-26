import CoachForm from '@/components/form/coach-form';
import { store } from '@/routes/coaches';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, ReactNode, useState } from 'react';

interface AddCoachFormProps {
    children: ReactNode;
}

type AddCoachForm = {
    name: string;
    email: string;
    avatar?: File | null;
    bio?: string;
    specialties?: string[];
    badges?: string[];
    language?: string;
};

export default function AddCoachForm({ children }: AddCoachFormProps) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors } = useForm<
        Required<AddCoachForm>
    >({
        name: '',
        email: '',
        avatar: null,
        bio: '',
        specialties: [],
        badges: [],
        language: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(store.url(), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setOpen(false);
                setData({
                    name: '',
                    email: '',
                    avatar: null,
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


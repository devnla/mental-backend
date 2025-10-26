import { DeleteDialog } from '@/components/dialog/delete-dialog';
import { destroy as destroyRoute } from '@/routes/coaches';
import { Coach } from '@/types';
import { useForm } from '@inertiajs/react';
import { Trash } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface DeleteCoachFormProps {
    coach: Coach;
}

type EditCoachForm = {
    name: string;
    email: string;
};

export default function DeleteCoachForm({ coach }: DeleteCoachFormProps) {
    const [open, setOpen] = useState(false);
    const { delete: destroy, processing } =
        useForm<Required<EditCoachForm>>();

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        destroy(destroyRoute.url({ coach: coach.id }), {
            preserveScroll: true,
            onSuccess: () => setOpen(false),
        });
    };

    return (
        <DeleteDialog
            title={`Delete "${coach.name}"?`}
            description={`Are you sure you want to delete ${coach.coach_number} "${coach.name}"? This action cannot be undone.`}
            trigger={
                <Trash className="size-5 cursor-pointer text-destructive transition-transform duration-300 hover:text-destructive/70 active:scale-95" />
            }
            onDelete={submit}
            processing={processing}
            open={open}
            setOpen={setOpen}
        />
    );
}


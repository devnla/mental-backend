import CustomerForm from '@/components/form/customer-form';
import { Customer } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, ReactNode, useEffect } from 'react';
import { update } from '@/routes/customers';

interface EditCustomerFormProps {
    customer: Customer;
    children?: ReactNode;
    open: boolean;
    setOpen: (open: boolean) => void;
}

type EditCustomerForm = {
    name: string;
    email: string;
    avatar?: File | null;
    remove_avatar?: boolean;
    type: string;
};

export default function EditCustomerForm({ customer, children, open, setOpen }: EditCustomerFormProps) {
    const { data, setData, patch, processing, errors } = useForm<Required<EditCustomerForm>>({
        name: customer.name,
        email: customer.email,
        avatar: null,
        remove_avatar: false,
        type: customer.type,
    });

    useEffect(() => {
        setData({
            name: customer.name,
            email: customer.email,
            avatar: null,
            remove_avatar: false,
            type: customer.type,
        });
    }, [customer]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(update.url({ customer: customer.id }), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setOpen(false);
                setData({
                    name: '',
                    email: '',
                    avatar: null,
                    remove_avatar: false,
                    type: 'individual',
                });
            },
        });
    };

    return (
        <CustomerForm
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

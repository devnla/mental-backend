import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Ring } from 'ldrs/react';
import 'ldrs/react/Ring.css';
import { FormEventHandler, ReactNode } from 'react';

type CrudMode = 'create' | 'edit' | 'view';

interface CrudFormProps {
    mode: CrudMode;
    title?: string;
    description?: string;
    formContent: ReactNode;
    onSubmit?: FormEventHandler<HTMLFormElement>;
    onCancel?: () => void;
    processing?: boolean;
    submitLabel?: string;
    cancelLabel?: string;
    showCard?: boolean;
    footerActions?: ReactNode;
}

const defaultTitles: Record<CrudMode, string> = {
    create: 'Create New Entry',
    edit: 'Edit Entry',
    view: 'Entry Details',
};

const defaultDescriptions: Record<CrudMode, string> = {
    create: 'Fill in the details below to create a new entry.',
    edit: 'Update the details below to modify this entry.',
    view: 'View the details of this entry.',
};

export default function CrudForm({
    mode,
    title,
    description,
    formContent,
    onSubmit,
    onCancel,
    processing = false,
    submitLabel,
    cancelLabel = 'Cancel',
    showCard = true,
    footerActions,
}: CrudFormProps) {
    const formTitle = title || defaultTitles[mode];
    const formDescription = description || defaultDescriptions[mode];

    const getSubmitLabel = () => {
        if (submitLabel) return submitLabel;
        switch (mode) {
            case 'create':
                return 'Create';
            case 'edit':
                return 'Save Changes';
            case 'view':
                return null;
            default:
                return 'Submit';
        }
    };

    const submitButtonLabel = getSubmitLabel();
    const isReadOnly = mode === 'view';

    const FormContent = (
        <form onSubmit={onSubmit} className="space-y-6">
            {!showCard && (
                <div className="space-y-2">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        {formTitle}
                    </h2>
                    {formDescription && (
                        <p className="text-sm text-muted-foreground">
                            {formDescription}
                        </p>
                    )}
                </div>
            )}

            <div className="space-y-4">{formContent}</div>

            <div className="flex items-center justify-between gap-4 pt-4">
                <div className="flex gap-2">
                    {onCancel && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            disabled={processing}
                        >
                            {isReadOnly ? 'Back' : cancelLabel}
                        </Button>
                    )}
                    {footerActions}
                </div>

                {!isReadOnly && submitButtonLabel && (
                    <Button type="submit" disabled={processing}>
                        {processing && (
                            <Ring
                                size="14"
                                stroke="2"
                                speed="2.5"
                                color="gray"
                            />
                        )}
                        {submitButtonLabel}
                    </Button>
                )}
            </div>
        </form>
    );

    if (showCard) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>{formTitle}</CardTitle>
                    {formDescription && (
                        <CardDescription>{formDescription}</CardDescription>
                    )}
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit} className="space-y-4">
                        {formContent}
                    </form>
                </CardContent>
                <CardFooter className="flex items-center justify-between gap-4 border-t pt-6">
                    <div className="flex gap-2">
                        {onCancel && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onCancel}
                                disabled={processing}
                            >
                                {isReadOnly ? 'Back' : cancelLabel}
                            </Button>
                        )}
                        {footerActions}
                    </div>

                    {!isReadOnly && submitButtonLabel && (
                        <Button
                            type="submit"
                            onClick={(e) => {
                                e.preventDefault();
                                const form = e.currentTarget.closest('form');
                                if (form && onSubmit) {
                                    onSubmit(
                                        e as unknown as React.FormEvent<HTMLFormElement>,
                                    );
                                }
                            }}
                            disabled={processing}
                        >
                            {processing && (
                                <Ring
                                    size="14"
                                    stroke="2"
                                    speed="2.5"
                                    color="gray"
                                />
                            )}
                            {submitButtonLabel}
                        </Button>
                    )}
                </CardFooter>
            </Card>
        );
    }

    return FormContent;
}
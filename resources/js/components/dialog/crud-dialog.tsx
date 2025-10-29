import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Ring } from 'ldrs/react';
import 'ldrs/react/Ring.css';
import { FormEventHandler, ReactNode } from 'react';

type CrudMode = 'create' | 'edit' | 'view' | 'delete';

interface CrudDialogProps {
    mode: CrudMode;
    title?: string;
    description?: string;
    trigger?: ReactNode;
    formContent: ReactNode;
    open: boolean;
    setOpen: (open: boolean) => void;
    onSubmit?: FormEventHandler<HTMLFormElement>;
    processing?: boolean;
    submitLabel?: string;
    cancelLabel?: string;
}

const defaultTitles: Record<CrudMode, string> = {
    create: 'Create New Entry',
    edit: 'Edit Entry',
    view: 'View Entry',
    delete: 'Delete Entry',
};

const defaultDescriptions: Record<CrudMode, string> = {
    create: 'Fill in the details below to create a new entry.',
    edit: 'Update the details below to modify this entry.',
    view: 'View the details of this entry.',
    delete: 'This action will permanently delete the entry and cannot be undone.',
};

export default function CrudDialog({
    mode,
    title,
    description,
    trigger,
    formContent,
    open,
    setOpen,
    onSubmit,
    processing = false,
    submitLabel,
    cancelLabel = 'Cancel',
}: CrudDialogProps) {
    const isDesktop = useMediaQuery('(min-width: 640px)');

    const dialogTitle = title || defaultTitles[mode];
    const dialogDescription = description || defaultDescriptions[mode];

    const getSubmitLabel = () => {
        if (submitLabel) return submitLabel;
        switch (mode) {
            case 'create':
                return 'Create';
            case 'edit':
                return 'Save Changes';
            case 'delete':
                return 'Delete';
            case 'view':
                return null;
            default:
                return 'Submit';
        }
    };

    const getSubmitVariant = () => {
        if (mode === 'delete') return 'destructive';
        return 'default';
    };

    const submitButtonLabel = getSubmitLabel();
    const isReadOnly = mode === 'view';

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
                <DialogContent>
                    <form onSubmit={onSubmit}>
                        <DialogHeader>
                            <DialogTitle>{dialogTitle}</DialogTitle>
                            <DialogDescription>
                                {dialogDescription}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="py-4">{formContent}</div>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    {isReadOnly ? 'Close' : cancelLabel}
                                </Button>
                            </DialogClose>
                            {!isReadOnly && submitButtonLabel && (
                                <Button
                                    type="submit"
                                    variant={getSubmitVariant()}
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
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
            <DrawerContent>
                <form onSubmit={onSubmit}>
                    <DrawerHeader className="text-left">
                        <DrawerTitle>{dialogTitle}</DrawerTitle>
                        <DrawerDescription>
                            {dialogDescription}
                        </DrawerDescription>
                    </DrawerHeader>

                    <div className="px-4 py-2">{formContent}</div>

                    <DrawerFooter className="pt-2">
                        {!isReadOnly && submitButtonLabel && (
                            <Button
                                type="submit"
                                variant={getSubmitVariant()}
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
                        <DrawerClose asChild>
                            <Button type="button" variant="outline">
                                {isReadOnly ? 'Close' : cancelLabel}
                            </Button>
                        </DrawerClose>
                    </DrawerFooter>
                </form>
            </DrawerContent>
        </Drawer>
    );
}
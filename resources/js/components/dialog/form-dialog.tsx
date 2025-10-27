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
import { FormEventHandler, ReactNode } from 'react';

interface FormDialogProps {
    title: string;
    description: string;
    trigger?: ReactNode;
    formContent: ReactNode;
    formButton: ReactNode;
    open: boolean;
    setOpen: (open: boolean) => void;
    onSubmit?: FormEventHandler<HTMLFormElement>;

    [key: string]: unknown;
}

export default function FormDialog({
    title,
    description,
    trigger,
    formContent,
    formButton,
    open,
    setOpen,
    onSubmit,
}: FormDialogProps) {
    const isDesktop = useMediaQuery('(min-width: 640px)');

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>{trigger}</DialogTrigger>
                <DialogContent>
                    <form onSubmit={onSubmit}>
                        <DialogHeader>
                            <DialogTitle>{title}</DialogTitle>
                            <DialogDescription>{description}</DialogDescription>
                        </DialogHeader>

                        {formContent}

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">Cancel</Button>
                            </DialogClose>
                            {formButton}
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>{trigger}</DrawerTrigger>
            <DrawerContent>
                <form onSubmit={onSubmit}>
                    <DrawerHeader>
                        <DrawerTitle>{title}</DrawerTitle>
                        <DrawerDescription>{description}</DrawerDescription>
                    </DrawerHeader>

                    {formContent}

                    <DrawerFooter>
                        {formButton}
                        <DrawerClose asChild>
                            <Button type="button" variant="outline">Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </form>
            </DrawerContent>
        </Drawer>
    );
}

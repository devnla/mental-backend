import CrudDialog from '@/components/dialog/crud-dialog';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export type ViewUserDialogProps = {
    user: {
        id: number;
        name: string;
        email: string;
        email_verified_at: string | null;
        created_at: string;
        updated_at: string;
    };
    open: boolean;
    setOpen: (open: boolean) => void;
};

export default function ViewUserDialog({
    user,
    open,
    setOpen,
}: ViewUserDialogProps) {
    return (
        <CrudDialog
            mode="view"
            title={`View ${user.name}`}
            description="User details and information"
            open={open}
            setOpen={setOpen}
            formContent={
                <div className="space-y-4">
                    {/* Basic Information */}
                    <Card className="border-0 bg-slate-50 dark:bg-slate-900/30">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">
                                Basic Information
                            </CardTitle>
                            <CardDescription className="text-xs">
                                User's basic account information
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-400">
                                        Name
                                    </label>
                                    <p className="text-sm text-gray-900 dark:text-gray-100">
                                        {user.name}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-400">
                                        Email
                                    </label>
                                    <p className="truncate text-sm text-blue-600 dark:text-blue-400">
                                        {user.email}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-400">
                                        Verification Status
                                    </label>
                                    <div className="pt-1">
                                        <span
                                            className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                                                user.email_verified_at
                                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                    : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                            }`}
                                        >
                                            {user.email_verified_at
                                                ? '✓ Verified'
                                                : '◆ Not Verified'}
                                        </span>
                                    </div>
                                </div>
                                {user.email_verified_at && (
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-400">
                                            Verified At
                                        </label>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                            {new Date(
                                                user.email_verified_at,
                                            ).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Account Information */}
                    <Card className="border-0 bg-slate-50 dark:bg-slate-900/30">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">
                                Account Information
                            </CardTitle>
                            <CardDescription className="text-xs">
                                Account creation and update timestamps
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-400">
                                        Created At
                                    </label>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        {new Date(
                                            user.created_at,
                                        ).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-400">
                                        Last Updated
                                    </label>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        {new Date(
                                            user.updated_at,
                                        ).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            }
        />
    );
}

import CrudDialog from '@/components/dialog/crud-dialog';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

export type ViewCoachDialogProps = {
    coach: {
        id: number;
        coach_number: string;
        name: string;
        email: string;
        specialties?: string[];
        badges?: string[];
        language?: string;
        created_at: string;
        updated_at: string;
    };
    open: boolean;
    setOpen: (open: boolean) => void;
};

export default function ViewCoachDialog({
    coach,
    open,
    setOpen,
}: ViewCoachDialogProps) {
    return (
        <CrudDialog
            mode="view"
            title={`View ${coach.name}`}
            description="Coach details and information"
            open={open}
            setOpen={setOpen}
            formContent={
                <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                        {/* Basic Information */}
                        <Card className="border-0 bg-slate-50 dark:bg-slate-900/30">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">
                                    Basic Information
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Coach's basic account information
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-400">
                                            ID
                                        </label>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">
                                            {coach.coach_number}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-400">
                                            Name
                                        </label>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">
                                            {coach.name}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-400">
                                            Email
                                        </label>
                                        <p className="truncate text-sm text-blue-600 dark:text-blue-400">
                                            {coach.email}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-400">
                                            Language
                                        </label>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">
                                            {coach.language || '-'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Specialties & Badges */}
                        <Card className="border-0 bg-slate-50 dark:bg-slate-900/30">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">
                                    Specializations
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Coach's specialties and badges
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-400">
                                        Specialties
                                    </label>
                                    <div className="flex flex-wrap gap-1 pt-1">
                                        {coach.specialties &&
                                        coach.specialties.length > 0 ? (
                                            coach.specialties.map(
                                                (specialty, idx) => (
                                                    <Badge
                                                        key={idx}
                                                        variant="secondary"
                                                        className="text-xs"
                                                    >
                                                        {specialty}
                                                    </Badge>
                                                ),
                                            )
                                        ) : (
                                            <span className="text-sm text-muted-foreground">
                                                -
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-400">
                                        Badges
                                    </label>
                                    <div className="flex flex-wrap gap-1 pt-1">
                                        {coach.badges &&
                                        coach.badges.length > 0 ? (
                                            coach.badges.map((badge, idx) => (
                                                <Badge
                                                    key={idx}
                                                    variant="default"
                                                    className="text-xs"
                                                >
                                                    {badge}
                                                </Badge>
                                            ))
                                        ) : (
                                            <span className="text-sm text-muted-foreground">
                                                -
                                            </span>
                                        )}
                                    </div>
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
                                                coach.created_at,
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
                                                coach.updated_at,
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
                </ScrollArea>
            }
        />
    );
}

import * as React from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type Option = {
    label: string;
    value: string;
    disabled?: boolean;
};

type MultiSelectProps = {
    options: Option[];
    selected: string[];
    onChange: (values: string[]) => void;
    placeholder?: string;
    maxCount?: number;
    searchable?: boolean;
    disabled?: boolean;
    className?: string;
};

export function MultiSelect({
    options,
    selected,
    onChange,
    placeholder = 'Select options',
    maxCount = 3,
    searchable = true,
    disabled = false,
    className,
}: MultiSelectProps) {
    const [open, setOpen] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState('');

    const filteredOptions = React.useMemo(() => {
        if (!searchTerm) return options;
        return options.filter((opt) =>
            opt.label.toLowerCase().includes(searchTerm.toLowerCase()),
        );
    }, [options, searchTerm]);

    const selectedOptions = React.useMemo(() => {
        return options.filter((opt) => selected.includes(opt.value));
    }, [options, selected]);

    const visibleSelected = selectedOptions.slice(0, maxCount);
    const remainingCount = selected.length - maxCount;

    const handleUnselect = (value: string) => {
        onChange(selected.filter((s) => s !== value));
    };

    const handleSelect = (value: string) => {
        if (selected.includes(value)) {
            handleUnselect(value);
        } else {
            onChange([...selected, value]);
        }
    };

    const handleSelectAll = () => {
        if (selected.length === filteredOptions.length) {
            onChange([]);
        } else {
            onChange(filteredOptions.map((opt) => opt.value));
        }
    };

    return (
        <div className="relative">
            <div
                className={cn(
                    'flex min-h-[2.5rem] w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
                    'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
                    disabled && 'cursor-not-allowed opacity-50',
                    className,
                )}
            >
                <div className="flex flex-wrap gap-1 flex-1">
                    {visibleSelected.map((option) => (
                        <Badge
                            key={option.value}
                            variant="secondary"
                            className="mr-1"
                        >
                            {option.label}
                            <button
                                type="button"
                                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleUnselect(option.value);
                                    }
                                }}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                                onClick={() => handleUnselect(option.value)}
                                disabled={disabled}
                            >
                                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                            </button>
                        </Badge>
                    ))}
                    {remainingCount > 0 && (
                        <Badge variant="secondary" className="mr-1">
                            +{remainingCount}
                        </Badge>
                    )}
                    {selected.length === 0 && (
                        <span className="text-muted-foreground">
                            {placeholder}
                        </span>
                    )}
                </div>
                <button
                    type="button"
                    className="self-end text-muted-foreground"
                    onClick={() => !disabled && setOpen(!open)}
                    disabled={disabled}
                >
                    <svg
                        width="15"
                        height="15"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={cn(
                            'transition-transform duration-200',
                            open && 'rotate-180',
                        )}
                    >
                        <path
                            d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z"
                            fill="currentColor"
                            fillRule="evenodd"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </div>

            {open && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setOpen(false)}
                    />
                    <div className="absolute z-50 w-full mt-2 bg-popover border rounded-md shadow-md">
                        {searchable && (
                            <div className="p-2 border-b">
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                        )}
                        <div className="max-h-[300px] overflow-auto p-2">
                            {filteredOptions.length === 0 ? (
                                <div className="px-2 py-8 text-sm text-center text-muted-foreground">
                                    No results found
                                </div>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        className="w-full px-2 py-2 text-sm text-left rounded-sm hover:bg-accent"
                                        onClick={handleSelectAll}
                                    >
                                        {selected.length ===
                                        filteredOptions.length
                                            ? 'Deselect All'
                                            : 'Select All'}
                                    </button>
                                    <div className="h-px bg-border my-1" />
                                    {filteredOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            className={cn(
                                                'w-full px-2 py-2 text-sm text-left rounded-sm hover:bg-accent',
                                                selected.includes(option.value) &&
                                                    'bg-accent',
                                                option.disabled &&
                                                    'opacity-50 cursor-not-allowed',
                                            )}
                                            onClick={() =>
                                                !option.disabled &&
                                                handleSelect(option.value)
                                            }
                                            disabled={option.disabled}
                                        >
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className={cn(
                                                        'border rounded-sm w-4 h-4 flex items-center justify-center',
                                                        selected.includes(
                                                            option.value,
                                                        ) &&
                                                            'bg-primary border-primary text-primary-foreground',
                                                    )}
                                                >
                                                    {selected.includes(
                                                        option.value,
                                                    ) && (
                                                        <svg
                                                            width="10"
                                                            height="10"
                                                            viewBox="0 0 10 10"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                d="M8.33329 2.5L3.74996 7.08333L1.66663 5"
                                                                stroke="currentColor"
                                                                strokeWidth="1.5"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                    )}
                                                </div>
                                                {option.label}
                                            </div>
                                        </button>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}


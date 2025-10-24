'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { BreadcrumbItem } from '@/types';
import { router } from '@inertiajs/react';
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    PaginationState,
    SortingState,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table';
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from 'lucide-react';
import { useState } from 'react';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    pagination: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    filters: {
        search?: string;
        sort?: string;
        direction?: string;
        per_page?: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Users',
        href: '/users',
    },
];

export function DataTable<TData, TValue>({
    columns,
    data,
    pagination,
    filters,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {},
    );
    const [rowSelection, setRowSelection] = useState({});
    const [paginationState, setPaginationState] = useState<PaginationState>({
        pageIndex: pagination.current_page - 1,
        pageSize: pagination.per_page,
    });

    const table = useReactTable({
        data,
        columns,
        manualSorting: true,
        manualPagination: true,
        pageCount: pagination.last_page,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: setPaginationState,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination: paginationState,
        },
        initialState: {
            sorting: [
                {
                    id: filters.sort || 'id',
                    desc: filters.direction === 'desc',
                },
            ],
        },
    });

    // Handle server-side sorting
    const handleSortingChange = (updaterOrValue: any) => {
        setSorting(updaterOrValue);
        const newSorting =
            typeof updaterOrValue === 'function'
                ? updaterOrValue(sorting)
                : updaterOrValue;
        if (newSorting.length > 0) {
            const sort = newSorting[0];
            router.get(
                '/users',
                {
                    ...filters,
                    sort: sort.id,
                    direction: sort.desc ? 'desc' : 'asc',
                },
                { preserveState: true },
            );
        }
    };

    // Handle server-side pagination
    const handlePaginationChange = (updaterOrValue: any) => {
        const newPagination =
            typeof updaterOrValue === 'function'
                ? updaterOrValue(paginationState)
                : updaterOrValue;
        setPaginationState(newPagination);
        router.get(
            '/users',
            {
                ...filters,
                page: newPagination.pageIndex + 1,
                per_page: newPagination.pageSize,
            },
            { preserveState: true },
        );
    };

    // Handle server-side filtering
    const handleFilterChange = (columnId: string, value: string) => {
        setColumnFilters((prev) =>
            prev
                .filter((f) => f.id !== columnId)
                .concat(value ? [{ id: columnId, value }] : []),
        );
        router.get(
            '/users',
            {
                ...filters,
                search: value,
            },
            { preserveState: true },
        );
    };

    return (
        <div className="w-full space-y-4">
            {/* Search and filters */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Input
                        placeholder="Search users..."
                        value={filters.search || ''}
                        onChange={(event) =>
                            handleFilterChange('search', event.target.value)
                        }
                        className="max-w-sm border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-md border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext(),
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && 'selected'
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination controls */}
            <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {pagination.from} to {pagination.to} of{' '}
                    {pagination.total} results
                </div>
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Rows per page
                    </p>
                    <select
                        value={pagination.per_page}
                        onChange={(e) => {
                            router.get(
                                '/users',
                                {
                                    ...filters,
                                    per_page: Number(e.target.value),
                                    page: 1,
                                },
                                { preserveState: true },
                            );
                        }}
                        className="h-8 w-[70px] rounded border border-gray-300 bg-white px-3 py-1 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                    >
                        {[10, 20, 30, 40, 50].map((pageSize) => (
                            <option key={pageSize} value={pageSize}>
                                {pageSize}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Pagination buttons */}
            <div className="flex items-center justify-center space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                        router.get(
                            '/users',
                            {
                                ...filters,
                                page: 1,
                            },
                            { preserveState: true },
                        )
                    }
                    disabled={pagination.current_page === 1}
                >
                    <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                        router.get(
                            '/users',
                            {
                                ...filters,
                                page: pagination.current_page - 1,
                            },
                            { preserveState: true },
                        )
                    }
                    disabled={pagination.current_page === 1}
                >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                </Button>
                <div className="flex items-center space-x-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        Page {pagination.current_page} of {pagination.last_page}
                    </span>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                        router.get(
                            '/users',
                            {
                                ...filters,
                                page: pagination.current_page + 1,
                            },
                            { preserveState: true },
                        )
                    }
                    disabled={pagination.current_page === pagination.last_page}
                >
                    Next
                    <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                        router.get(
                            '/users',
                            {
                                ...filters,
                                page: pagination.last_page,
                            },
                            { preserveState: true },
                        )
                    }
                    disabled={pagination.current_page === pagination.last_page}
                >
                    <ChevronsRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}

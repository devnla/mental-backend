import { DataTableFilter } from '@/components/data-table/data-table-filter';
import DataTablePagination from '@/components/data-table/data-table-pagination';
import { DataTableSort } from '@/components/data-table/data-table-sort';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    Row,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';
import * as React from 'react';

interface FilterableColumn {
    value: string;
    label: string;
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    sortableColumns?: FilterableColumn[];
    show?: string;
    useFilter?: boolean;
    usePagination?: boolean;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    sortableColumns,
    show,
    useFilter = true,
    usePagination = true,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = React.useState<string>(
        show ? show : '',
    );
    const [selectedSortColumn, setSelectedSortColumn] =
        React.useState<string>('');
    const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>(
        'asc',
    );
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 20,
    });

    const fuzzyFilter = (
        row: Row<TData>,
        columnId: string,
        filterValue: string,
    ) => {
        const value = String(row.getValue(columnId)).toLowerCase();
        return value.includes(String(filterValue).toLowerCase());
    };

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        state: {
            sorting,
            globalFilter,
            pagination,
        },
        filterFns: { fuzzy: fuzzyFilter },
        globalFilterFn: fuzzyFilter,
    });

    const handleSortChange = (columnId: string, direction: 'asc' | 'desc') => {
        setSorting([{ id: columnId, desc: direction === 'desc' }]);
    };

    const clearSort = () => {
        setSorting([]);
        setSelectedSortColumn('');
    };

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            {useFilter && sortableColumns && sortableColumns.length > 0 && (
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    {/* Filter */}
                    {useFilter && (
                        <div className="flex-1">
                            <DataTableFilter
                                globalFilterValue={globalFilter}
                                handleFilterChange={setGlobalFilter}
                                clearFilter={() => setGlobalFilter('')}
                            />
                        </div>
                    )}

                    {/* Sort */}
                    {sortableColumns && sortableColumns.length > 0 && (
                        <div className="flex gap-2">
                            <DataTableSort
                                sortableColumns={sortableColumns}
                                selectedSortColumn={selectedSortColumn}
                                setSelectedSortColumn={setSelectedSortColumn}
                                sortDirection={sortDirection}
                                setSortDirection={setSortDirection}
                                handleSortChange={handleSortChange}
                                clearSort={clearSort}
                            />
                        </div>
                    )}
                </div>
            )}

            {/* Table Container */}
            <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm dark:border-gray-800">
                <Table>
                    <TableHeader className="bg-gray-50 dark:bg-gray-900/50">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow
                                key={headerGroup.id}
                                className="border-gray-200 dark:border-gray-800"
                            >
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            className="h-12 px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300"
                                        >
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
                                    className="border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900/50"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className="h-14 px-4 py-3 text-gray-900 dark:text-gray-100"
                                        >
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
                                    className="h-24 text-center text-gray-500 dark:text-gray-400"
                                >
                                    No results found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {usePagination && table.getPageCount() > 0 && (
                <DataTablePagination
                    pagination={{
                        pageIndex: pagination.pageIndex,
                        pageSize: pagination.pageSize,
                        pageCount: table.getPageCount(),
                        canPreviousPage: table.getCanPreviousPage(),
                        canNextPage: table.getCanNextPage(),
                        getPageCount: table.getPageCount,
                        getState: table.getState,
                        getFilteredRowModel: table.getFilteredRowModel,
                        setPageIndex: table.setPageIndex,
                        setPageSize: table.setPageSize,
                        previousPage: table.previousPage,
                        nextPage: table.nextPage,
                        getCanPreviousPage: table.getCanPreviousPage,
                        getCanNextPage: table.getCanNextPage,
                    }}
                />
            )}
        </div>
    );
}

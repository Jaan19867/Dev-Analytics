'use client';

import React, { useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export type Pages = {
  averageTimeSpent: number;
  bounceRate: number;
  eventPercentage: number;
  totalEvents: number;
  path: string;
  uniqueVisitors: number;
  visitorPercentage: number;
};

export const pagecolummns: ColumnDef<Pages>[] = [
  { accessorKey: 'path', header: 'Path' },
  {
    accessorKey: 'totalEvents',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="-ml-5">
          Clicks
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'eventPercentage',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="-ml-5">
          Clicks %
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: (info) => {
      const value = info.getValue<number>();
      return `${value != null ? value.toFixed(2) : 'N/A'} %`;
    },
    enableSorting: true,
  },
  {
    accessorKey: 'uniqueVisitors',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="-ml-5">
          Unique Visitors
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'visitorPercentage',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="-ml-5">
          Visitor %
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: (info) => {
      const value = info.getValue<number>();
      return `${value != null ? value.toFixed(2) : 'N/A'} %`;
    },
  },
  {
    accessorKey: 'bounceRate',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="-ml-5">
          Bounce Rate
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: (info) => {
      const value = info.getValue<number>();
      return `${value != null ? value.toFixed(2) : 'N/A'} %`;
    },
  },
  {
    accessorKey: 'averageTimeSpent',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="-ml-5">
          Avg. Time Spent
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: (info) => {
      const value = info.getValue<number>();
      return `${(value != null ? value / 1000 : 0).toFixed(2)}s`;
    },
  },
];

export type Referrers = {
  averageTimeSpent: number;
  bounceRate: number;
  referrers: string;
  uniqueVisitors: number;
  visitorPercentage: number;
};

export const colummns: ColumnDef<Referrers>[] = [
  { accessorKey: 'referrers', header: 'Referrers' },

  {
    accessorKey: 'uniqueVisitors',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="-ml-5">
          Unique Visitors
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'visitorPercentage',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="-ml-5">
          Visitor %
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: (info) => {
      const value = info.getValue<number>();
      return `${value != null ? value.toFixed(2) : 'N/A'} %`;
    },
  },
  {
    accessorKey: 'bounceRate',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="-ml-5">
          Bounce Rate
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: (info) => {
      const value = info.getValue<number>();
      return `${value != null ? value.toFixed(2) : 'N/A'} %`;
    },
  },
  {
    accessorKey: 'averageTimeSpent',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="-ml-5">
          Avg. Time Spent
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: (info) => {
      const value = info.getValue<number>();
      return `${(value != null ? value / 1000 : 0).toFixed(2)}s`;
    },
  },
];

export type Browsers = {
  averageTimeSpent: number;
  bounceRate: number;
  browser: string;
  uniqueVisitors: number;
  visitorPercentage: number;
};

export const browsercolummns: ColumnDef<Browsers>[] = [
  { accessorKey: 'browser', header: 'Browser' },

  {
    accessorKey: 'uniqueVisitors',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="-ml-5">
          Unique Visitors
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'visitorPercentage',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="-ml-5">
          Visitor %
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: (info) => {
      const value = info.getValue<number>();
      return `${value != null ? value.toFixed(2) : 'N/A'} %`;
    },
  },
  {
    accessorKey: 'bounceRate',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="-ml-5">
          Bounce Rate
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: (info) => {
      const value = info.getValue<number>();
      return `${value != null ? value.toFixed(2) : 'N/A'} %`;
    },
  },
  {
    accessorKey: 'averageTimeSpent',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="-ml-5">
          Avg. Time Spent
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: (info) => {
      const value = info.getValue<number>();
      return `${(value != null ? value / 1000 : 0).toFixed(2)}s`;
    },
  },
];

export type Os = {
  averageTimeSpent: number;
  bounceRate: number;
  operatingsystem: string;
  uniqueVisitors: number;
  visitorPercentage: number;
};

export const oscolummns: ColumnDef<Os>[] = [
  { accessorKey: 'operatingsystem', header: 'OS' },

  {
    accessorKey: 'uniqueVisitors',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="-ml-5">
          Unique Visitors
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'visitorPercentage',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="-ml-5">
          Visitor %
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: (info) => {
      const value = info.getValue<number>();
      return `${value != null ? value.toFixed(2) : 'N/A'} %`;
    },
  },
  {
    accessorKey: 'bounceRate',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="-ml-5">
          Bounce Rate
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: (info) => {
      const value = info.getValue<number>();
      return `${value != null ? value.toFixed(2) : 'N/A'} %`;
    },
  },
  {
    accessorKey: 'averageTimeSpent',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="-ml-5">
          Avg. Time Spent
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: (info) => {
      const value = info.getValue<number>();
      return `${(value != null ? value / 1000 : 0).toFixed(2)}s`;
    },
  },
];

export type Devices = {
  averageTimeSpent: number;
  bounceRate: number;
  device: string;
  uniqueVisitors: number;
  visitorPercentage: number;
};

export const devicecolummns: ColumnDef<Devices>[] = [
  { accessorKey: 'device', header: 'Device' },

  {
    accessorKey: 'uniqueVisitors',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="-ml-5">
          Unique Visitors
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'visitorPercentage',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="-ml-5">
          Visitor %
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: (info) => {
      const value = info.getValue<number>();
      return `${value != null ? value.toFixed(2) : 'N/A'} %`;
    },
  },
  {
    accessorKey: 'bounceRate',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="-ml-5">
          Bounce Rate
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: (info) => {
      const value = info.getValue<number>();
      return `${value != null ? value.toFixed(2) : 'N/A'} %`;
    },
  },
  {
    accessorKey: 'averageTimeSpent',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="-ml-5">
          Avg. Time Spent
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: (info) => {
      const value = info.getValue<number>();
      return `${(value != null ? value / 1000 : 0).toFixed(2)}s`;
    },
  },
];

export type Countries = {
  averageTimeSpent: number;
  bounceRate: number;
  country: string;
  uniqueVisitors: number;
  visitorPercentage: number;
};

export const countriescolummns: ColumnDef<Countries>[] = [
  { accessorKey: 'country', header: 'Country' },

  {
    accessorKey: 'uniqueVisitors',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="-ml-5">
          Unique Visitors
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'visitorPercentage',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="-ml-5">
          Visitor %
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: (info) => {
      const value = info.getValue<number>();
      return `${value != null ? value.toFixed(2) : 'N/A'} %`;
    },
  },
  {
    accessorKey: 'bounceRate',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="-ml-5">
          Bounce Rate
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: (info) => {
      const value = info.getValue<number>();
      return `${value != null ? value.toFixed(2) : 'N/A'} %`;
    },
  },
  {
    accessorKey: 'averageTimeSpent',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="-ml-5">
          Avg. Time Spent
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: (info) => {
      const value = info.getValue<number>();
      return `${(value != null ? value / 1000 : 0).toFixed(2)}s`;
    },
  },
];

export type Languages = {
  averageTimeSpent: number;
  bounceRate: number;
  language: string;
  uniqueVisitors: number;
  visitorPercentage: number;
};

export const languagecolummns: ColumnDef<Languages>[] = [
  { accessorKey: 'language', header: 'Language' },

  {
    accessorKey: 'uniqueVisitors',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="-ml-5">
          Unique Visitors
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'visitorPercentage',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="-ml-5">
          Visitor %
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: (info) => {
      const value = info.getValue<number>();
      return `${value != null ? value.toFixed(2) : 'N/A'} %`;
    },
  },
  {
    accessorKey: 'bounceRate',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="-ml-5">
          Bounce Rate
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: (info) => {
      const value = info.getValue<number>();
      return `${value != null ? value.toFixed(2) : 'N/A'} %`;
    },
  },
  {
    accessorKey: 'averageTimeSpent',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="-ml-5">
          Avg. Time Spent
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: (info) => {
      const value = info.getValue<number>();
      return `${(value != null ? value / 1000 : 0).toFixed(2)}s`;
    },
  },
];

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
}

export function DataTable<TData, TValue>({ columns, data, isLoading = false }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      pagination,
      sorting,
    },
  });

  return (
    <div className="flex flex-col border rounded-md min-h-[500px]">
      <div className="flex-grow overflow-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-white">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-white">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between px-4 py-4 border-t">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium text-white">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`} className='text-white'>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex w-[100px] items-center justify-center text-sm font-medium text-white">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only text-white">Go to first page</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only text-white">Go to previous page</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only text-white">Go to next page</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only text-white">Go to last page</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

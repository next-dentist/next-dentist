'use client';

import { useDebounce } from '@/hooks/useAdminDentists';
import {
  useAdminTreatments,
  useDeleteTreatment,
} from '@/hooks/useAdminTreatment';
import { TreatmentMeta } from '@prisma/client';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
} from '@tanstack/react-table';
import { format } from 'date-fns';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronsLeft,
  ChevronsRight,
  Edit,
  Eye,
  RefreshCcw,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { toast } from 'sonner';

const AdminTreatmentList: React.FC = () => {
  // State for table
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [searchInputValue, setSearchInputValue] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Ref for search input to maintain focus
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Debounce the search value
  const debouncedSearch = useDebounce(searchInputValue, 300);

  // Fetch treatments data using the hook
  const { data, isLoading, isError, refetch } = useAdminTreatments({
    page,
    limit,
    search: debouncedSearch,
    sortBy: sorting.length > 0 ? sorting[0].id : undefined,
    sortOrder:
      sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : undefined,
  });

  // Delete treatment functionality
  const { deleteTreatment } = useDeleteTreatment();

  // State for treatments
  const [treatments, setTreatments] = useState<TreatmentMeta[]>([]);

  // Update treatments when data changes
  useEffect(() => {
    if (data?.treatments) {
      setTreatments(data.treatments);
    }
  }, [data]);

  // Memoize event handlers to prevent re-renders
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchInputValue(value);
      // Reset to first page when searching
      if (value.length === 0 || value.length >= 3) {
        setPage(1);
      }
    },
    []
  );

  const handleClearSearch = useCallback(() => {
    setSearchInputValue('');
    setPage(1);
  }, []);

  const handleDeleteTreatment = useCallback((treatmentId: string) => {
    if (window.confirm('Are you sure you want to delete this treatment?')) {
      // Implement deletion logic here
      toast.success('Treatment deleted successfully');
    }
  }, []);

  // Handle status change
  const handleStatusChange = useCallback(
    (treatmentId: string, newStatus: string) => {
      // Implementation of handleStatusChange
    },
    []
  );

  // Define columns with useMemo to prevent recreation
  const columns: ColumnDef<TreatmentMeta>[] = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => (
          <div className="max-w-[100px] truncate">{row.original.id}</div>
        ),
      },
      {
        accessorKey: 'image',
        header: 'Image',
        cell: ({ row }) => (
          <div className="relative h-10 w-10 overflow-hidden rounded-full">
            {row.original.image ? (
              <Image
                src={row.original.image}
                alt={row.original.name || 'Treatment'}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-500">
                N/A
              </div>
            )}
          </div>
        ),
        enableSorting: false,
      },
      {
        accessorKey: 'name',
        header: ({ column }) => {
          return (
            <button
              className="flex items-center gap-1"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
            >
              Name
              {column.getIsSorted() === 'asc' ? (
                <ChevronUp className="ml-1 h-4 w-4" />
              ) : column.getIsSorted() === 'desc' ? (
                <ChevronDown className="ml-1 h-4 w-4" />
              ) : null}
            </button>
          );
        },
        cell: ({ row }) => <div>{row.original.name || 'N/A'}</div>,
      },
      {
        accessorKey: 'slug',
        header: 'Slug',
        cell: ({ row }) => <div>{row.original.slug || 'N/A'}</div>,
      },
      {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => (
          <div className="max-w-[200px] truncate">
            {row.original.description || 'N/A'}
          </div>
        ),
      },
      {
        accessorKey: 'dateAndTime',
        header: ({ column }) => {
          return (
            <button
              className="flex items-center gap-1"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
            >
              Created
              {column.getIsSorted() === 'asc' ? (
                <ChevronUp className="ml-1 h-4 w-4" />
              ) : column.getIsSorted() === 'desc' ? (
                <ChevronDown className="ml-1 h-4 w-4" />
              ) : null}
            </button>
          );
        },
        cell: ({ row }) => {
          return row.original.dateAndTime ? (
            <div>
              {format(new Date(row.original.dateAndTime), 'dd MMM yyyy')}
            </div>
          ) : (
            <div>N/A</div>
          );
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          return (
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/treatments/edit/${row.original.id}`}
                className="rounded-full p-2 text-blue-600 hover:bg-blue-50 hover:text-blue-800"
              >
                <Edit className="h-4 w-4" />
              </Link>
              <button
                onClick={() => handleDeleteTreatment(row.original.id)}
                className="rounded-full p-2 text-red-600 hover:bg-red-50 hover:text-red-800"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <Link
                href={`/treatments/${row.original.slug}`}
                className="rounded-full p-2 text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                target="_blank"
              >
                <Eye className="h-4 w-4" />
              </Link>
            </div>
          );
        },
      },
    ],
    [handleDeleteTreatment]
  );

  // Initialize table
  const table = useReactTable({
    data: treatments || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    manualPagination: true,
    pageCount: data?.pagination.totalPages || 0,
    state: {
      sorting,
      columnFilters,
      pagination: {
        pageIndex: page - 1,
        pageSize: limit,
      },
    },
  });

  // Memoize search feedback to prevent re-renders
  const searchFeedback = useMemo(() => {
    if (searchInputValue.length > 0 && searchInputValue.length < 3) {
      return (
        <div className="mt-1 text-xs text-gray-500">
          Type at least 3 characters to search
        </div>
      );
    }

    if (debouncedSearch.length >= 3 && isLoading) {
      return (
        <div className="mt-1 text-xs text-blue-600">
          <span className="inline-flex items-center">
            <div className="mr-2 h-3 w-3 animate-spin rounded-full border border-blue-600 border-t-transparent"></div>
            Searching for "{debouncedSearch}"...
          </span>
        </div>
      );
    }

    if (debouncedSearch.length >= 3 && !isLoading && data) {
      if (data.pagination.totalCount === 0) {
        return (
          <div className="mt-1 text-xs text-orange-600">
            No treatments found for "{debouncedSearch}"
          </div>
        );
      }
      return (
        <div className="mt-1 text-xs text-green-600">
          Found {data.pagination.totalCount} result
          {data.pagination.totalCount !== 1 ? 's' : ''} for "{debouncedSearch}"
        </div>
      );
    }

    return null;
  }, [searchInputValue, debouncedSearch, isLoading, data]);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-center text-red-600">
        Error loading treatments. Please try again later.
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white shadow">
      <div className="p-6">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">
          Manage Treatments
        </h1>

        {/* Search and Add New buttons */}
        <div className="mb-6 flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search treatments..."
                value={searchInputValue}
                onChange={handleSearchChange}
                className="w-full rounded-md border border-gray-300 py-2 pr-10 pl-10 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                ref={searchInputRef}
                key="search-treatments-input"
              />
              {searchInputValue && (
                <button
                  onClick={handleClearSearch}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              {searchFeedback}
            </div>
          </div>
          <Link
            href="/admin/treatments/add"
            className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
          >
            Add New Treatment
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    {row.getVisibleCells().map(cell => (
                      <td
                        key={cell.id}
                        className="px-6 py-4 text-sm whitespace-nowrap text-gray-500"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-4 text-center text-sm whitespace-nowrap text-gray-500"
                  >
                    No treatments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <select
              value={limit}
              onChange={e => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="rounded border border-gray-300 px-2 py-1 text-sm"
            >
              {[10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-700">
              Page {page} of {data?.pagination.totalPages || 0}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              className="rounded border border-gray-300 p-1 disabled:opacity-50"
              onClick={() => setPage(1)}
              disabled={page === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
            <button
              className="rounded border border-gray-300 p-1 disabled:opacity-50"
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              className="rounded border border-gray-300 p-1 disabled:opacity-50"
              onClick={() =>
                setPage(prev =>
                  Math.min(prev + 1, data?.pagination.totalPages || prev)
                )
              }
              disabled={page >= (data?.pagination.totalPages || 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              className="rounded border border-gray-300 p-1 disabled:opacity-50"
              onClick={() => setPage(data?.pagination.totalPages || 1)}
              disabled={page >= (data?.pagination.totalPages || 1)}
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Refresh button */}
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => refetch()}
            className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
          >
            <RefreshCcw className="mr-1 h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(AdminTreatmentList);

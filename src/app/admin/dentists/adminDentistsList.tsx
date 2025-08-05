'use client';
import DentistViewModel from '@/components/admin/DentistViewModel';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useAdminDentists,
  useDebounce,
  useUpdateDentistStatus,
} from '@/hooks/useAdminDentists';
import { Dentist } from '@prisma/client';
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
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronsLeft,
  ChevronsRight,
  Clock,
  Edit,
  RefreshCcw,
  Search,
  Trash2,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

const AdminDentistsList: React.FC = () => {
  // State for table
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [searchInputValue, setSearchInputValue] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Debounce the search value
  const debouncedSearch = useDebounce(searchInputValue, 300);

  // Fetch dentists data
  const { data, isLoading, isError, refetch } = useAdminDentists({
    page,
    limit,
    search: debouncedSearch,
    sortBy: sorting.length > 0 ? sorting[0].id : undefined,
    sortOrder:
      sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : undefined,
  });
  const [dentists, setDentists] = useState<Dentist[]>([]);

  // Add this mutation hook
  const updateStatus = useUpdateDentistStatus();

  useEffect(() => {
    if (data) {
      setDentists(data.dentists);
    }
  }, [data]);

  // Handle status change
  const handleStatusChange = (dentistId: string, newStatus: string) => {
    updateStatus.mutate(
      { dentistId, status: newStatus },
      {
        onSuccess: () => {
          toast.success('Status updated successfully');
        },
        onError: error => {
          toast.error(
            `Failed to update status: ${
              error instanceof Error ? error.message : 'Unknown error'
            }`
          );
        },
      }
    );
  };

  // Define columns
  const columns: ColumnDef<Dentist>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => (
        <div className="max-w-[100px] truncate">{row.original.id}</div>
      ),
    },
    {
      accessorKey: 'image',
      header: 'Photo',
      cell: ({ row }) => (
        <div className="relative h-10 w-10 overflow-hidden rounded-full">
          {row.original.image ? (
            <Image
              src={row.original.image}
              alt={row.original.name || 'Dentist'}
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
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
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
      accessorKey: 'email',
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Email
            {column.getIsSorted() === 'asc' ? (
              <ChevronUp className="ml-1 h-4 w-4" />
            ) : column.getIsSorted() === 'desc' ? (
              <ChevronDown className="ml-1 h-4 w-4" />
            ) : null}
          </button>
        );
      },
      cell: ({ row }) => <div>{row.original.email || 'N/A'}</div>,
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => <div>{row.original.phone || 'N/A'}</div>,
    },
    {
      accessorKey: 'speciality',
      header: 'Speciality',
      cell: ({ row }) => <div>{row.original.speciality || 'N/A'}</div>,
    },
    {
      accessorKey: 'city',
      header: 'City',
      cell: ({ row }) => <div>{row.original.city || 'N/A'}</div>,
    },
    {
      accessorKey: 'status',
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Status
            {column.getIsSorted() === 'asc' ? (
              <ChevronUp className="ml-1 h-4 w-4" />
            ) : column.getIsSorted() === 'desc' ? (
              <ChevronDown className="ml-1 h-4 w-4" />
            ) : null}
          </button>
        );
      },
      cell: ({ row }) => {
        const dentist = row.original;

        // Function to render the status display
        const renderStatusDisplay = (status: string) => {
          switch (status) {
            case 'verified':
              return (
                <span className="flex items-center text-green-600">
                  <CheckCircle className="mr-1 h-3 w-3" /> Verified
                </span>
              );
            case 'banned':
              return (
                <span className="flex items-center text-red-600">
                  <XCircle className="mr-1 h-3 w-3" /> Banned
                </span>
              );
            case 'deleted':
              return (
                <span className="flex items-center text-red-600">
                  <XCircle className="mr-1 h-3 w-3" /> Deleted
                </span>
              );
            case 'suspended':
              return (
                <span className="flex items-center text-red-600">
                  <XCircle className="mr-1 h-3 w-3" /> Suspended
                </span>
              );
            case 'closed':
              return (
                <span className="flex items-center text-red-600">
                  <XCircle className="mr-1 h-3 w-3" /> Closed
                </span>
              );
            case 'rejected':
              return (
                <span className="flex items-center text-red-600">
                  <XCircle className="mr-1 h-3 w-3" /> Rejected
                </span>
              );
            case 'pending':
            default:
              return (
                <span className="flex items-center text-yellow-600">
                  <Clock className="mr-1 h-3 w-3" /> Pending
                </span>
              );
          }
        };

        return (
          <Select
            value={dentist.status || 'pending'}
            onValueChange={value => handleStatusChange(dentist.id, value)}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue>
                {renderStatusDisplay(dentist.status || 'pending')}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">
                <span className="flex items-center text-yellow-600">
                  <Clock className="mr-1 h-3 w-3" /> Pending
                </span>
              </SelectItem>
              <SelectItem value="verified">
                <span className="flex items-center text-green-600">
                  <CheckCircle className="mr-1 h-3 w-3" /> Verified
                </span>
              </SelectItem>
              <SelectItem value="rejected">
                <span className="flex items-center text-red-600">
                  <XCircle className="mr-1 h-3 w-3" /> Rejected
                </span>
              </SelectItem>
              <SelectItem value="banned">
                <span className="flex items-center text-red-600">
                  <XCircle className="mr-1 h-3 w-3" /> Banned
                </span>
              </SelectItem>
              <SelectItem value="deleted">
                <span className="flex items-center text-red-600">
                  <XCircle className="mr-1 h-3 w-3" /> Deleted
                </span>
              </SelectItem>
              <SelectItem value="suspended">
                <span className="flex items-center text-red-600">
                  <XCircle className="mr-1 h-3 w-3" /> Suspended
                </span>
              </SelectItem>
              <SelectItem value="closed">
                <span className="flex items-center text-red-600">
                  <XCircle className="mr-1 h-3 w-3" /> Closed
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
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
        return row.original.createdAt ? (
          <div>{format(new Date(row.original.createdAt), 'dd MMM yyyy')}</div>
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
              href={`/admin/dentists/edit/${row.original.id}`}
              className="rounded-full p-2 text-blue-600 hover:bg-blue-50 hover:text-blue-800"
            >
              <Edit className="h-4 w-4" />
            </Link>
            <button
              onClick={() => handleDeleteDentist(row.original.id)}
              className="rounded-full p-2 text-red-600 hover:bg-red-50 hover:text-red-800"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <div className="rounded-full p-2 text-gray-600 hover:bg-gray-50 hover:text-gray-800">
              <DentistViewModel dentist={row.original} />
            </div>
          </div>
        );
      },
    },
  ];

  // Handle dentist deletion
  const handleDeleteDentist = (dentistId: string) => {
    if (window.confirm('Are you sure you want to delete this dentist?')) {
      // Implement deletion logic here
    }
  };

  // Filter dentists based on search query
  useEffect(() => {
    if (data && searchInputValue) {
      const filtered = data.dentists.filter(
        (dentist: Dentist) =>
          dentist.name
            ?.toLowerCase()
            .includes(searchInputValue.toLowerCase()) ||
          dentist.email
            ?.toLowerCase()
            .includes(searchInputValue.toLowerCase()) ||
          dentist.city
            ?.toLowerCase()
            .includes(searchInputValue.toLowerCase()) ||
          dentist.speciality
            ?.toLowerCase()
            .includes(searchInputValue.toLowerCase())
      );
      setDentists(filtered);
    } else if (data) {
      setDentists(data.dentists);
    }
  }, [searchInputValue, data]);

  // Initialize table
  const table = useReactTable({
    data: dentists || [],
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

  // Update the search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInputValue(e.target.value);
  };

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
        Error loading dentists. Please try again later.
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white shadow">
      <div className="p-6">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">
          Manage Dentists
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
                placeholder="Search dentists..."
                value={searchInputValue}
                onChange={handleSearchChange}
                className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {searchInputValue.length > 0 && searchInputValue.length < 3 && (
                <div className="mt-1 text-xs text-gray-500">
                  Type at least 3 characters to search
                </div>
              )}
            </div>
          </div>
          <Link
            href="/dentists/add"
            className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
          >
            Add New Dentist
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
                    No dentists found
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

export default AdminDentistsList;

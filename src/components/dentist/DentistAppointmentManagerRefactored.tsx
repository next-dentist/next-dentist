'use client';

import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  Phone,
  RefreshCcw,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  AppointmentStatus,
  useDebounce,
  useDentistAppointmentStats,
  useDentistAppointments,
  useUpdateDentistAppointmentStatus,
  type AppointmentWithRelations,
} from '../../hooks/useDentistAppointments';
import AppointmentCard from './AppointmentCard';
import AppointmentDetailDialog from './AppointmentDetailDialog';
import AppointmentFilters from './AppointmentFilters';
import AppointmentStats from './AppointmentStats';
import PendingAppointmentsSection from './PendingAppointmentsSection';

interface DentistAppointmentManagerProps {
  dentistId: string;
  viewType?: 'all' | 'today' | 'upcoming';
  showHeader?: boolean;
}

const DentistAppointmentManager: React.FC<DentistAppointmentManagerProps> = ({
  dentistId,
  viewType = 'all',
  showHeader = true,
}) => {
  // State for table
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [searchInputValue, setSearchInputValue] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentWithRelations | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'ALL'>(
    'ALL'
  );
  const [dateFromFilter, setDateFromFilter] = useState('');
  const [dateToFilter, setDateToFilter] = useState('');

  // Set date filters based on view type
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (viewType === 'today') {
      setDateFromFilter(format(today, 'yyyy-MM-dd'));
      setDateToFilter(format(today, 'yyyy-MM-dd'));
    } else if (viewType === 'upcoming') {
      setDateFromFilter(format(today, 'yyyy-MM-dd'));
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);
      setDateToFilter(format(nextWeek, 'yyyy-MM-dd'));
    }
  }, [viewType]);

  // Debounce the search value
  const debouncedSearch = useDebounce(searchInputValue, 300);

  // Fetch appointments data
  const { data, isLoading, isError, refetch } = useDentistAppointments({
    dentistId,
    page,
    limit,
    search: debouncedSearch,
    sortBy: sorting.length > 0 ? sorting[0].id : undefined,
    sortOrder:
      sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : undefined,
    status: statusFilter !== 'ALL' ? statusFilter : undefined,
    dateFrom: dateFromFilter || undefined,
    dateTo: dateToFilter || undefined,
  });

  // Fetch pending appointments separately
  const {
    data: pendingData,
    isLoading: pendingLoading,
    refetch: refetchPending,
  } = useDentistAppointments({
    dentistId,
    page: 1,
    limit: 20,
    status: AppointmentStatus.PENDING,
    sortBy: 'appointmentDate',
    sortOrder: 'asc',
  });

  // Fetch stats
  const { data: stats } = useDentistAppointmentStats(dentistId);

  const [appointments, setAppointments] = useState<AppointmentWithRelations[]>(
    []
  );

  // Mutations
  const updateStatus = useUpdateDentistAppointmentStatus();

  useEffect(() => {
    if (data) {
      setAppointments(data.appointments);
    }
  }, [data]);

  // Handle status change from dentist perspective
  const handleStatusChange = (
    appointmentId: string,
    newStatus: AppointmentStatus
  ) => {
    updateStatus.mutate(
      { appointmentId, dentistStatus: newStatus, modifiedBy: 'dentist' },
      {
        onSuccess: () => {
          toast.success('Appointment status updated successfully');
          refetch();
          refetchPending();
        },
        onError: (error: Error) => {
          toast.error(
            `Failed to update status: ${error.message || 'Unknown error'}`
          );
        },
      }
    );
  };

  // Update the search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInputValue(e.target.value);
  };

  // Define columns for table
  const columns: ColumnDef<AppointmentWithRelations>[] = [
    {
      accessorKey: 'appointmentTime',
      header: 'Time',
      cell: ({ row }) => (
        <div className="font-mono text-sm font-medium">
          {row.original.appointmentTime}
        </div>
      ),
    },
    {
      accessorKey: 'patientName',
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Patient
            {column.getIsSorted() === 'asc' ? (
              <ChevronUp className="ml-1 h-4 w-4" />
            ) : column.getIsSorted() === 'desc' ? (
              <ChevronDown className="ml-1 h-4 w-4" />
            ) : null}
          </button>
        );
      },
      cell: ({ row }) => (
        <div className="max-w-[180px]">
          <div className="font-medium">
            {row.original.patientName || 'Unknown Patient'}
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Phone className="h-3 w-3" />
            <span className="truncate">{row.original.patientPhone}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'treatmentName',
      header: 'Treatment',
      cell: ({ row }) => (
        <div className="max-w-[150px]">
          <div
            className="truncate"
            title={row.original.treatmentName || undefined}
          >
            {row.original.treatmentName || 'General consultation'}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'dentistStatus',
      header: 'Status',
      cell: ({ row }) => (
        <Select
          value={row.original.dentistStatus}
          onValueChange={(value: AppointmentStatus) =>
            handleStatusChange(row.original.id, value)
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.values(AppointmentStatus).map(status => (
              <SelectItem key={status} value={status}>
                {status.replace(/_/g, ' ').toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
    },
    {
      accessorKey: 'appointmentDate',
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Date
            {column.getIsSorted() === 'asc' ? (
              <ChevronUp className="ml-1 h-4 w-4" />
            ) : column.getIsSorted() === 'desc' ? (
              <ChevronDown className="ml-1 h-4 w-4" />
            ) : null}
          </button>
        );
      },
      cell: ({ row }) => {
        const date = new Date(row.original.appointmentDate);
        const isToday =
          format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

        return (
          <div
            className={`min-w-[100px] ${isToday ? 'font-semibold text-blue-600' : ''}`}
          >
            {format(date, 'MMM dd')}
            {isToday && <span className="ml-1 text-xs">(Today)</span>}
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-1">
            <Dialog
              open={isDialogOpen && selectedAppointment?.id === row.original.id}
              onOpenChange={open => {
                setIsDialogOpen(open);
                if (!open) setSelectedAppointment(null);
              }}
            >
              <DialogTrigger asChild>
                <button
                  onClick={() => {
                    setSelectedAppointment(row.original);
                    setIsDialogOpen(true);
                  }}
                  className="rounded-full p-2 text-blue-600 hover:bg-blue-50 hover:text-blue-800"
                  title="View Details"
                >
                  <Eye className="h-4 w-4" />
                </button>
              </DialogTrigger>
              {selectedAppointment?.id === row.original.id && (
                <AppointmentDetailDialog
                  appointment={row.original}
                  onStatusChange={handleStatusChange}
                />
              )}
            </Dialog>
            <button
              onClick={() => window.open(`tel:${row.original.patientPhone}`)}
              className="rounded-full p-2 text-green-600 hover:bg-green-50 hover:text-green-800"
              title="Call Patient"
            >
              <Phone className="h-4 w-4" />
            </button>
          </div>
        );
      },
    },
  ];

  // Initialize table
  const table = useReactTable({
    data: appointments || [],
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
        Error loading appointments. Please try again later.
      </div>
    );
  }

  const getTitle = () => {
    switch (viewType) {
      case 'today':
        return "Today's Appointments";
      case 'upcoming':
        return 'Upcoming Appointments';
      default:
        return 'All Appointments';
    }
  };

  return (
    <div className="space-y-6">
      {/* Pending Appointments Section */}
      <PendingAppointmentsSection
        pendingAppointments={pendingData?.appointments || []}
        pendingLoading={pendingLoading}
        onStatusChange={handleStatusChange}
        selectedAppointment={selectedAppointment}
        setSelectedAppointment={setSelectedAppointment}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />

      {/* Main Appointment Manager */}
      <div className="rounded-lg bg-white shadow">
        <div className="p-6">
          {showHeader && (
            <>
              <h1 className="mb-6 text-2xl font-bold text-gray-800">
                {getTitle()}
              </h1>

              {/* Statistics */}
              {stats && viewType === 'all' && (
                <AppointmentStats stats={stats} />
              )}
            </>
          )}

          {/* Filters */}
          <AppointmentFilters
            searchInputValue={searchInputValue}
            onSearchChange={handleSearchChange}
            statusFilter={statusFilter}
            onStatusFilterChange={value => setStatusFilter(value)}
            dateFromFilter={dateFromFilter}
            onDateFromChange={setDateFromFilter}
            dateToFilter={dateToFilter}
            onDateToChange={setDateToFilter}
            viewType={viewType}
          />

          {/* Conditional View: Table or Cards */}
          {viewType === 'today' ? (
            // Card View for Today's Appointments
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {table.getRowModel().rows.length > 0 ? (
                table
                  .getRowModel()
                  .rows.map(row => (
                    <AppointmentCard
                      key={row.original.id}
                      appointment={row.original}
                      onStatusChange={handleStatusChange}
                      selectedAppointment={selectedAppointment}
                      setSelectedAppointment={setSelectedAppointment}
                      isDialogOpen={isDialogOpen}
                      setIsDialogOpen={setIsDialogOpen}
                    />
                  ))
              ) : (
                <div className="col-span-1 flex min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 text-center md:col-span-2 xl:col-span-3">
                  <Calendar className="h-16 w-16 text-gray-300" />
                  <h3 className="mt-4 text-xl font-semibold text-gray-800">
                    No Appointments Today
                  </h3>
                  <p className="mt-1 text-gray-500">
                    Your schedule for today is clear. Enjoy your day!
                  </p>
                </div>
              )}
            </div>
          ) : (
            // Table View for All/Upcoming Appointments
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
                        className="px-6 py-8 text-center text-sm whitespace-nowrap text-gray-500"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <Calendar className="mb-4 h-12 w-12 text-gray-300" />
                          <p>No appointments found</p>
                          <p className="mt-1 text-xs text-gray-400">
                            No appointments match your current filters
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {data && data.pagination.total > 0 && (
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
                  {[10, 20, 30, 50].map(pageSize => (
                    <option key={pageSize} value={pageSize}>
                      Show {pageSize}
                    </option>
                  ))}
                </select>
                <span className="text-sm text-gray-700">
                  Page {page} of {data?.pagination.totalPages || 0} •{' '}
                  {data?.pagination.total} total
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
          )}

          {/* Refresh button */}
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => refetch()}
              className="flex items-center gap-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DentistAppointmentManager;

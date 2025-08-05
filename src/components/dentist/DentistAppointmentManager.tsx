'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
  AlertTriangle,
  Calendar,
  CalendarX,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronsLeft,
  ChevronsRight,
  Clock,
  Eye,
  Phone,
  RefreshCcw,
  Search,
  Stethoscope,
  User,
  UserX,
  XCircle,
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
        },
        onError: (error: Error) => {
          toast.error(
            `Failed to update status: ${error.message || 'Unknown error'}`
          );
        },
      }
    );
  };

  // Render status display with proper styling
  const renderStatusDisplay = (status: AppointmentStatus, isSmall = false) => {
    const getStatusConfig = (status: AppointmentStatus) => {
      switch (status) {
        case AppointmentStatus.APPROVED:
          return {
            icon: CheckCircle,
            color: 'text-green-600',
            bg: 'bg-green-50',
            label: 'Confirmed',
          };
        case AppointmentStatus.REJECTED:
          return {
            icon: XCircle,
            color: 'text-red-600',
            bg: 'bg-red-50',
            label: 'Declined',
          };
        case AppointmentStatus.COMPLETED:
          return {
            icon: CheckCircle,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            label: 'Completed',
          };
        case AppointmentStatus.NO_SHOW:
          return {
            icon: AlertTriangle,
            color: 'text-gray-600',
            bg: 'bg-gray-50',
            label: 'No Show',
          };
        case AppointmentStatus.CANCELLED_BY_DENTIST:
          return {
            icon: CalendarX,
            color: 'text-red-600',
            bg: 'bg-red-50',
            label: 'Cancelled',
          };
        case AppointmentStatus.CANCELLED_BY_PATIENT:
          return {
            icon: UserX,
            color: 'text-orange-600',
            bg: 'bg-orange-50',
            label: 'Patient Cancelled',
          };
        case AppointmentStatus.RESCHEDULED:
          return {
            icon: Calendar,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            label: 'Rescheduled',
          };
        case AppointmentStatus.PENDING:
        default:
          return {
            icon: Clock,
            color: 'text-yellow-600',
            bg: 'bg-yellow-50',
            label: 'Pending',
          };
      }
    };

    const { icon: Icon, color, bg, label } = getStatusConfig(status);
    const iconSize = isSmall ? 'h-3 w-3' : 'h-4 w-4';
    const textSize = isSmall ? 'text-xs' : 'text-sm';

    return (
      <span
        className={`flex items-center ${color} ${isSmall ? 'px-2 py-1' : ''} ${bg} rounded-md ${textSize}`}
      >
        <Icon className={`mr-1 ${iconSize}`} />
        {label}
      </span>
    );
  };

  // Appointment detail dialog content
  const AppointmentDetailDialog = ({
    appointment,
  }: {
    appointment: AppointmentWithRelations;
  }) => (
    <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          <span>Appointment Details</span>
        </DialogTitle>
        <DialogDescription>
          {format(new Date(appointment.appointmentDate), 'EEEE, MMMM dd, yyyy')}{' '}
          at {appointment.appointmentTime}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        {/* Status and Quick Actions */}
        <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
          <div>
            <h3 className="mb-2 font-semibold text-gray-900">Current Status</h3>
            {renderStatusDisplay(appointment.dentistStatus)}
          </div>
          <div className="flex gap-2">
            <Select
              value={appointment.dentistStatus}
              onValueChange={(value: AppointmentStatus) =>
                handleStatusChange(appointment.id, value)
              }
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">
                  <span className="flex items-center text-yellow-600">
                    <Clock className="mr-1 h-3 w-3" /> Pending
                  </span>
                </SelectItem>
                <SelectItem value="APPROVED">
                  <span className="flex items-center text-green-600">
                    <CheckCircle className="mr-1 h-3 w-3" /> Confirm
                  </span>
                </SelectItem>
                <SelectItem value="REJECTED">
                  <span className="flex items-center text-red-600">
                    <XCircle className="mr-1 h-3 w-3" /> Decline
                  </span>
                </SelectItem>
                <SelectItem value="COMPLETED">
                  <span className="flex items-center text-blue-600">
                    <CheckCircle className="mr-1 h-3 w-3" /> Completed
                  </span>
                </SelectItem>
                <SelectItem value="NO_SHOW">
                  <span className="flex items-center text-gray-600">
                    <AlertTriangle className="mr-1 h-3 w-3" /> No Show
                  </span>
                </SelectItem>
                <SelectItem value="CANCELLED_BY_DENTIST">
                  <span className="flex items-center text-red-600">
                    <CalendarX className="mr-1 h-3 w-3" /> Cancel
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Patient Information */}
        <div className="rounded-lg border bg-white p-4">
          <h3 className="mb-3 font-semibold text-gray-900">
            Patient Information
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-600">Name</label>
              <p className="text-lg font-medium text-gray-900">
                {appointment.patientName || 'Not provided'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Phone</label>
              <div className="flex items-center gap-2">
                <p className="text-gray-900">{appointment.patientPhone}</p>
                <button
                  onClick={() => window.open(`tel:${appointment.patientPhone}`)}
                  className="rounded p-1 text-blue-600 hover:bg-blue-50"
                  title="Call patient"
                >
                  <Phone className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="text-gray-900">
                {appointment.patientEmail || 'Not provided'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Age & Gender
              </label>
              <p className="text-gray-900">
                {appointment.patientAge
                  ? `${appointment.patientAge} years`
                  : 'Not provided'}
                {appointment.gender && ` • ${appointment.gender}`}
              </p>
            </div>
          </div>
        </div>

        {/* Treatment Information */}
        <div className="rounded-lg border bg-white p-4">
          <h3 className="mb-3 font-semibold text-gray-900">
            Treatment Details
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-600">
                Treatment Type
              </label>
              <p className="text-gray-900">
                {appointment.treatmentName || 'General consultation'}
              </p>
            </div>
            {appointment.otherInfo && (
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Additional Notes
                </label>
                <div className="mt-1 rounded-md bg-gray-50 p-3">
                  <p className="whitespace-pre-wrap text-gray-700">
                    {appointment.otherInfo}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Appointment History */}
        <div className="rounded-lg border bg-white p-4">
          <h3 className="mb-3 font-semibold text-gray-900">
            Appointment History
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Created:</span>
              <span className="text-gray-900">
                {format(new Date(appointment.createdAt), 'PPP')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Updated:</span>
              <span className="text-gray-900">
                {format(new Date(appointment.updatedAt), 'PPP')}
              </span>
            </div>
            {appointment.lastModifiedBy && (
              <div className="flex justify-between">
                <span className="text-gray-600">Last Modified By:</span>
                <span className="text-gray-900 capitalize">
                  {appointment.lastModifiedBy}
                </span>
              </div>
            )}
            {appointment.statusReason && (
              <div className="mt-3">
                <span className="text-gray-600">Status Reason:</span>
                <p className="mt-1 text-gray-900">{appointment.statusReason}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DialogContent>
  );

  // Define columns
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
            <SelectValue>
              {renderStatusDisplay(row.original.dentistStatus, true)}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PENDING">
              <span className="flex items-center text-yellow-600">
                <Clock className="mr-1 h-3 w-3" /> Pending
              </span>
            </SelectItem>
            <SelectItem value="APPROVED">
              <span className="flex items-center text-green-600">
                <CheckCircle className="mr-1 h-3 w-3" /> Confirm
              </span>
            </SelectItem>
            <SelectItem value="REJECTED">
              <span className="flex items-center text-red-600">
                <XCircle className="mr-1 h-3 w-3" /> Decline
              </span>
            </SelectItem>
            <SelectItem value="COMPLETED">
              <span className="flex items-center text-blue-600">
                <CheckCircle className="mr-1 h-3 w-3" /> Completed
              </span>
            </SelectItem>
            <SelectItem value="NO_SHOW">
              <span className="flex items-center text-gray-600">
                <AlertTriangle className="mr-1 h-3 w-3" /> No Show
              </span>
            </SelectItem>
            <SelectItem value="CANCELLED_BY_DENTIST">
              <span className="flex items-center text-red-600">
                <CalendarX className="mr-1 h-3 w-3" /> Cancel
              </span>
            </SelectItem>
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
                <AppointmentDetailDialog appointment={row.original} />
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

  // Update the search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInputValue(e.target.value);
  };

  // PendingAppointmentCard component with quick actions
  const PendingAppointmentCard = ({
    appointment,
  }: {
    appointment: AppointmentWithRelations;
  }) => (
    <div className="flex flex-col overflow-hidden rounded-lg border border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      <div className="flex items-center justify-between border-b border-yellow-200 bg-gradient-to-r from-yellow-100 to-orange-100 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500 text-white shadow-md">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">
              {appointment.patientName || 'Unknown Patient'}
            </h3>
            <p className="flex items-center gap-1.5 text-sm text-gray-600">
              <Calendar size={14} />
              <span>
                {format(new Date(appointment.appointmentDate), 'MMM dd, yyyy')}
              </span>
              <Clock size={14} className="ml-2" />
              <span className="font-mono">{appointment.appointmentTime}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-yellow-500 px-2.5 py-0.5 text-xs font-semibold text-white">
            PENDING
          </span>
          <Dialog
            open={isDialogOpen && selectedAppointment?.id === appointment.id}
            onOpenChange={open => {
              setIsDialogOpen(open);
              if (!open) setSelectedAppointment(null);
            }}
          >
            <DialogTrigger asChild>
              <button
                onClick={() => {
                  setSelectedAppointment(appointment);
                  setIsDialogOpen(true);
                }}
                className="rounded-full p-2 text-gray-600 transition-colors hover:bg-white hover:text-blue-700"
                title="View Details"
              >
                <Eye className="h-4 w-4" />
              </button>
            </DialogTrigger>
            {selectedAppointment?.id === appointment.id && (
              <AppointmentDetailDialog appointment={appointment} />
            )}
          </Dialog>
        </div>
      </div>
      <div className="flex-grow space-y-3 p-4">
        <div>
          <label className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
            Treatment
          </label>
          <p className="font-medium text-gray-700">
            {appointment.treatmentName || 'General consultation'}
          </p>
        </div>
        <div>
          <label className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
            Contact
          </label>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gray-500" />
            <a
              href={`tel:${appointment.patientPhone}`}
              className="font-medium text-blue-600 hover:underline"
            >
              {appointment.patientPhone}
            </a>
          </div>
        </div>
        {appointment.otherInfo && (
          <div>
            <label className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
              Notes
            </label>
            <p className="mt-1 rounded-md border border-yellow-100 bg-white/70 p-3 text-sm text-gray-700">
              {appointment.otherInfo}
            </p>
          </div>
        )}
      </div>
      <div className="mt-auto border-t border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 p-4">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() =>
              handleStatusChange(appointment.id, AppointmentStatus.APPROVED)
            }
            className="flex items-center justify-center gap-2 rounded-lg bg-green-500 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-600"
          >
            <CheckCircle className="h-4 w-4" />
            Confirm
          </button>
          <button
            onClick={() =>
              handleStatusChange(appointment.id, AppointmentStatus.REJECTED)
            }
            className="flex items-center justify-center gap-2 rounded-lg bg-red-500 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-600"
          >
            <XCircle className="h-4 w-4" />
            Decline
          </button>
          <button
            onClick={() =>
              handleStatusChange(
                appointment.id,
                AppointmentStatus.CANCELLED_BY_DENTIST
              )
            }
            className="flex items-center justify-center gap-2 rounded-lg bg-gray-500 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-600"
          >
            <CalendarX className="h-4 w-4" />
            Cancel
          </button>
          <button
            onClick={() =>
              handleStatusChange(appointment.id, AppointmentStatus.RESCHEDULED)
            }
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-500 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
          >
            <RefreshCcw className="h-4 w-4" />
            Reschedule
          </button>
        </div>
      </div>
    </div>
  );

  // Card component for a single appointment (for mobile-friendly 'today' view)
  const AppointmentCard = ({
    appointment,
  }: {
    appointment: AppointmentWithRelations;
  }) => (
    <div className="flex flex-col overflow-hidden rounded-lg bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl">
      <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">
              {appointment.patientName || 'Unknown Patient'}
            </h3>
            <p className="flex items-center gap-1.5 text-sm text-gray-500">
              <Clock size={14} />
              <span className="font-mono">{appointment.appointmentTime}</span>
            </p>
          </div>
        </div>
        <Dialog
          open={isDialogOpen && selectedAppointment?.id === appointment.id}
          onOpenChange={open => {
            setIsDialogOpen(open);
            if (!open) setSelectedAppointment(null);
          }}
        >
          <DialogTrigger asChild>
            <button
              onClick={() => {
                setSelectedAppointment(appointment);
                setIsDialogOpen(true);
              }}
              className="rounded-full p-2 text-gray-500 hover:bg-gray-200 hover:text-blue-700"
              title="View Details"
            >
              <Eye className="h-5 w-5" />
            </button>
          </DialogTrigger>
          {selectedAppointment?.id === appointment.id && (
            <AppointmentDetailDialog appointment={appointment} />
          )}
        </Dialog>
      </div>
      <div className="flex-grow space-y-4 p-4">
        <div>
          <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
            Treatment
          </label>
          <p className="font-medium text-gray-700">
            {appointment.treatmentName || 'General consultation'}
          </p>
        </div>
        <div>
          <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
            Contact
          </label>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gray-400" />
            <a
              href={`tel:${appointment.patientPhone}`}
              className="text-blue-600 hover:underline"
            >
              {appointment.patientPhone}
            </a>
          </div>
        </div>
        {appointment.otherInfo && (
          <div>
            <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
              Notes
            </label>
            <p className="mt-1 rounded-md bg-gray-50 p-2 text-sm text-gray-600">
              {appointment.otherInfo}
            </p>
          </div>
        )}
      </div>
      <div className="mt-auto border-t border-gray-200 bg-gray-50 p-3">
        <Select
          value={appointment.dentistStatus}
          onValueChange={(value: AppointmentStatus) =>
            handleStatusChange(appointment.id, value)
          }
        >
          <SelectTrigger className="w-full bg-white">
            <SelectValue>
              {renderStatusDisplay(appointment.dentistStatus, true)}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PENDING">
              <span className="flex items-center text-yellow-600">
                <Clock className="mr-1 h-3 w-3" /> Pending
              </span>
            </SelectItem>
            <SelectItem value="APPROVED">
              <span className="flex items-center text-green-600">
                <CheckCircle className="mr-1 h-3 w-3" /> Confirm
              </span>
            </SelectItem>
            <SelectItem value="COMPLETED">
              <span className="flex items-center text-blue-600">
                <CheckCircle className="mr-1 h-3 w-3" /> Completed
              </span>
            </SelectItem>
            <SelectItem value="NO_SHOW">
              <span className="flex items-center text-gray-600">
                <AlertTriangle className="mr-1 h-3 w-3" /> No Show
              </span>
            </SelectItem>
            <SelectItem value="CANCELLED_BY_DENTIST">
              <span className="flex items-center text-red-600">
                <CalendarX className="mr-1 h-3 w-3" /> Cancel
              </span>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

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
      {pendingData && pendingData.appointments.length > 0 && (
        <div className="rounded-lg border border-yellow-200 bg-gradient-to-r from-yellow-100 via-orange-100 to-yellow-100 shadow-lg">
          <div className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
                Pending Appointments Requiring Action
              </h2>
              <span className="inline-flex items-center rounded-full bg-yellow-500 px-3 py-1 text-sm font-semibold text-white">
                {pendingData.appointments.length} pending
              </span>
            </div>
            {pendingLoading ? (
              <div className="flex justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-b-2 border-yellow-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {pendingData.appointments.map(appointment => (
                  <PendingAppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

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
                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
                  <div className="rounded-lg bg-blue-50 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-blue-600">Total</p>
                        <p className="text-2xl font-bold text-blue-900">
                          {stats.total || 0}
                        </p>
                      </div>
                      <Calendar className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  <div className="rounded-lg bg-yellow-50 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-yellow-600">Pending</p>
                        <p className="text-2xl font-bold text-yellow-900">
                          {stats.pending || 0}
                        </p>
                      </div>
                      <Clock className="h-8 w-8 text-yellow-600" />
                    </div>
                  </div>
                  <div className="rounded-lg bg-green-50 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-600">Confirmed</p>
                        <p className="text-2xl font-bold text-green-900">
                          {stats.approved || 0}
                        </p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                  <div className="rounded-lg bg-purple-50 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-purple-600">Today</p>
                        <p className="text-2xl font-bold text-purple-900">
                          {stats.todayAppointments || 0}
                        </p>
                      </div>
                      <Stethoscope className="h-8 w-8 text-purple-600" />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Filters */}
          <div className="mb-6 space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchInputValue}
                  onChange={handleSearchChange}
                  className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={value =>
                  setStatusFilter(value as AppointmentStatus | 'ALL')
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="APPROVED">Confirmed</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="REJECTED">Declined</SelectItem>
                  <SelectItem value="NO_SHOW">No Show</SelectItem>
                  <SelectItem value="CANCELLED_BY_DENTIST">
                    Cancelled
                  </SelectItem>
                </SelectContent>
              </Select>
              {viewType === 'all' && (
                <>
                  <input
                    type="date"
                    placeholder="From Date"
                    value={dateFromFilter}
                    onChange={e => setDateFromFilter(e.target.value)}
                    className="rounded-md border border-gray-300 px-3 py-2"
                  />
                  <input
                    type="date"
                    placeholder="To Date"
                    value={dateToFilter}
                    onChange={e => setDateToFilter(e.target.value)}
                    className="rounded-md border border-gray-300 px-3 py-2"
                  />
                </>
              )}
            </div>
          </div>

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

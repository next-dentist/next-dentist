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
  AppointmentStatus,
  useAdminAppointments,
  useAppointmentStats,
  useDebounce,
  useDeleteAppointment,
  useRescheduleAppointment,
  useUpdateAppointmentStatus,
  type AppointmentWithRelations,
} from '@/hooks/useAdminAppointments';
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
  Edit,
  Eye,
  Phone,
  RefreshCcw,
  Search,
  Trash2,
  UserX,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

const AdminAppointmentManager: React.FC = () => {
  // State for table
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [searchInputValue, setSearchInputValue] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentWithRelations | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'ALL'>(
    'ALL'
  );
  const [dentistStatusFilter, setDentistStatusFilter] = useState<
    AppointmentStatus | 'ALL'
  >('ALL');
  const [patientStatusFilter, setPatientStatusFilter] = useState<
    AppointmentStatus | 'ALL'
  >('ALL');
  const [dateFromFilter, setDateFromFilter] = useState('');
  const [dateToFilter, setDateToFilter] = useState('');

  // Reschedule form state
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [rescheduleReason, setRescheduleReason] = useState('');

  // Debounce the search value
  const debouncedSearch = useDebounce(searchInputValue, 300);

  // Fetch appointments data
  const { data, isLoading, isError, refetch } = useAdminAppointments({
    page,
    limit,
    search: debouncedSearch,
    sortBy: sorting.length > 0 ? sorting[0].id : undefined,
    sortOrder:
      sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : undefined,
    status: statusFilter !== 'ALL' ? statusFilter : undefined,
    dentistStatus:
      dentistStatusFilter !== 'ALL' ? dentistStatusFilter : undefined,
    patientStatus:
      patientStatusFilter !== 'ALL' ? patientStatusFilter : undefined,
    dateFrom: dateFromFilter || undefined,
    dateTo: dateToFilter || undefined,
  });

  // Fetch stats
  const { data: stats } = useAppointmentStats();

  const [appointments, setAppointments] = useState<AppointmentWithRelations[]>(
    []
  );

  // Mutations
  const updateStatus = useUpdateAppointmentStatus();
  const deleteAppointment = useDeleteAppointment();
  const rescheduleAppointment = useRescheduleAppointment();

  useEffect(() => {
    if (data) {
      setAppointments(data.appointments);
    }
  }, [data]);

  // Handle status change
  const handleStatusChange = (
    appointmentId: string,
    status: AppointmentStatus,
    type: 'general' | 'dentist' | 'patient' = 'general'
  ) => {
    const updateParams = {
      appointmentId,
      status: type === 'general' ? status : AppointmentStatus.PENDING,
      dentistStatus: type === 'dentist' ? status : undefined,
      patientStatus: type === 'patient' ? status : undefined,
      modifiedBy: 'admin' as const,
    };

    updateStatus.mutate(updateParams, {
      onSuccess: () => {
        toast.success('Appointment status updated successfully');
      },
      onError: error => {
        toast.error(
          `Failed to update status: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`
        );
      },
    });
  };

  // Handle appointment deletion
  const handleDeleteAppointment = (appointmentId: string) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      deleteAppointment.mutate(appointmentId, {
        onSuccess: () => {
          toast.success('Appointment deleted successfully');
        },
        onError: error => {
          toast.error(
            `Failed to delete appointment: ${
              error instanceof Error ? error.message : 'Unknown error'
            }`
          );
        },
      });
    }
  };

  // Handle appointment reschedule
  const handleReschedule = () => {
    if (!selectedAppointment || !rescheduleDate || !rescheduleTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    rescheduleAppointment.mutate(
      {
        appointmentId: selectedAppointment.id,
        newDate: rescheduleDate,
        newTime: rescheduleTime,
        reason: rescheduleReason,
      },
      {
        onSuccess: () => {
          toast.success('Appointment rescheduled successfully');
          setIsRescheduleDialogOpen(false);
          setRescheduleDate('');
          setRescheduleTime('');
          setRescheduleReason('');
        },
        onError: error => {
          toast.error(
            `Failed to reschedule appointment: ${
              error instanceof Error ? error.message : 'Unknown error'
            }`
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
            label: 'Approved',
          };
        case AppointmentStatus.REJECTED:
          return {
            icon: XCircle,
            color: 'text-red-600',
            bg: 'bg-red-50',
            label: 'Rejected',
          };
        case AppointmentStatus.CANCELLED_BY_PATIENT:
          return {
            icon: UserX,
            color: 'text-orange-600',
            bg: 'bg-orange-50',
            label: 'Patient Cancelled',
          };
        case AppointmentStatus.CANCELLED_BY_DENTIST:
          return {
            icon: CalendarX,
            color: 'text-red-600',
            bg: 'bg-red-50',
            label: 'Dentist Cancelled',
          };
        case AppointmentStatus.RESCHEDULED:
          return {
            icon: Calendar,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            label: 'Rescheduled',
          };
        case AppointmentStatus.COMPLETED:
          return {
            icon: CheckCircle,
            color: 'text-green-600',
            bg: 'bg-green-50',
            label: 'Completed',
          };
        case AppointmentStatus.NO_SHOW:
          return {
            icon: AlertTriangle,
            color: 'text-gray-600',
            bg: 'bg-gray-50',
            label: 'No Show',
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
    <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          <span>Appointment Details - #{appointment.id.slice(-8)}</span>
        </DialogTitle>
        <DialogDescription>
          Scheduled for {format(new Date(appointment.appointmentDate), 'PPP')}{' '}
          at {appointment.appointmentTime}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        {/* Status Overview */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-gray-50 p-4">
            <h3 className="mb-2 font-semibold text-gray-900">Overall Status</h3>
            {renderStatusDisplay(appointment.status)}
          </div>
          <div className="rounded-lg bg-blue-50 p-4">
            <h3 className="mb-2 font-semibold text-gray-900">Dentist Status</h3>
            {renderStatusDisplay(appointment.dentistStatus)}
          </div>
          <div className="rounded-lg bg-green-50 p-4">
            <h3 className="mb-2 font-semibold text-gray-900">Patient Status</h3>
            {renderStatusDisplay(appointment.patientStatus)}
          </div>
        </div>

        {/* Patient Information */}
        <div className="rounded-lg bg-gray-50 p-4">
          <h3 className="mb-3 font-semibold text-gray-900">
            Patient Information
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-600">Name</label>
              <p className="text-gray-900">
                {appointment.patientName || 'Not provided'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Phone</label>
              <p className="text-gray-900">{appointment.patientPhone}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="text-gray-900">
                {appointment.patientEmail || 'Not provided'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Age</label>
              <p className="text-gray-900">
                {appointment.patientAge || 'Not provided'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Gender
              </label>
              <p className="text-gray-900">
                {appointment.gender || 'Not specified'}
              </p>
            </div>
            {appointment.user && (
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Registered User
                </label>
                <p className="text-gray-900">
                  {appointment.user.name} ({appointment.user.email})
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Dentist Information */}
        <div className="rounded-lg bg-blue-50 p-4">
          <h3 className="mb-3 font-semibold text-gray-900">
            Dentist Information
          </h3>
          <div className="flex items-center gap-3">
            {appointment.dentist.image && (
              <div className="relative h-12 w-12 overflow-hidden rounded-full">
                <Image
                  src={appointment.dentist.image}
                  alt={appointment.dentist.name || 'Dentist'}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <p className="font-medium text-gray-900">
                {appointment.dentist.name}
              </p>
              <p className="text-sm text-gray-600">
                {appointment.dentist.email}
              </p>
              {appointment.dentist.phone && (
                <p className="text-sm text-gray-600">
                  {appointment.dentist.phone}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Treatment and Additional Info */}
        <div className="space-y-4">
          {appointment.treatmentName && (
            <div>
              <h3 className="mb-2 font-semibold text-gray-900">Treatment</h3>
              <p className="text-gray-700">{appointment.treatmentName}</p>
            </div>
          )}

          {appointment.otherInfo && (
            <div>
              <h3 className="mb-2 font-semibold text-gray-900">
                Additional Information
              </h3>
              <div className="rounded-lg border bg-white p-4">
                <p className="leading-relaxed whitespace-pre-wrap text-gray-700">
                  {appointment.otherInfo}
                </p>
              </div>
            </div>
          )}

          {appointment.statusReason && (
            <div>
              <h3 className="mb-2 font-semibold text-gray-900">
                Status Reason
              </h3>
              <div className="rounded-lg border bg-white p-4">
                <p className="leading-relaxed whitespace-pre-wrap text-gray-700">
                  {appointment.statusReason}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Status Management */}
        <div className="border-t pt-4">
          <h3 className="mb-4 font-semibold text-gray-900">Manage Status</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Overall Status
              </label>
              <Select
                value={appointment.status}
                onValueChange={(value: AppointmentStatus) =>
                  handleStatusChange(appointment.id, value, 'general')
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(AppointmentStatus).map(status => (
                    <SelectItem key={status} value={status}>
                      {renderStatusDisplay(status, true)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Dentist Status
              </label>
              <Select
                value={appointment.dentistStatus}
                onValueChange={(value: AppointmentStatus) =>
                  handleStatusChange(appointment.id, value, 'dentist')
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(AppointmentStatus).map(status => (
                    <SelectItem key={status} value={status}>
                      {renderStatusDisplay(status, true)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Patient Status
              </label>
              <Select
                value={appointment.patientStatus}
                onValueChange={(value: AppointmentStatus) =>
                  handleStatusChange(appointment.id, value, 'patient')
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(AppointmentStatus).map(status => (
                    <SelectItem key={status} value={status}>
                      {renderStatusDisplay(status, true)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );

  // Reschedule Dialog
  const RescheduleDialog = () => (
    <Dialog
      open={isRescheduleDialogOpen}
      onOpenChange={setIsRescheduleDialogOpen}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reschedule Appointment</DialogTitle>
          <DialogDescription>
            Reschedule appointment for {selectedAppointment?.patientName}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">New Date</label>
            <input
              type="date"
              value={rescheduleDate}
              onChange={e => setRescheduleDate(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">New Time</label>
            <input
              type="time"
              value={rescheduleTime}
              onChange={e => setRescheduleTime(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">
              Reason (Optional)
            </label>
            <textarea
              value={rescheduleReason}
              onChange={e => setRescheduleReason(e.target.value)}
              placeholder="Reason for rescheduling..."
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsRescheduleDialogOpen(false)}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleReschedule}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            >
              Reschedule
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  // Define columns
  const columns: ColumnDef<AppointmentWithRelations>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => (
        <div className="max-w-[100px] truncate font-mono text-xs">
          #{row.original.id.slice(-8)}
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
        <div className="max-w-[150px]">
          <div className="font-medium">
            {row.original.patientName || 'Unknown'}
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Phone className="h-3 w-3" />
            <span className="truncate">{row.original.patientPhone}</span>
          </div>
          {row.original.patientEmail && (
            <div className="truncate text-sm text-gray-500">
              {row.original.patientEmail}
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'dentist',
      header: 'Dentist',
      cell: ({ row }) => (
        <div className="flex max-w-[200px] items-center gap-2">
          {row.original.dentist.image && (
            <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full">
              <Image
                src={row.original.dentist.image}
                alt={row.original.dentist.name || 'Dentist'}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="truncate font-medium">
              {row.original.dentist.name || 'Unknown'}
            </div>
            <div className="truncate text-sm text-gray-500">
              {row.original.dentist.email}
            </div>
          </div>
        </div>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'appointmentDate',
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Date & Time
            {column.getIsSorted() === 'asc' ? (
              <ChevronUp className="ml-1 h-4 w-4" />
            ) : column.getIsSorted() === 'desc' ? (
              <ChevronDown className="ml-1 h-4 w-4" />
            ) : null}
          </button>
        );
      },
      cell: ({ row }) => (
        <div className="min-w-[120px]">
          <div className="font-medium">
            {format(new Date(row.original.appointmentDate), 'MMM dd, yyyy')}
          </div>
          <div className="text-sm text-gray-500">
            {row.original.appointmentTime}
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
      enableSorting: false,
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
      cell: ({ row }) => renderStatusDisplay(row.original.status),
    },
    {
      accessorKey: 'dentistStatus',
      header: 'Dentist View',
      cell: ({ row }) => renderStatusDisplay(row.original.dentistStatus, true),
    },
    {
      accessorKey: 'patientStatus',
      header: 'Patient View',
      cell: ({ row }) => renderStatusDisplay(row.original.patientStatus, true),
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
              onClick={() => {
                setSelectedAppointment(row.original);
                setRescheduleDate(
                  format(new Date(row.original.appointmentDate), 'yyyy-MM-dd')
                );
                setRescheduleTime(row.original.appointmentTime);
                setIsRescheduleDialogOpen(true);
              }}
              className="rounded-full p-2 text-green-600 hover:bg-green-50 hover:text-green-800"
              title="Reschedule"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDeleteAppointment(row.original.id)}
              className="rounded-full p-2 text-red-600 hover:bg-red-50 hover:text-red-800"
              title="Delete Appointment"
            >
              <Trash2 className="h-4 w-4" />
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

  return (
    <div className="rounded-lg bg-white shadow">
      <div className="p-6">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">
          Manage Appointments
        </h1>

        {/* Statistics */}
        {stats && (
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
            <div className="rounded-lg bg-green-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600">Approved</p>
                  <p className="text-2xl font-bold text-green-900">
                    {stats.approved || 0}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
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
            <div className="rounded-lg bg-red-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-600">Cancelled</p>
                  <p className="text-2xl font-bold text-red-900">
                    {stats.cancelled || 0}
                  </p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search appointments..."
                value={searchInputValue}
                onChange={handleSearchChange}
                className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                {Object.values(AppointmentStatus).map(status => (
                  <SelectItem key={status} value={status}>
                    {status.replace(/_/g, ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={dentistStatusFilter}
              onValueChange={setDentistStatusFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Dentist Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Dentist Status</SelectItem>
                {Object.values(AppointmentStatus).map(status => (
                  <SelectItem key={status} value={status}>
                    {status.replace(/_/g, ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
          </div>
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
                    No appointments found
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

      {/* Reschedule Dialog */}
      <RescheduleDialog />
    </div>
  );
};

export default AdminAppointmentManager;

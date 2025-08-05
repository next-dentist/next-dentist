'use client';

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import {
  AlertTriangle,
  Calendar,
  CalendarX,
  CheckCircle,
  Clock,
  Phone,
  XCircle,
} from 'lucide-react';
import React from 'react';
import {
  AppointmentStatus,
  type AppointmentWithRelations,
} from '../../hooks/useDentistAppointments';

interface AppointmentDetailDialogProps {
  appointment: AppointmentWithRelations;
  onStatusChange: (appointmentId: string, newStatus: AppointmentStatus) => void;
}

const AppointmentDetailDialog: React.FC<AppointmentDetailDialogProps> = ({
  appointment,
  onStatusChange,
}) => {
  // Render status display with proper styling
  const renderStatusDisplay = (status: AppointmentStatus) => {
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
            icon: XCircle,
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

    return (
      <span
        className={`flex items-center ${color} ${bg} rounded-md px-2 py-1 text-sm`}
      >
        <Icon className="mr-1 h-4 w-4" />
        {label}
      </span>
    );
  };

  return (
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
                onStatusChange(appointment.id, value)
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
};

export default AppointmentDetailDialog;

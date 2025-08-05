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
  AlertTriangle,
  CalendarX,
  CheckCircle,
  Clock,
  Eye,
  Phone,
  User,
  XCircle,
} from 'lucide-react';
import React from 'react';
import {
  AppointmentStatus,
  type AppointmentWithRelations,
} from '../../hooks/useDentistAppointments';
import AppointmentDetailDialog from './AppointmentDetailDialog';

interface AppointmentCardProps {
  appointment: AppointmentWithRelations;
  onStatusChange: (appointmentId: string, newStatus: AppointmentStatus) => void;
  selectedAppointment: AppointmentWithRelations | null;
  setSelectedAppointment: (
    appointment: AppointmentWithRelations | null
  ) => void;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onStatusChange,
  selectedAppointment,
  setSelectedAppointment,
  isDialogOpen,
  setIsDialogOpen,
}) => {
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
            icon: XCircle,
            color: 'text-orange-600',
            bg: 'bg-orange-50',
            label: 'Patient Cancelled',
          };
        case AppointmentStatus.RESCHEDULED:
          return {
            icon: Clock,
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

  return (
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
            <AppointmentDetailDialog
              appointment={appointment}
              onStatusChange={onStatusChange}
            />
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
            onStatusChange(appointment.id, value)
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
};

export default AppointmentCard;

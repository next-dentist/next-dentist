'use client';

import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { format } from 'date-fns';
import {
  Calendar,
  CalendarX,
  CheckCircle,
  Clock,
  Eye,
  Phone,
  RefreshCcw,
  XCircle,
} from 'lucide-react';
import React from 'react';
import {
  AppointmentStatus,
  type AppointmentWithRelations,
} from '../../hooks/useDentistAppointments';
import AppointmentDetailDialog from './AppointmentDetailDialog';

interface PendingAppointmentCardProps {
  appointment: AppointmentWithRelations;
  onStatusChange: (appointmentId: string, newStatus: AppointmentStatus) => void;
  selectedAppointment: AppointmentWithRelations | null;
  setSelectedAppointment: (
    appointment: AppointmentWithRelations | null
  ) => void;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
}

const PendingAppointmentCard: React.FC<PendingAppointmentCardProps> = ({
  appointment,
  onStatusChange,
  selectedAppointment,
  setSelectedAppointment,
  isDialogOpen,
  setIsDialogOpen,
}) => {
  return (
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
              <AppointmentDetailDialog
                appointment={appointment}
                onStatusChange={onStatusChange}
              />
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
              onStatusChange(appointment.id, AppointmentStatus.APPROVED)
            }
            className="flex items-center justify-center gap-2 rounded-lg bg-green-500 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-600"
          >
            <CheckCircle className="h-4 w-4" />
            Confirm
          </button>
          <button
            onClick={() =>
              onStatusChange(appointment.id, AppointmentStatus.REJECTED)
            }
            className="flex items-center justify-center gap-2 rounded-lg bg-red-500 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-600"
          >
            <XCircle className="h-4 w-4" />
            Decline
          </button>
          <button
            onClick={() =>
              onStatusChange(
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
              onStatusChange(appointment.id, AppointmentStatus.RESCHEDULED)
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
};

export default PendingAppointmentCard;

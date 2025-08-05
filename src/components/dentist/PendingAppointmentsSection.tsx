'use client';

import { AlertTriangle } from 'lucide-react';
import React from 'react';
import {
  AppointmentStatus,
  type AppointmentWithRelations,
} from '../../hooks/useDentistAppointments';
import PendingAppointmentCard from './PendingAppointmentCard';

interface PendingAppointmentsSectionProps {
  pendingAppointments: AppointmentWithRelations[];
  pendingLoading: boolean;
  onStatusChange: (appointmentId: string, newStatus: AppointmentStatus) => void;
  selectedAppointment: AppointmentWithRelations | null;
  setSelectedAppointment: (
    appointment: AppointmentWithRelations | null
  ) => void;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
}

const PendingAppointmentsSection: React.FC<PendingAppointmentsSectionProps> = ({
  pendingAppointments,
  pendingLoading,
  onStatusChange,
  selectedAppointment,
  setSelectedAppointment,
  isDialogOpen,
  setIsDialogOpen,
}) => {
  if (!pendingAppointments || pendingAppointments.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border border-yellow-200 bg-gradient-to-r from-yellow-100 via-orange-100 to-yellow-100 shadow-lg">
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800">
            <AlertTriangle className="h-6 w-6 text-yellow-600" />
            Pending Appointments Requiring Action
          </h2>
          <span className="inline-flex items-center rounded-full bg-yellow-500 px-3 py-1 text-sm font-semibold text-white">
            {pendingAppointments.length} pending
          </span>
        </div>
        {pendingLoading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {pendingAppointments.map(appointment => (
              <PendingAppointmentCard
                key={appointment.id}
                appointment={appointment}
                onStatusChange={onStatusChange}
                selectedAppointment={selectedAppointment}
                setSelectedAppointment={setSelectedAppointment}
                isDialogOpen={isDialogOpen}
                setIsDialogOpen={setIsDialogOpen}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingAppointmentsSection;

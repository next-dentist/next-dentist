'use client';

import { type Appointment, type Dentist, type User } from '@prisma/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

// Define AppointmentStatus enum
export enum AppointmentStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED_BY_PATIENT = 'CANCELLED_BY_PATIENT',
  CANCELLED_BY_DENTIST = 'CANCELLED_BY_DENTIST',
  RESCHEDULED = 'RESCHEDULED',
  COMPLETED = 'COMPLETED',
  NO_SHOW = 'NO_SHOW',
}

export type AppointmentWithRelations = Appointment & {
  dentist: Dentist;
  user: User | null;
};

export interface AppointmentQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  status?: AppointmentStatus;
  dentistStatus?: AppointmentStatus;
  patientStatus?: AppointmentStatus;
  dentistId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface AppointmentResponse {
  appointments: AppointmentWithRelations[];
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

export interface UpdateAppointmentStatusParams {
  appointmentId: string;
  status: AppointmentStatus;
  dentistStatus?: AppointmentStatus;
  patientStatus?: AppointmentStatus;
  statusReason?: string;
  modifiedBy: 'admin' | 'dentist' | 'patient';
}

// Hook to fetch appointments with filters
export const useAdminAppointments = (params: AppointmentQueryParams) => {
  return useQuery({
    queryKey: ['admin-appointments', params],
    queryFn: async (): Promise<AppointmentResponse> => {
      const searchParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/admin/appointments?${searchParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }
      return response.json();
    },
    staleTime: 30000, // 30 seconds
  });
};

// Hook to update appointment status
export const useUpdateAppointmentStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (params: UpdateAppointmentStatusParams) => {
      const response = await fetch(`/api/admin/appointments/${params.appointmentId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: params.status,
          dentistStatus: params.dentistStatus,
          patientStatus: params.patientStatus,
          statusReason: params.statusReason,
          lastModifiedBy: params.modifiedBy,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update appointment status');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch appointments
      queryClient.invalidateQueries({ queryKey: ['admin-appointments'] });
    },
  });
};

// Hook to delete appointment
export const useDeleteAppointment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (appointmentId: string) => {
      const response = await fetch(`/api/admin/appointments/${appointmentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete appointment');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch appointments
      queryClient.invalidateQueries({ queryKey: ['admin-appointments'] });
    },
  });
};

// Hook to reschedule appointment
export const useRescheduleAppointment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (params: {
      appointmentId: string;
      newDate: string;
      newTime: string;
      reason?: string;
    }) => {
      const response = await fetch(`/api/admin/appointments/${params.appointmentId}/reschedule`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appointmentDate: params.newDate,
          appointmentTime: params.newTime,
          statusReason: params.reason,
          lastModifiedBy: 'admin',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to reschedule appointment');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-appointments'] });
    },
  });
};

// Debounce hook for search
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Hook to get appointment statistics
export const useAppointmentStats = () => {
  return useQuery({
    queryKey: ['appointment-stats'],
    queryFn: async () => {
      const response = await fetch('/api/admin/appointments/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch appointment statistics');
      }
      return response.json();
    },
    staleTime: 60000, // 1 minute
  });
}; 
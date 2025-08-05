'use client';

import { type Appointment, type Dentist, type User, AppointmentStatus } from '@prisma/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

export { AppointmentStatus };

export type AppointmentWithRelations = Appointment & {
  dentist: Dentist;
  user: User | null;
};

export interface DentistAppointmentQueryParams {
  dentistId: string;
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  status?: AppointmentStatus;
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

export interface UpdateDentistAppointmentStatusParams {
  appointmentId: string;
  dentistStatus: AppointmentStatus;
  statusReason?: string;
  modifiedBy: 'dentist' | 'admin' | 'patient';
}

// Hook to fetch dentist appointments with filters
export const useDentistAppointments = (params: DentistAppointmentQueryParams) => {
  return useQuery({
    queryKey: ['dentist-appointments', params],
    queryFn: async (): Promise<AppointmentResponse> => {
      const searchParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/dentist/appointments?${searchParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }
      return response.json();
    },
    staleTime: 30000, // 30 seconds
  });
};

// Hook to update dentist appointment status
export const useUpdateDentistAppointmentStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (params: UpdateDentistAppointmentStatusParams) => {
      const response = await fetch(`/api/dentist/appointments/${params.appointmentId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dentistStatus: params.dentistStatus,
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
      queryClient.invalidateQueries({ queryKey: ['dentist-appointments'] });
      queryClient.invalidateQueries({ queryKey: ['dentist-appointment-stats'] });
    },
  });
};

// Hook to get dentist appointment statistics
export const useDentistAppointmentStats = (dentistId: string) => {
  return useQuery({
    queryKey: ['dentist-appointment-stats', dentistId],
    queryFn: async () => {
      const response = await fetch(`/api/dentist/appointments/stats?dentistId=${dentistId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch appointment statistics');
      }
      return response.json();
    },
    staleTime: 60000, // 1 minute
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
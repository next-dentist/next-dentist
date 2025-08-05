import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

// Define the structure of treatment data more explicitly
interface TreatmentData {
  name: string;
  description?: string | null;
  image?: string | null;
  price?: string; // Keep as string for form input
  currency?: string | null;
  minPrice?: string | null;
  maxPrice?: string | null;
  duration?: string | null;
  TreatmentMetaId?: string | null;
  slug?: string | null;
}

// Hook to manage treatments
export const useAdminTreatmentsManage = () => {
  const queryClient = useQueryClient();

  // --- Helper for specific invalidation ---
  const invalidateDentistTreatments = (dentistId: string) => {
    queryClient.invalidateQueries({
      queryKey: ['dentistTreatments', dentistId],
    });
  };

  // --- Mutation for creating a treatment ---
  const createTreatmentMutation = useMutation({
    mutationFn: async (
      treatmentData: { dentistId: string } & TreatmentData
    ) => {
      const { dentistId, ...restData } = treatmentData;
      const response = await axios.post(
        `/api/admin/dentists/${dentistId}/treatments`,
        restData
      );
      return { ...response.data, dentistId };
    },
    onSuccess: data => {
      invalidateDentistTreatments(data.dentistId);
      toast.success('Treatment created successfully');
    },
    onError: error => {
      console.error('Error creating treatment:', error);
      toast.error('Failed to create treatment');
    },
  });

  // --- Mutation for updating a treatment ---
  const updateTreatmentMutation = useMutation({
    mutationFn: async ({
      dentistId,
      treatmentId,
      treatmentData,
    }: {
      dentistId: string;
      treatmentId: string;
      treatmentData: TreatmentData;
    }) => {
      const response = await axios.patch(
        `/api/admin/dentists/${dentistId}/treatments/${treatmentId}`,
        treatmentData
      );
      return { ...response.data, dentistId };
    },
    onSuccess: data => {
      invalidateDentistTreatments(data.dentistId);
      toast.success("Dentist's treatment updated successfully");
    },
    onError: error => {
      console.error('Error updating treatment:', error);
      toast.error("Failed to update dentist's treatment");
    },
  });

  // --- Mutation for deleting a treatment ---
  const deleteTreatmentMutation = useMutation({
    mutationFn: async ({
      dentistId,
      treatmentId,
    }: {
      dentistId: string;
      treatmentId: string;
    }) => {
      const response = await axios.delete(
        `/api/admin/dentists/${dentistId}/treatments/${treatmentId}`
      );
      return { ...response.data, dentistId, treatmentId };
    },
    onSuccess: data => {
      invalidateDentistTreatments(data.dentistId);
      toast.success('Treatment deleted successfully');
    },
    onError: error => {
      console.error('Error deleting treatment:', error);
      toast.error('Failed to delete treatment');
    },
  });

  return {
    createTreatment: createTreatmentMutation.mutate,
    isCreatingTreatment: createTreatmentMutation.isPending,
    updateTreatment: updateTreatmentMutation.mutate,
    isUpdatingTreatment: updateTreatmentMutation.isPending,
    deleteTreatment: deleteTreatmentMutation.mutate,
    isDeletingTreatment: deleteTreatmentMutation.isPending,
  };
};

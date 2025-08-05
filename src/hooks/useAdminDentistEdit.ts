import { Dentist } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

// hook to fetch a single dentist by id
export const useAdminDentistFetch = (dentistId: string) => {
  return useQuery<Dentist, Error>({
    queryKey: ["admin-dentist", dentistId],
    queryFn: async () => {
      const response = await axios.get(`/api/admin/dentists/${dentistId}`);
      return response.data;
    },
  });
};

// hook to update a dentist
export const useAdminDentistEdit = () => {
  const queryClient = useQueryClient();

  return useMutation<Dentist, Error, Dentist>({
    mutationFn: async (dentist) => {
      const response = await axios.patch(
        `/api/admin/dentists/${dentist.id}`,
        dentist
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-dentists"] });
      toast.success("Dentist updated successfully");
    },
    onError: (error) => {
      console.error("Update error details:", error);
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.error
          ? error.response.data.error
          : "Failed to update dentist";
      toast.error(errorMessage);
    },
  });
};

// Renamed hook to update any part of the dentist using PATCH
export const useUpdateDentist = () => {
  const queryClient = useQueryClient();

  return useMutation<
    any, // Define a more specific success response type if available
    Error,
    { id: string; data: Partial<Dentist> } // Accepts id and data payload
  >({
    mutationFn: async ({ id, data }) => {
      const response = await axios.patch(`/api/admin/dentists/${id}`, data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-dentists"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dentist"] });
      toast.success("Dentist updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update dentist");
      console.error("Update error:", error);
    },
  });
};

// Renamed hook to delete a dentist
export const useDeleteDentist = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (dentistId) => {
      const response = await axios.delete(`/api/admin/dentists/${dentistId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-dentists"] });
      toast.success("Dentist deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete dentist");
    },
  });
};

// Hook for managing dentist awards
export const useCreateDentistAward = () => {
  const queryClient = useQueryClient();

  return useMutation<
    any,
    Error,
    { dentistId: string; awards: Array<{ name: string; dateAwarded: string }> }
  >({
    mutationFn: async ({ dentistId, awards }) => {
      const response = await axios.patch(`/api/admin/dentists/${dentistId}`, {
        awards: awards,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-dentist"] });
    },
    onError: (error) => {
      console.error("Award creation error:", error);
      toast.error("Failed to save awards");
    },
  });
};

export const useDeleteDentistAward = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, string>({
    mutationFn: async (awardId) => {
      // This would need to be implemented based on your API structure
      // For now, we'll just invalidate queries
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-dentist"] });
    },
  });
};

// Hook for managing dentist social media
export const useCreateDentistSocialMedia = () => {
  const queryClient = useQueryClient();

  return useMutation<
    any,
    Error,
    { dentistId: string; socialLinks: Record<string, string> }
  >({
    mutationFn: async ({ dentistId, socialLinks }) => {
      const response = await axios.patch(`/api/admin/dentists/${dentistId}`, {
        socialLinks,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-dentist"] });
    },
    onError: (error) => {
      console.error("Social media creation error:", error);
      toast.error("Failed to save social media links");
    },
  });
};

export const useDeleteDentistSocialMedia = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, { dentistId: string; platform: string }>({
    mutationFn: async ({ dentistId, platform }) => {
      const response = await axios.patch(`/api/admin/dentists/${dentistId}`, {
        socialLinks: { [platform.toLowerCase()]: null }
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-dentist"] });
    },
    onError: (error) => {
      console.error("Social media deletion error:", error);
      toast.error("Failed to delete social media link");
    },
  });
};

// Hook for managing dentist knows about
export const useCreateDentistKnowsAbout = () => {
  const queryClient = useQueryClient();

  return useMutation<
    any,
    Error,
    { dentistId: string; knowsAbout: Array<{ '@type': string; name: string; description: string }> }
  >({
    mutationFn: async ({ dentistId, knowsAbout }) => {
      const response = await axios.patch(`/api/admin/dentists/${dentistId}`, {
        knowsAbout: knowsAbout,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-dentist"] });
    },
    onError: (error) => {
      console.error("Knows about creation error:", error);
      toast.error("Failed to save specialties");
    },
  });
};

export const useDeleteDentistKnowsAbout = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, string>({
    mutationFn: async (specialtyName) => {
      // This would need to be implemented based on your API structure
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-dentist"] });
    },
  });
};

// Hook for managing dentist working at
export const useCreateDentistWorkingAt = () => {
  const queryClient = useQueryClient();

  return useMutation<
    any,
    Error,
    { dentistId: string; workingAt: Array<{ '@type': string; name: string; sameAs: string; position: string; startDate: string; endDate?: string }> }
  >({
    mutationFn: async ({ dentistId, workingAt }) => {
      const response = await axios.patch(`/api/admin/dentists/${dentistId}`, {
        workingAt: workingAt,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-dentist"] });
    },
    onError: (error) => {
      console.error("Working at creation error:", error);
      toast.error("Failed to save work experience");
    },
  });
};

export const useDeleteDentistWorkingAt = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, string>({
    mutationFn: async (workingAtId) => {
      // This would need to be implemented based on your API structure
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-dentist"] });
    },
  });
};

// Hook for managing dentist alumni of
export const useCreateDentistAlumniOf = () => {
  const queryClient = useQueryClient();

  return useMutation<
    any,
    Error,
    { dentistId: string; alumniOf: Array<{ '@type': string; name: string; sameAs: string; graduationYear: string; degree: string }> }
  >({
    mutationFn: async ({ dentistId, alumniOf }) => {
      const response = await axios.patch(`/api/admin/dentists/${dentistId}`, {
        alumniOf: alumniOf,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-dentist"] });
    },
    onError: (error) => {
      console.error("Alumni of creation error:", error);
      toast.error("Failed to save alumni information");
    },
  });
};

export const useDeleteDentistAlumniOf = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, string>({
    mutationFn: async (alumniId) => {
      // This would need to be implemented based on your API structure
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-dentist"] });
    },
  });
};

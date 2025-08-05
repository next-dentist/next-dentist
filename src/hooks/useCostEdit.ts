import { Cost } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

const useCostEdit = () => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchCosts = async (id: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/admin/treatment/${id}`);
      return response.data;
    } catch (error) {
      setError(error as Error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createCostMutation = useMutation({
    mutationFn: async (costData: Cost) => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.post("/api/admin/costs", costData);
        return response.data;
      } catch (error) {
        setError(error as Error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["costs"] });
      toast.success("Cost created successfully");
    },
    onError: (error) => {
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.details
          ? error.response.data.details
          : error instanceof Error
          ? error.message
          : "Unknown error";
      toast.error(`Failed to create cost: ${errorMessage}`);
    },
  });

  const updateCostMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Cost }) => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.put(`/api/admin/costs/${id}`, data);
        return response.data;
      } catch (error) {
        setError(error as Error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["costs"] });
      toast.success("Cost updated successfully");
    },
    onError: (error) => {
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.details
          ? error.response.data.details
          : error instanceof Error
          ? error.message
          : "Unknown error";
      toast.error(`Failed to update cost: ${errorMessage}`);
    },
  });

  const deleteCostMutation = useMutation({
    mutationFn: async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.delete(`/api/admin/costs/${id}`);
        return response.data;
      } catch (error) {
        setError(error as Error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["costs"] });
      toast.success("Cost deleted successfully");
    },
    onError: (error) => {
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.details
          ? error.response.data.details
          : error instanceof Error
          ? error.message
          : "Unknown error";
      toast.error(`Failed to delete cost: ${errorMessage}`);
    },
  });

  return {
    fetchCosts,
    createCost: createCostMutation.mutate,
    updateCost: updateCostMutation.mutate,
    deleteCost: deleteCostMutation.mutate,
    isLoading:
      loading ||
      createCostMutation.isPending ||
      updateCostMutation.isPending ||
      deleteCostMutation.isPending,
    error:
      error ||
      createCostMutation.error ||
      updateCostMutation.error ||
      deleteCostMutation.error,
  };
};

export default useCostEdit;

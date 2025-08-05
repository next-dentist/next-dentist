import { User } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface UserData {
  name?: string;
  email?: string;
  phone?: string;
  gender?: string;
  dob?: string;
  address?: string;
  city?: string;
}

interface UserResponse {
  data: User | null;
  isLoading: boolean;
  error: any;
  mutate: () => Promise<any>;
  updateUser: (userData: UserData) => Promise<any>;
  isUpdating: boolean;
  updateError: Error | null;
}

export const useUser = (): UserResponse => {
  const queryClient = useQueryClient();

  const fetchUser = async () => {
    const res = await fetch("/api/user");
    if (!res.ok) {
      throw new Error("Failed to fetch user");
    }
    return res.json();
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
  });

  const updateUserProfile = async (userData: UserData) => {
    const res = await fetch("/api/user", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!res.ok) {
      throw new Error("Failed to update user profile");
    }

    return res.json();
  };

  const {
    mutateAsync: updateUser,
    isPending: isUpdating,
    error: updateError,
  } = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const mutate = async () => {
    return queryClient.invalidateQueries({ queryKey: ["user"] });
  };

  return {
    data,
    isLoading,
    error,
    mutate,
    updateUser,
    isUpdating,
    updateError,
  };
};

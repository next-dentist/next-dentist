// useAdminBlog.ts

import {
  createBlog,
  deleteBlog,
  fetchAllBlogs,
  fetchBlogById,
  updateBlog
} from "@/app/actions/blogAction";
import { BlogStatus } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface BlogFormData {
  title: string;
  content: string;
  status: BlogStatus;
  authorId: string;
  image?: string;
  imageAlt?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoExtra?: any;
  seoKeyword?: string;
  categoryId?: string;
}

interface UpdateBlogData {
  id: string;
  title?: string;
  content?: string;
  status?: BlogStatus;
  authorId?: string;
  image?: string;
  imageAlt?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoExtra?: any;
  seoKeyword?: string;
  categoryId?: string;
}

interface UseAdminBlogReturn {
  blogs: any[] | undefined;
  isLoading: boolean;
  isBlogsLoading: boolean;
  error: Error | null;
  blogsError: Error | null;
  isError: boolean;
  isSuccess: boolean;
  createBlogMutate: (data: BlogFormData) => void;
  updateBlogMutate: (data: UpdateBlogData) => void;
  deleteBlogMutate: (id: string) => void;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  createError: Error | null;
  updateError: Error | null;
  deleteError: Error | null;
  isCreateSuccess: boolean;
  isUpdateSuccess: boolean;
  isDeleteSuccess: boolean;
  resetCreate: () => void;
  resetUpdate: () => void;
  resetDelete: () => void;
  refetchBlogs: () => void;
  useFetchBlogById: (id: string) => {
    data: any;
    isLoading: boolean;
    error: Error | null;
  };
}

/**
 * useAdminBlog - React hook for managing blog data (CRUD) with professional error and loading handling.
 */
export const useAdminBlog = (): UseAdminBlogReturn => {
  const queryClient = useQueryClient();

  // Fetch all blogs
  const {
    data: blogs,
    isLoading: isBlogsLoading,
    error: blogsError,
    isError,
    isSuccess,
    refetch: refetchBlogs,
  } = useQuery({
    queryKey: ["adminBlogs"],
    queryFn: async () => {
      const response = await fetchAllBlogs();
      if (!response.success) {
        throw new Error(typeof response.error === 'string' 
          ? response.error 
          : 'Failed to fetch blogs');
      }
      return response.data || [];
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 1,
  });

  // Create blog mutation
  const {
    mutate: createBlogMutate,
    isPending: isCreating,
    error: createError,
    isSuccess: isCreateSuccess,
    reset: resetCreate,
  } = useMutation({
    mutationFn: async (data: BlogFormData) => {
      const response = await createBlog(data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminBlogs"] });
    },
  });

  // Update blog mutation
  const {
    mutate: updateBlogMutate,
    isPending: isUpdating,
    error: updateError,
    isSuccess: isUpdateSuccess,
    reset: resetUpdate,
  } = useMutation({
    mutationFn: async (data: UpdateBlogData) => {
      const response = await updateBlog(data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminBlogs"] });
    },
  });

  // Delete blog mutation
  const {
    mutate: deleteBlogMutate,
    isPending: isDeleting,
    error: deleteError,
    isSuccess: isDeleteSuccess,
    reset: resetDelete,
  } = useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteBlog(id);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminBlogs"] });
    },
  });

  // Fetch single blog by ID
  const useFetchBlogById = (id: string) => {
    return useQuery({
      queryKey: ["blog", id],
      queryFn: async () => {
        if (!id) return null;
        const response = await fetchBlogById(id);
        if (!response.success) {
          throw new Error(typeof response.error === 'string' 
            ? response.error 
            : 'Failed to fetch blog data');
        }
        return response.data;
      },
      enabled: !!id,
    });
  };

  return {
    blogs,
    isLoading: isBlogsLoading,
    isBlogsLoading,
    error: blogsError,
    blogsError,
    isError,
    isSuccess,
    createBlogMutate,
    updateBlogMutate,
    deleteBlogMutate,
    isCreating,
    isUpdating,
    isDeleting,
    createError,
    updateError,
    deleteError,
    isCreateSuccess,
    isUpdateSuccess,
    isDeleteSuccess,
    resetCreate,
    resetUpdate,
    resetDelete,
    refetchBlogs,
    useFetchBlogById,
  };
};

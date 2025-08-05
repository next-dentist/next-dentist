import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

// Define the expected shape of the successful upload response
interface UploadSuccessResponse {
  success: true;
  url: string;
  filename: string;
  originalFilename: string;
  imageId: string;
}

// Hook to upload an image
export const useAdminUpload = () => {
  const queryClient = useQueryClient();

  // Update mutation type to expect UploadSuccessResponse on success
  const uploadMutation = useMutation<UploadSuccessResponse, Error, FormData>({
    mutationFn: async (formData) => {
      const response = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // Add basic validation for the response structure
      if (!response.data || !response.data.success || !response.data.imageId) {
        throw new Error("Invalid response from upload API");
      }
      return response.data;
    },
    // onSuccess/onError remain the same for individual uploads triggered by mutateAsync
    onSuccess: () => {
      // This might be too early if part of a batch in uploadFiles
      // queryClient.invalidateQueries({ queryKey: ["admin-upload"] }); // Consider invalidating after batch
      // toast.success("Image uploaded successfully"); // Toast handled in uploadFiles
    },
    onError: (error) => {
      console.error("Upload error details:", error);
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.error
          ? error.response.data.error
          : "Failed to upload image";
      toast.error(errorMessage); // Keep individual error toast
    },
  });

  // Hook to delete an image
  const deleteMutation = useMutation<any, Error, string>({
    mutationFn: async (imageId) => {
      // Make sure the API route expects ID in the body for DELETE
      const response = await axios.delete(`/api/upload`, {
        data: { id: imageId },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-upload"] }); // Invalidate after successful delete
      toast.success("Image deleted successfully");
    },
    onError: (error) => {
      console.error("Delete error details:", error);
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.error
          ? error.response.data.error
          : "Failed to delete image";
      toast.error(errorMessage);
    },
  });

  // Helper function to upload multiple files
  // Accepts dentistId and returns array of successful response objects
  const uploadFiles = async (
    files: File[],
    dentistId: string
  ): Promise<UploadSuccessResponse[] | null> => {
    if (!dentistId) {
      toast.error("Cannot upload images without a Dentist ID.");
      return null;
    }
    try {
      const uploadPromises = files.map((file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("dentistId", dentistId); // Add dentistId here
        return uploadMutation.mutateAsync(formData);
      });

      const results = await Promise.allSettled(uploadPromises); // Use allSettled to handle partial failures

      const successfulUploads: UploadSuccessResponse[] = [];
      let failedCount = 0;

      results.forEach((result) => {
        if (result.status === "fulfilled" && result.value?.success) {
          successfulUploads.push(result.value);
        } else {
          failedCount++;
          // Error already toasted by individual mutation's onError
          console.error(
            "Upload failed for one file:",
            result.status === "rejected"
              ? result.reason
              : "API returned success:false"
          );
        }
      });

      if (failedCount > 0) {
        toast.warning(`${failedCount} image(s) failed to upload.`);
      }
      if (successfulUploads.length > 0) {
        toast.success(
          `${successfulUploads.length} image(s) uploaded successfully.`
        );
        // Invalidate relevant queries *after* the batch is done
        queryClient.invalidateQueries({
          queryKey: ["admin-dentist", dentistId],
        });
        queryClient.invalidateQueries({ queryKey: ["admin-upload"] });
      }

      return successfulUploads.length > 0 ? successfulUploads : null;
    } catch (error) {
      // This catch might be redundant if using allSettled and individual onError handles errors
      console.error("Error uploading files batch:", error);
      toast.error("An unexpected error occurred during batch upload.");
      return null;
    }
  };

  // Helper function to remove a file (using the DELETE mutation)
  const removeFile = async (imageId: string): Promise<boolean> => {
    try {
      await deleteMutation.mutateAsync(imageId);
      // Invalidation and toast happen in the mutation's onSuccess/onError
      return true;
    } catch (error) {
      // Error toast handled by mutation's onError
      console.error("Error removing file:", error);
      return false;
    }
  };

  return {
    uploadMutation, // expose if needed individually
    deleteMutation, // expose if needed individually
    uploadFiles,
    removeFile,
  };
};

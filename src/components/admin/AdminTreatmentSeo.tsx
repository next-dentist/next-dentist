import { useAdminSEOEdit } from "@/hooks/useAdminSEOEdit";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

const seoFormSchema = z.object({
  seo_title: z.string().min(1, "SEO Title is required"),
  seo_description: z.string(),
  seo_extra: z.string(),
  seo_keyword: z.string(),
});

type SeoFormValues = z.infer<typeof seoFormSchema>;

export default function AdminTreatmentSeo({
  treatmentId,
}: {
  treatmentId: string;
}) {
  const form = useForm<SeoFormValues>({
    resolver: zodResolver(seoFormSchema),
    defaultValues: {
      seo_title: "",
      seo_description: "",
      seo_extra: "{}",
      seo_keyword: "",
    },
  });

  const { updateSeoDetails, isLoading, isSuccess, isError, error, reset } =
    useAdminSEOEdit();

  // Fetch current SEO data
  const {
    data: treatmentData,
    isLoading: isLoadingTreatment,
    refetch,
  } = useQuery({
    queryKey: ["treatment-seo", treatmentId],
    queryFn: async () => {
      const response = await axios.get(`/api/admin/treatments/${treatmentId}`);
      return response.data.treatment;
    },
    enabled: !!treatmentId,
  });

  // Update form when data is loaded
  useEffect(() => {
    if (treatmentData) {
      form.reset({
        seo_title: treatmentData.seo_title || "",
        seo_description: treatmentData.seo_description || "",
        seo_extra: treatmentData.seo_extra
          ? JSON.stringify(treatmentData.seo_extra, null, 2)
          : "{}",
        seo_keyword: treatmentData.seo_keyword || "",
      });
    }
  }, [treatmentData, form]);

  // Refetch data when save is successful
  useEffect(() => {
    if (isSuccess) {
      refetch();
    }
  }, [isSuccess, refetch]);

  const onSubmit = async (values: SeoFormValues) => {
    // Make sure seo_extra is valid JSON
    try {
      // Validate JSON format
      if (values.seo_extra) {
        JSON.parse(values.seo_extra);
      }
      await updateSeoDetails(treatmentId, values);
    } catch (e) {
      form.setError("seo_extra", {
        type: "manual",
        message: "Invalid JSON format",
      });
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">SEO Details</h1>
      {isLoadingTreatment ? (
        <p>Loading SEO data...</p>
      ) : (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="seo_title">SEO Title</Label>
            <Input id="seo_title" {...form.register("seo_title")} />
            {form.formState.errors.seo_title && (
              <p className="text-xs text-red-500 mt-1">
                {form.formState.errors.seo_title.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="seo_description">SEO Description</Label>
            <Textarea
              id="seo_description"
              {...form.register("seo_description")}
            />
          </div>
          <div>
            <Label htmlFor="seo_keyword">SEO Keyword</Label>
            <Input id="seo_keyword" {...form.register("seo_keyword")} />
          </div>
          <div>
            <Label htmlFor="seo_extra">SEO Extra (JSON format)</Label>
            <Textarea
              id="seo_extra"
              {...form.register("seo_extra")}
              rows={5}
              placeholder='{"key": "value"}'
            />
            {form.formState.errors.seo_extra && (
              <p className="text-xs text-red-500 mt-1">
                {form.formState.errors.seo_extra.message}
              </p>
            )}
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save SEO Details"}
          </Button>
          {isSuccess && (
            <p className="text-green-500">SEO Details saved successfully.</p>
          )}
          {isError && <p className="text-red-500">Error: {error}</p>}
        </form>
      )}
    </div>
  );
}

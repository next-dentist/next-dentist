import {
  Cost,
  FAQ,
  Instruction,
  Section,
  TreatmentImages,
  TreatmentMeta,
  TreatmentVideos,
} from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Define a more specific type for the treatment data including relations
type TreatmentWithRelations = TreatmentMeta & {
  costs: Cost[];
  faq: FAQ[];
  instructions: Instruction[];
  sections: Section[];
  images: TreatmentImages[];
  videos: TreatmentVideos[];
};

// Hook to fetch all treatments
export const useTreatments = () => {
  return useQuery<TreatmentWithRelations[], Error>({
    queryKey: ["treatments"],
    queryFn: async () => {
      const response = await axios.get<{
        treatments: TreatmentWithRelations[];
        success: boolean;
      }>("/api/treatments/meta");

      if (!response.data.success) {
        throw new Error("Failed to fetch treatments");
      }

      return response.data.treatments;
    },
  });
};

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDebounce } from "@/hooks/useAdminDentists";
import { cn } from "@/lib/utils";
import { TreatmentMeta } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import TreatmentEditFormById from "./TreatmentEditFrombyId";

interface TreatmentMetaFormProps {
  dentistId: string;
  onSuccess?: () => void;
}

export const TreatmentMetaForm = ({
  dentistId,
  onSuccess,
}: TreatmentMetaFormProps) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 500);
  const [selectedTreatmentId, setSelectedTreatmentId] = useState<string | null>(
    null
  );

  // Fetch all treatments meta on component load
  const { data: allTreatmentsData, isLoading: isLoadingAllTreatments } =
    useQuery<{
      treatments: TreatmentMeta[];
      success: boolean;
    }>({
      queryKey: ["all-treatments-meta"],
      queryFn: async () => {
        const response = await axios.get(`/api/treatments/meta`);
        return response.data;
      },
    });

  // Fetch filtered treatments for search
  const { data: treatmentsData, isLoading: isLoadingTreatments } = useQuery<{
    treatments: TreatmentMeta[];
  }>({
    queryKey: ["treatments-meta", debouncedSearch],
    queryFn: async () => {
      const response = await axios.get(
        `/api/admin/treatments/meta?search=${debouncedSearch}`
      );
      return response.data;
    },
    enabled: debouncedSearch.length > 0,
  });

  // Determine which treatments to display based on search
  const displayTreatments =
    debouncedSearch.length > 0
      ? treatmentsData?.treatments
      : allTreatmentsData?.treatments;

  const handleSuccess = () => {
    toast.success("Treatment added successfully");
    setSelectedTreatmentId(null);
    if (onSuccess) onSuccess();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Add Treatment from Template</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {selectedTreatmentId
                  ? displayTreatments?.find((t) => t.id === selectedTreatmentId)
                      ?.name || "Loading..."
                  : "Select treatment..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput
                  placeholder="Search treatments..."
                  value={searchValue}
                  onValueChange={setSearchValue}
                />
                <CommandEmpty>No treatment found.</CommandEmpty>
                <CommandGroup>
                  {isLoadingAllTreatments || isLoadingTreatments ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span>Loading treatments...</span>
                    </div>
                  ) : (
                    displayTreatments?.map((treatment) => (
                      <CommandItem
                        key={treatment.id}
                        value={treatment.id}
                        onSelect={() => {
                          setSelectedTreatmentId(treatment.id);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedTreatmentId === treatment.id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {treatment.name}
                      </CommandItem>
                    ))
                  )}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {selectedTreatmentId && (
          <TreatmentEditFormById
            treatmentId={selectedTreatmentId}
            dentistId={dentistId}
            isMetaTemplate={true}
            onSuccess={handleSuccess}
          />
        )}
      </CardContent>
    </Card>
  );
};

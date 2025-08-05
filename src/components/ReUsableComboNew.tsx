"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Export the Option type
export type Option = {
  id: string;
  name: string;
  fullName?: string; // Optional for flexibility
};

type MultiComboProps = {
  options: Option[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onRetry?: () => void;
  placeholder?: string;
  selected?: Option[]; // Type remains Option[]
  onSelectionChange?: (selected: Option[]) => void;
  className?: string; // Add className prop for styling
};

// Rename component if desired, e.g., ReUsableMultiSelectCombo
export default function ReUsableComboNew({
  // Or rename function to match export default
  options = [],
  isLoading,
  isError,
  onRetry,
  placeholder = "Select option...",
  selected: initialSelected = [], // Expects Option[]
  onSelectionChange,
  className,
}: MultiComboProps) {
  const [open, setOpen] = React.useState(false);
  // Internal state uses Option[]
  const [selected, setSelected] = React.useState<Option[]>(initialSelected);

  // Update internal state when the prop changes
  React.useEffect(() => {
    setSelected(initialSelected);
  }, [initialSelected]);

  const handleSelect = (option: Option) => {
    const isSelected = selected.some((o) => o.id === option.id);
    const newSelected = isSelected
      ? selected.filter((o) => o.id !== option.id)
      : [...selected, option];

    setSelected(newSelected);
    if (onSelectionChange) {
      onSelectionChange(newSelected); // Notify parent with Option[]
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {selected.length > 0
            ? selected.length > 2
              ? `${selected.length} items selected`
              : selected.map((s) => s.name).join(", ")
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput
            placeholder={`Search ${placeholder.toLowerCase()}...`}
            className="h-9"
          />
          <CommandList className="max-h-[200px]">
            {/* Handle loading state */}
            {isLoading && <CommandEmpty>Loading options...</CommandEmpty>}

            {/* Handle error state */}
            {isError && (
              <CommandEmpty>
                Failed to load options.{" "}
                {onRetry && (
                  <Button variant="link" onClick={onRetry}>
                    Retry
                  </Button>
                )}
              </CommandEmpty>
            )}

            {/* Handle empty state */}
            {!isLoading && !isError && options?.length === 0 && (
              <CommandEmpty>No options found.</CommandEmpty>
            )}

            {/* Render options */}
            {!isLoading && !isError && options && options.length > 0 && (
              <CommandGroup>
                {options.map((option) => {
                  // Check against internal selected state (which is Option[])
                  const isSelected = selected.some((o) => o.id === option.id);

                  return (
                    <CommandItem
                      key={option.id}
                      value={option.name}
                      onSelect={() => handleSelect(option)}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div>
                          {option.name}{" "}
                          {option.fullName ? (
                            <span className="text-sm text-muted-foreground">
                              - {option.fullName}
                            </span>
                          ) : null}
                        </div>
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4",
                            isSelected ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

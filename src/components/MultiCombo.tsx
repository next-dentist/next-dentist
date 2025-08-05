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
import { useDegrees } from "@/hooks/useDegrees";
import { cn } from "@/lib/utils";

type Degree = {
  id: string;
  name: string;
  fullName: string;
};

export default function MultiCombo() {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Degree[]>([]);

  const { data: degrees, isLoading, isError, refetch } = useDegrees();

  const handleSelect = (degree: Degree) => {
    const isSelected = selected.some((d) => d.id === degree.id);
    setSelected(
      isSelected
        ? selected.filter((d) => d.id !== degree.id)
        : [...selected, degree]
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] m-10 justify-between"
        >
          {selected.length
            ? selected.map((s) => s.name).join(", ")
            : "Select degree..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search degree..." className="h-9" />
          <CommandList>
            {/* Handle loading state */}
            {isLoading && <CommandEmpty>Loading degrees...</CommandEmpty>}

            {/* Handle error state */}
            {isError && (
              <CommandEmpty>
                Failed to load degrees.{" "}
                <Button variant="link" onClick={() => refetch()}>
                  Retry
                </Button>
              </CommandEmpty>
            )}

            {/* Handle empty state */}
            {!isLoading && !isError && degrees?.length === 0 && (
              <CommandEmpty>No degree found.</CommandEmpty>
            )}

            {/* Render degrees */}
            {!isLoading && !isError && degrees && degrees.length > 0 && (
              <CommandGroup>
                {degrees.map((degree) => {
                  const isSelected = selected.some((d) => d.id === degree.id);

                  return (
                    <CommandItem
                      key={degree.id}
                      value={degree.name}
                      onSelect={() => handleSelect(degree)}
                    >
                      {degree.name} - {degree.fullName}
                      <Check
                        className={cn(
                          "ml-auto",
                          isSelected ? "opacity-100" : "opacity-0"
                        )}
                      />
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

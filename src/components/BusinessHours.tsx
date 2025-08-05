"use client";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { siteConfig } from "@/config";
import { Trash } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

interface Day {
  fullName: string;
  shortName: string;
}

interface BusinessHour {
  from: string;
  to: string;
}

interface DayBusinessHours {
  Name: string;
  Hours: BusinessHour[];
  Closed: boolean;
}

interface BusinessHours {
  [key: string]: DayBusinessHours;
}

const daysOfWeek: Day[] = [
  { fullName: "Monday", shortName: "Mon" },
  { fullName: "Tuesday", shortName: "Tue" },
  { fullName: "Wednesday", shortName: "Wed" },
  { fullName: "Thursday", shortName: "Thu" },
  { fullName: "Friday", shortName: "Fri" },
  { fullName: "Saturday", shortName: "Sat" },
  { fullName: "Sunday", shortName: "Sun" },
];

interface BusinessHoursPickerProps {
  onChange: (businessHours: BusinessHours) => void;
  current?: BusinessHours;
}

// Custom Combobox component for time selection
const TimeCombobox = ({
  value,
  onChange,
  label,
  timeSlots,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
  timeSlots: { key: string; label: string }[];
}) => {
  const [open, setOpen] = useState(false);

  // Stop event propagation for clicks within the combobox
  const handleComboboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div onClick={handleComboboxClick} className="relative z-10">
      <Combobox
        items={timeSlots}
        value={value}
        onChange={(newValue) => {
          onChange(newValue);
        }}
        placeholder={label}
        setOpen={setOpen}
        open={open}
      />
    </div>
  );
};

const BusinessHoursPicker: React.FC<BusinessHoursPickerProps> = ({
  onChange,
  current,
}) => {
  const [businessHours, setBusinessHours] = useState<BusinessHours>(
    current || {}
  );

  const handleAddHours = (day: Day, e?: React.MouseEvent) => {
    e?.preventDefault();
    const newHours = { from: "", to: "" };
    setBusinessHours((prev) => ({
      ...prev,
      [day.fullName]: {
        Name: day.shortName,
        Hours: [...(prev[day.fullName]?.Hours || []), newHours],
        Closed: prev[day.fullName]?.Closed || false,
      },
    }));
  };

  const handleRemoveHours = (day: Day, index: number, e?: React.MouseEvent) => {
    e?.preventDefault();
    const updatedHours = businessHours[day.fullName].Hours.filter(
      (_, idx) => idx !== index
    );

    const updatedBusinessHours = {
      ...businessHours,
      [day.fullName]: {
        ...businessHours[day.fullName],
        Hours: updatedHours,
      },
    };

    setBusinessHours(updatedBusinessHours);
    onChange(updatedBusinessHours);
  };

  const handleHoursChange = (
    day: Day,
    index: number,
    field: "from" | "to",
    value: string
  ) => {
    const updatedHours = businessHours[day.fullName].Hours.map((hour, idx) =>
      idx === index ? { ...hour, [field]: value } : hour
    );

    const updatedBusinessHours = {
      ...businessHours,
      [day.fullName]: {
        ...businessHours[day.fullName],
        Hours: updatedHours,
      },
    };

    setBusinessHours(updatedBusinessHours);
    onChange(updatedBusinessHours);
  };

  const handleCopyToAll = (day: Day, e?: React.MouseEvent) => {
    e?.preventDefault();
    if (!businessHours[day.fullName]) return;

    const hoursToCopy = businessHours[day.fullName].Hours;
    const closedStatus = businessHours[day.fullName].Closed;
    const updatedBusinessHours: BusinessHours = {};

    daysOfWeek.forEach((d) => {
      updatedBusinessHours[d.fullName] = {
        Name: d.shortName,
        Hours: [...hoursToCopy],
        Closed: closedStatus,
      };
    });

    setBusinessHours(updatedBusinessHours);
    onChange(updatedBusinessHours);
    toast.success(`Business hours copied from ${day.fullName} to all days`);
  };

  const handleClosedChange = (day: Day, e?: React.MouseEvent) => {
    e?.preventDefault();

    // Get the current status
    const isClosed = !businessHours[day.fullName]?.Closed;

    const updatedBusinessHours = {
      ...businessHours,
      [day.fullName]: {
        ...businessHours[day.fullName],
        Name: day.shortName,
        Closed: isClosed,
        // Clear hours if we're setting to closed
        Hours: isClosed ? [] : businessHours[day.fullName]?.Hours || [],
      },
    };

    // If we're closing and there are no hours yet, initialize with an empty array
    if (isClosed && !businessHours[day.fullName]) {
      updatedBusinessHours[day.fullName] = {
        Name: day.shortName,
        Closed: true,
        Hours: [],
      };
    }

    // If we're opening and there are no hours yet, add one time slot
    if (
      !isClosed &&
      (!businessHours[day.fullName] ||
        businessHours[day.fullName]?.Hours.length === 0)
    ) {
      updatedBusinessHours[day.fullName] = {
        Name: day.shortName,
        Closed: false,
        Hours: [{ from: "", to: "" }],
      };
    }

    setBusinessHours(updatedBusinessHours);
    onChange(updatedBusinessHours);

    toast.success(`${day.fullName} is now ${isClosed ? "closed" : "open"}`);
  };

  return (
    <div>
      <Tabs defaultValue={daysOfWeek[0].shortName} className="w-full">
        <TabsList className="mb-4">
          {daysOfWeek.map((day) => (
            <TabsTrigger key={day.shortName} value={day.shortName}>
              {day.shortName}
            </TabsTrigger>
          ))}
        </TabsList>

        {daysOfWeek.map((day) => (
          <TabsContent key={day.shortName} value={day.shortName}>
            <div className="flex gap-2 flex-col w-full">
              <div className="flex justify-between items-center w-full p-2 rounded-md bg-slate-50">
                <div className="font-medium">{day.fullName}</div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    {businessHours[day.fullName]?.Closed ? "Closed" : "Open"}
                  </span>
                  <Switch
                    checked={!businessHours[day.fullName]?.Closed}
                    onCheckedChange={(checked) => handleClosedChange(day)}
                    id={`switch-${day.fullName}`}
                  />
                </div>
              </div>

              {/* Only show time slots if the day is open */}
              {!businessHours[day.fullName]?.Closed ? (
                <>
                  {businessHours[day.fullName]?.Hours?.map((hours, index) => (
                    <div key={index} className="flex flex-col gap-2 relative">
                      <div className="flex gap-2 flex-col w-full">
                        <div className="mb-2 relative z-20">
                          <TimeCombobox
                            label="From"
                            value={hours.from}
                            onChange={(value) =>
                              handleHoursChange(day, index, "from", value)
                            }
                            timeSlots={siteConfig.TimeSlotArray}
                          />
                        </div>

                        <div className="mb-2 relative z-10">
                          <TimeCombobox
                            label="To"
                            value={hours.to}
                            onChange={(value) =>
                              handleHoursChange(day, index, "to", value)
                            }
                            timeSlots={siteConfig.TimeSlotArray}
                          />
                        </div>

                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveHours(day, index, e);
                          }}
                          variant="destructive"
                        >
                          <Trash size={16} className="mr-2" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}

                  <Button
                    size="sm"
                    onClick={(e) => handleAddHours(day, e)}
                    variant="outline"
                    className="mt-2"
                  >
                    Add Another Time Slot
                  </Button>
                </>
              ) : (
                <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-md mt-2">
                  This day is marked as closed. Toggle the switch to add
                  business hours.
                </div>
              )}

              {Object.values(businessHours).some(
                (day) => day.Hours.length > 0
              ) && (
                <Button
                  size="sm"
                  onClick={(e) => handleCopyToAll(day, e)}
                  className="mt-4"
                >
                  Copy to All Days
                </Button>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default BusinessHoursPicker;

// src/components/CardTimeSlot.tsx

import { addHours, format as formatDate, isBefore, parse } from 'date-fns';
import { Calendar } from 'lucide-react';
import React from 'react';
import { Button } from './ui/button';

interface BusinessHour {
  from: string; // e.g. "08:30 AM"
  to: string; // e.g. "05:00 PM"
}

interface DayBusinessHours {
  Name: string; // e.g. "Mon"
  Hours: BusinessHour[];
  Closed: boolean;
}

export interface BusinessHours {
  [key: string]: DayBusinessHours;
}

interface CardTimeSlotProps {
  businessHours: BusinessHours;
  onTimeSlotSelect?: (time: string) => void;
  selectedTime?: string | null;
  disabled?: boolean;
}

function parseTimeToDate(timeStr: string, baseDate: Date) {
  // timeStr: "08:30 AM"
  // Returns a Date object with the same date as baseDate, but time set to timeStr
  return parse(timeStr, 'hh:mm a', baseDate);
}

const CardTimeSlot: React.FC<CardTimeSlotProps> = ({
  businessHours,
  onTimeSlotSelect,
  selectedTime,
  disabled = false,
}) => {
  const currentDate = new Date();
  const currentDay = formatDate(currentDate, 'EEEE'); // e.g. "Monday"

  // Get today's business hours
  const todayHours = businessHours[currentDay];

  // If the day is closed or no hours are set, return null
  if (
    !todayHours ||
    todayHours.Closed ||
    !todayHours.Hours ||
    todayHours.Hours.length === 0
  ) {
    return null;
  }

  // Generate time slots for today
  const generateTimeSlots = () => {
    const slots: string[] = [];
    const oneHourFromNow = addHours(currentDate, 1);

    todayHours.Hours.forEach(interval => {
      let current = parseTimeToDate(interval.from, currentDate);
      const end = parseTimeToDate(interval.to, currentDate);

      while (current < end) {
        // Only add slots that are at least 1 hour from now
        if (isBefore(oneHourFromNow, current)) {
          slots.push(formatDate(current, 'hh:mm a'));
        }
        current = new Date(current.getTime() + 30 * 60 * 1000); // 30 min slots
      }
    });

    return slots;
  };

  // Get all available slots and take only the first 3
  const allAvailableSlots = generateTimeSlots();
  const availableSlots = allAvailableSlots.slice(0, 3);

  if (availableSlots.length === 0) {
    return null;
  }

  const handleTimeSlotClick = (time: string) => {
    if (!disabled && onTimeSlotSelect) {
      onTimeSlotSelect(time);
    }
  };

  return (
    <div className="mb-5 flex flex-col p-1">
      <span className="mb-2 flex items-center border-b border-gray-200 pb-2 text-sm font-medium text-green-700">
        <Calendar className="mr-0.5 h-3 w-3" /> Available Today (Choose Time)
      </span>
      <div className="flex flex-wrap gap-2">
        {availableSlots.map((slot, index) => (
          <Button
            key={index}
            className={`border-dental-blue rounded-full border px-2 py-1 text-[12px] font-medium transition-all duration-200 ${
              selectedTime === slot
                ? 'bg-dental-blue text-white'
                : 'bg-dental-blue/10 text-dental-blue hover:bg-dental-blue/20'
            } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} `}
            onClick={() => handleTimeSlotClick(slot)}
            disabled={disabled}
            title=""
          >
            {slot}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CardTimeSlot;

// src/app/api/appointment/availability/route.ts

import { db } from '@/db';
import { format, isValid, parseISO } from 'date-fns';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Accepts: /api/appointments/availability?dentistId=...&date=yyyy-MM-dd

const querySchema = z.object({
  dentistId: z.string(), // cuid, not uuid
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // yyyy-MM-dd
});

// Default business hours for dentists who don't have hours defined
const DEFAULT_BUSINESS_HOURS = {
  Monday: { Closed: false, Hours: [{ from: "09:00 AM", to: "05:00 PM" }] },
  Tuesday: { Closed: false, Hours: [{ from: "09:00 AM", to: "05:00 PM" }] },
  Wednesday: { Closed: false, Hours: [{ from: "09:00 AM", to: "05:00 PM" }] },
  Thursday: { Closed: false, Hours: [{ from: "09:00 AM", to: "05:00 PM" }] },
  Friday: { Closed: false, Hours: [{ from: "09:00 AM", to: "05:00 PM" }] },
  Saturday: { Closed: true, Hours: [] },
  Sunday: { Closed: true, Hours: [] }
};

function parseTime12hTo24h(timeStr: string): { hour: number; minute: number } {
  // Example: "10:00 AM" or "06:00 PM"
  const [time, modifier] = timeStr.split(' ');
  let [hour, minute] = time.split(':').map(Number);

  if (modifier === 'PM' && hour !== 12) hour += 12;
  if (modifier === 'AM' && hour === 12) hour = 0;

  return { hour, minute };
}

// Helper: Generate time slots from business hours JSON
function generateTimeSlots(businessHours: any, date: Date): string[] {
  // businessHours is a JSON object with keys as day names ("Monday", "Tuesday", etc.)
  // Each day has: { Closed: boolean, Hours: [{ from: "09:00", to: "13:00" }, ...] }
  const dayName = format(date, 'EEEE'); // e.g., "Monday"
  const day = businessHours?.[dayName];
  if (!day || day.Closed) return [];
  const slots: string[] = [];
  for (const interval of day.Hours || []) {
    const { hour: startHour, minute: startMinute } = parseTime12hTo24h(interval.from);
    const { hour: endHour, minute: endMinute } = parseTime12hTo24h(interval.to);
    let current = new Date(date);
    current.setHours(startHour, startMinute, 0, 0);
    const end = new Date(date);
    end.setHours(endHour, endMinute, 0, 0);
    while (current < end) {
      slots.push(format(current, 'HH:mm'));
      current = new Date(current.getTime() + 30 * 60 * 1000); // 30 min slots
    }
  }
  return slots;
}

export async function GET(request: Request) {
  try {
    // Use URLSearchParams directly from the request URL
    const { searchParams } = new URL(request.url);
    const dentistId = searchParams.get('dentistId');
    const date = searchParams.get('date');


    // Validate query parameters using zod
    const result = querySchema.safeParse({ dentistId, date });
    if (!result.success) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid query parameters', 
          details: result.error.errors 
        },
        { status: 400 }
      );
    }

    const { dentistId: validDentistId, date: validDate } = result.data;
    const dateObj = parseISO(validDate);
    if (!isValid(dateObj)) {
      return NextResponse.json({ 
        success: false,
        error: 'Invalid date format' 
      }, { status: 400 });
    }

    // Fetch dentist with business hours
    let businessHours;
    try {
      const dentist = await db.dentist.findUnique({
        where: { id: validDentistId },
        select: { businessHours: true },
      });
      
      // Use dentist's business hours if available, otherwise use default hours
      if (dentist && dentist.businessHours) {
        businessHours = dentist.businessHours;
      } else {
        businessHours = DEFAULT_BUSINESS_HOURS;
      }
    } catch (error) {
      businessHours = DEFAULT_BUSINESS_HOURS;
    }

    // Generate all possible slots for the day
    const allSlots = generateTimeSlots(businessHours, dateObj);

    // Fetch existing appointments for that dentist on that date
    // appointmentDate is DateTime, appointmentTime is string "HH:mm"
    const startOfDay = new Date(validDate + 'T00:00:00.000Z');
    const endOfDay = new Date(validDate + 'T23:59:59.999Z');
    const appointments = await db.appointment.findMany({
      where: {
        dentistId: validDentistId,
        appointmentDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      select: { appointmentTime: true },
    });
    const bookedTimes = new Set(appointments.map(a => a.appointmentTime));

    // Mark slots as available or not
    const slots = allSlots.map(time => ({
      time,
      available: !bookedTimes.has(time),
    }));

    return NextResponse.json({
      success: true,
      slots,
      isDefaultHours: businessHours === DEFAULT_BUSINESS_HOURS
    });
  } catch (err) {
    console.error('Error in availability endpoint:', err);
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

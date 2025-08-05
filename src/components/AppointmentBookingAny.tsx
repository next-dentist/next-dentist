// src/components/AppointmentBookingAny.tsx
import axios from 'axios';
import { addDays, format, isBefore, startOfDay } from 'date-fns';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

// Shared components
import AppointmentForm from './AppointmentForm';
import CardTimeSlot, { BusinessHours } from './CardTimeSlot';
import { Button } from './ui/button';

// ------------ Types ------------ //
interface TimeSlot {
  time: string;
  available: boolean;
}

interface AppointmentBookingProps {
  /** Optional user‑id if the patient is logged in */
  userId?: string;
  /** Optional dentist-id if booking for specific dentist */
  dentistId?: string;
  /** Fires after a booking is confirmed so the parent can refresh data */
  onSuccess?: () => void;
}

/** Carousel step */
type Step = 'select' | 'form';

// ------------ Constants ------------ //
/** Fixed clinic hours → 10 am – 6 pm, 30‑minute slots */
const BUSINESS_HOURS: BusinessHours = {
  Monday: {
    Name: 'Mon',
    Hours: [{ from: '10:00 AM', to: '06:00 PM' }],
    Closed: false,
  },
  Tuesday: {
    Name: 'Tue',
    Hours: [{ from: '10:00 AM', to: '06:00 PM' }],
    Closed: false,
  },
  Wednesday: {
    Name: 'Wed',
    Hours: [{ from: '10:00 AM', to: '06:00 PM' }],
    Closed: false,
  },
  Thursday: {
    Name: 'Thu',
    Hours: [{ from: '10:00 AM', to: '06:00 PM' }],
    Closed: false,
  },
  Friday: {
    Name: 'Fri',
    Hours: [{ from: '10:00 AM', to: '06:00 PM' }],
    Closed: false,
  },
  Saturday: {
    Name: 'Sat',
    Hours: [{ from: '10:00 AM', to: '06:00 PM' }],
    Closed: false,
  },
  Sunday: {
    Name: 'Sun',
    Hours: [{ from: '10:00 AM', to: '06:00 PM' }],
    Closed: false,
  },
};

// ------------ Component ------------ //
const AppointmentBookingAny: React.FC<AppointmentBookingProps> = ({
  userId,
  dentistId,
  onSuccess,
}) => {
  /* ---------------- State ---------------- */
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [visibleDays, setVisibleDays] = useState<Date[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<Step>('select');

  // "Quick‑book" today shortcuts
  const [todayTimeSlots, setTodayTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTodayTime, setSelectedTodayTime] = useState<string | null>(
    null
  );

  /* ---------------- Effects ---------------- */
  // 14‑day rolling window
  useEffect(() => {
    const today = startOfDay(new Date());
    setVisibleDays(Array.from({ length: 14 }, (_, i) => addDays(today, i)));
  }, []);

  // Generate time slots for the selected date
  useEffect(() => {
    const generateTimeSlots = () => {
      const slots: TimeSlot[] = [];
      const dayName = format(selectedDate, 'EEEE');
      const dayHours = BUSINESS_HOURS[dayName];

      if (dayHours && !dayHours.Closed) {
        dayHours.Hours.forEach(interval => {
          const [startHour, startMinute] = interval.from
            .split(' ')[0]
            .split(':')
            .map(Number);
          const [endHour, endMinute] = interval.to
            .split(' ')[0]
            .split(':')
            .map(Number);
          const isPM = interval.from.includes('PM');
          const isEndPM = interval.to.includes('PM');

          let currentHour = startHour;
          if (isPM && startHour !== 12) currentHour += 12;
          if (!isPM && startHour === 12) currentHour = 0;

          let endHour24 = endHour;
          if (isEndPM && endHour !== 12) endHour24 += 12;
          if (!isEndPM && endHour === 12) endHour24 = 0;

          const totalMinutes =
            endHour24 * 60 + endMinute - (currentHour * 60 + startMinute);

          for (let i = 0; i <= totalMinutes; i += 30) {
            const minutes = currentHour * 60 + startMinute + i;
            const hrs = Math.floor(minutes / 60)
              .toString()
              .padStart(2, '0');
            const mins = (minutes % 60).toString().padStart(2, '0');
            slots.push({ time: `${hrs}:${mins}`, available: true });
          }
        });
      }
      setTimeSlots(slots);
    };

    generateTimeSlots();
  }, [selectedDate]);

  // Today shortcuts
  useEffect(() => {
    const generateTodaySlots = () => {
      const slots: TimeSlot[] = [];
      const dayName = format(new Date(), 'EEEE');
      const dayHours = BUSINESS_HOURS[dayName];

      if (dayHours && !dayHours.Closed) {
        dayHours.Hours.forEach(interval => {
          const [startHour, startMinute] = interval.from
            .split(' ')[0]
            .split(':')
            .map(Number);
          const [endHour, endMinute] = interval.to
            .split(' ')[0]
            .split(':')
            .map(Number);
          const isPM = interval.from.includes('PM');
          const isEndPM = interval.to.includes('PM');

          let currentHour = startHour;
          if (isPM && startHour !== 12) currentHour += 12;
          if (!isPM && startHour === 12) currentHour = 0;

          let endHour24 = endHour;
          if (isEndPM && endHour !== 12) endHour24 += 12;
          if (!isEndPM && endHour === 12) endHour24 = 0;

          const totalMinutes =
            endHour24 * 60 + endMinute - (currentHour * 60 + startMinute);

          for (let i = 0; i <= totalMinutes; i += 30) {
            const minutes = currentHour * 60 + startMinute + i;
            const hrs = Math.floor(minutes / 60)
              .toString()
              .padStart(2, '0');
            const mins = (minutes % 60).toString().padStart(2, '0');
            slots.push({ time: `${hrs}:${mins}`, available: true });
          }
        });
      }
      setTodayTimeSlots(slots);
    };

    generateTodaySlots();
  }, []);

  /* ---------------- Helpers ---------------- */
  const navigateDays = (direction: 'prev' | 'next') => {
    const first = visibleDays[0];
    const last = visibleDays[visibleDays.length - 1];

    if (direction === 'prev') {
      const newFirst = addDays(first, -7);
      const today = startOfDay(new Date());
      if (isBefore(newFirst, today)) {
        setVisibleDays(Array.from({ length: 14 }, (_, i) => addDays(today, i)));
      } else {
        setVisibleDays(
          Array.from({ length: 14 }, (_, i) => addDays(newFirst, i))
        );
      }
    } else {
      const newFirst = addDays(last, 1);
      setVisibleDays(
        Array.from({ length: 14 }, (_, i) => addDays(newFirst, i))
      );
    }
  };

  const handleFormSubmit = async (form: {
    name: string;
    email: string;
    phone: string;
    message?: string | null;
  }) => {
    if (!selectedDate || !selectedTimeSlot) {
      toast.error('Select a date & time first');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        userId: userId || '',
        dentistId: dentistId || '',
        appointmentDate: format(selectedDate, 'yyyy-MM-dd'),
        appointmentTime: selectedTimeSlot,
        patientName: form.name,
        patientPhone: form.phone,
        patientEmail: form.email,
        message: form.message ?? '',
      };

      const { data } = await axios.post('/api/appointments/book-any', payload);
      if (data.success) {
        toast.success('Appointment booked!');
        setStep('select');
        setSelectedTimeSlot(null);
        onSuccess?.();
      } else throw new Error(data.error || 'Booking failed');
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------- Animation helpers ---------------- */
  const [direction, setDirection] = useState(1);
  useEffect(() => setDirection(step === 'form' ? 1 : -1), [step]);

  const variants: Variants = {
    enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: 'tween', duration: 0.3 },
        opacity: { duration: 0.2 },
      },
    },
    exit: (dir: number) => ({
      x: dir < 0 ? '100%' : '-100%',
      opacity: 0,
      transition: { duration: 0.3 },
    }),
  };

  const renderDayCard = (date: Date) => {
    const isToday =
      format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
    const isSelected =
      format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');

    return (
      <div
        key={date.toISOString()}
        onClick={() => setSelectedDate(date)}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-lg p-4 transition-all ${
          isSelected
            ? 'bg-primary text-white'
            : isToday
              ? 'bg-blue-100'
              : 'bg-gray-50 hover:bg-gray-100'
        }`}
      >
        <span className="text-sm font-medium">{format(date, 'EEE')}</span>
        <span className="text-xl font-bold">{format(date, 'd')}</span>
        <span className="text-xs">{format(date, 'MMM')}</span>
      </div>
    );
  };

  /* ---------------- Render ---------------- */
  return (
    <div className="mx-auto w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-md">
      <div className="p-6">
        <h2 className="mb-8 text-2xl font-bold text-gray-800">
          Book Your Appointment
        </h2>

        {step === 'select' && todayTimeSlots.length > 0 && (
          <div className="mb-8">
            <CardTimeSlot
              businessHours={BUSINESS_HOURS}
              onTimeSlotSelect={time => {
                setSelectedTodayTime(time);
                setSelectedTimeSlot(time);
                setSelectedDate(new Date());
                setStep('form');
              }}
              selectedTime={selectedTodayTime}
              disabled={step !== 'select'}
            />
          </div>
        )}

        <div className="relative h-[580px]">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            {step === 'select' && (
              <motion.div
                key="select"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 w-full"
              >
                {/* Date slider */}
                <div className="mb-8">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="flex items-center text-lg font-semibold">
                      <Calendar className="mr-2 h-5 w-5" /> Select a Date
                    </h3>
                    <div className="flex space-x-2">
                      <Button
                        aria-label="Previous week"
                        onClick={() => navigateDays('prev')}
                        className="bg-secondary hover:bg-secondary-200 rounded-full p-2"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                      <Button
                        aria-label="Next week"
                        onClick={() => navigateDays('next')}
                        className="bg-secondary hover:bg-secondary-200 rounded-full p-2"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-2">
                    {visibleDays.slice(0, 7).map(renderDayCard)}
                  </div>
                  <div className="mt-2 grid grid-cols-7 gap-2">
                    {visibleDays.slice(7, 14).map(renderDayCard)}
                  </div>
                </div>

                {/* Time slots */}
                <div>
                  <h3 className="mb-4 flex items-center text-lg font-semibold">
                    <Clock className="mr-2 h-5 w-5" /> Available Time Slots for{' '}
                    {format(selectedDate, 'EEEE, MMMM d')}
                  </h3>

                  {isLoading ? (
                    <div className="flex justify-center py-12">
                      <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500" />
                    </div>
                  ) : timeSlots.length ? (
                    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
                      {timeSlots.map(slot => (
                        <Button
                          key={slot.time}
                          disabled={!slot.available}
                          onClick={() =>
                            slot.available &&
                            (setSelectedTimeSlot(slot.time), setStep('form'))
                          }
                          className={`rounded-md px-4 py-2 text-center transition-colors ${
                            slot.available
                              ? selectedTimeSlot === slot.time
                                ? 'bg-primary text-white'
                                : 'bg-secondary hover:bg-secondary-200 text-white'
                              : 'cursor-not-allowed bg-gray-100 text-gray-400'
                          }`}
                        >
                          {slot.time}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <p className="py-12 text-center text-gray-500">
                      No available slots.
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {step === 'form' && selectedTimeSlot && (
              <motion.div
                key="form"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 w-full"
              >
                <div className="rounded-lg border bg-gray-50 p-6">
                  <div className="relative">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => setStep('select')}
                      className="hover:text-primary-200 absolute top-0 left-0 flex items-center font-medium"
                    >
                      <ArrowLeft className="mr-1 h-5 w-5" /> Back
                    </Button>
                    <h3 className="mb-6 text-center text-lg font-semibold">
                      Complete Your Booking for {format(selectedDate, 'MMMM d')}{' '}
                      at {selectedTimeSlot}
                    </h3>
                  </div>

                  <AppointmentForm
                    userId={userId ?? ''}
                    selectedDate={format(selectedDate, 'yyyy-MM-dd')}
                    selectedTime={selectedTimeSlot}
                    isLoading={isLoading}
                    onSubmit={handleFormSubmit}
                    onBack={() => setStep('select')}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AppointmentBookingAny;

// src/components/AppointmentBooking.tsx
import axios from 'axios';
import { addDays, format, isBefore, startOfDay } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

// Import the external AppointmentForm component
import { AppointmentFormValues } from '@/schemas';
import AppointmentForm from './AppointmentForm';
import { BusinessHours } from './CardTimeSlot';
import { Button } from './ui/button';

// Define the time slot type
interface TimeSlot {
  time: string;
  available: boolean;
}

// Define the component props
interface AppointmentBookingProps {
  dentistId: string;
  userId: string; // Required - user must be authenticated
  mode: 'quick' | 'full'; // Add mode to dictate flow
  onSuccess?: () => void; // Add callback for successful booking
  businessHours?: BusinessHours; // Make business hours optional
  preselectedDate?: Date | null; // Add preselected date
  preselectedTimeSlot?: string | null; // Add preselected time slot
}

type Step = 'select' | 'form';

const AppointmentBooking: React.FC<AppointmentBookingProps> = ({
  dentistId,
  userId,
  mode,
  onSuccess,
  businessHours,
  preselectedDate,
  preselectedTimeSlot,
}) => {
  // Router hook must be at component top level
  const router = useRouter();

  // State for selected date and available time slots
  const [selectedDate, setSelectedDate] = useState<Date>(
    preselectedDate || startOfDay(new Date())
  );
  const [visibleDays, setVisibleDays] = useState<Date[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(
    preselectedTimeSlot || null
  );
  const [isLoading, setIsLoading] = useState(false);
  // Carousel step is now determined by the mode prop
  const [step, setStep] = useState<Step>(mode === 'quick' ? 'form' : 'select');

  // This useEffect is likely causing the issue by resetting state unexpectedly.
  // useState initializers already handle the initial state setup.
  // When the drawer is re-opened, the component is re-mounted, and useState initializers run again.
  useEffect(() => {
    // Sync date and time slot only when props change
    setSelectedDate(preselectedDate || startOfDay(new Date()));
    setSelectedTimeSlot(preselectedTimeSlot || null);
  }, [preselectedDate, preselectedTimeSlot]);

  useEffect(() => {
    // Sync step only when mode changes
    setStep(mode === 'quick' ? 'form' : 'select');
  }, [mode]);

  // Initialize visible days on component mount
  useEffect(() => {
    const today = startOfDay(new Date());
    const days = Array.from({ length: 14 }, (_, i) => addDays(today, i));
    setVisibleDays(days);
  }, []);

  // Fetch available time slots when selected date changes
  useEffect(() => {
    const fetchTimeSlots = async () => {
      setIsLoading(true);
      try {
        // API call to fetch available slots
        const response = await axios.get(`/api/appointments/availability`, {
          params: {
            dentistId,
            date: format(selectedDate, 'yyyy-MM-dd'),
          },
        });

        // Check if the API returned a success response with the new format
        if (response.data.success && Array.isArray(response.data.slots)) {
          setTimeSlots(response.data.slots);

          // If using default hours, show an informational toast
          if (response.data.isDefaultHours) {
            toast.info('Using standard business hours for this dentist');
          }
        } else if (Array.isArray(response.data)) {
          // Handle old API format (backward compatibility)
          setTimeSlots(response.data);
        } else {
          throw new Error('Invalid response format from availability API');
        }
      } catch (error) {
        console.error('Error fetching time slots:', error);
        toast.error(
          'Could not load available time slots. Please try again later.'
        );

        // Fallback to mock data if API fails
        const mockTimeSlots: TimeSlot[] = [
          { time: '09:00', available: true },
          { time: '09:30', available: true },
          { time: '10:00', available: false },
          { time: '10:30', available: true },
          { time: '11:00', available: true },
          { time: '11:30', available: false },
          { time: '13:00', available: true },
          { time: '13:30', available: true },
          { time: '14:00', available: true },
          { time: '14:30', available: false },
          { time: '15:00', available: true },
          { time: '15:30', available: true },
          { time: '16:00', available: true },
        ];

        setTimeSlots(mockTimeSlots);
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedDate) {
      fetchTimeSlots();
    }
  }, [selectedDate, dentistId]);

  // Handle navigation of the date slider
  const navigateDays = (direction: 'prev' | 'next') => {
    const firstDay = visibleDays[0];
    const lastDay = visibleDays[visibleDays.length - 1];

    if (direction === 'prev') {
      const newFirstDay = addDays(firstDay, -7);
      const today = startOfDay(new Date());

      // Don't allow scrolling to dates before today
      if (isBefore(newFirstDay, today)) {
        setVisibleDays(Array.from({ length: 14 }, (_, i) => addDays(today, i)));
      } else {
        setVisibleDays(
          Array.from({ length: 14 }, (_, i) => addDays(newFirstDay, i))
        );
      }
    } else {
      const newFirstDay = addDays(lastDay, 1);
      setVisibleDays(
        Array.from({ length: 14 }, (_, i) => addDays(newFirstDay, i))
      );
    }
  };

  // Handle time slot selection
  const handleTimeSlotSelect = (time: string) => {
    setSelectedTimeSlot(time);
    setStep('form');
  };

  // Handle back from form to slot selection
  const handleBack = () => {
    // If in 'quick' mode, 'Back' acts as a cancel button.
    // Otherwise, it goes back to the date/time selection step.
    if (mode === 'quick') {
      if (onSuccess) {
        onSuccess(); // This will close the modal in the parent component
      }
    } else {
      setStep('select');
    }
  };

  // Helper function to convert time format from "09:00 AM" to "09:00"
  const convertTo24HourFormat = (time12h: string): string => {
    // If already in 24-hour format, return as is
    if (!time12h.includes(' ')) {
      return time12h;
    }

    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');

    if (hours === '12') {
      hours = modifier === 'AM' ? '00' : '12';
    } else if (modifier === 'PM') {
      hours = (parseInt(hours, 10) + 12).toString();
    }

    return `${hours.padStart(2, '0')}:${minutes}`;
  };

  // Handle form submission
  const handleFormSubmit = async (formData: AppointmentFormValues) => {
    if (!selectedDate || !selectedTimeSlot) {
      toast.error('Please select a date and time for your appointment');
      return;
    }

    setIsLoading(true);

    try {
      // Format date and time
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      // Convert time format if needed (from "09:00 AM" to "09:00")
      const formattedTime = selectedTimeSlot.includes(' ')
        ? convertTo24HourFormat(selectedTimeSlot)
        : selectedTimeSlot;

      // Prepare appointment data with authenticated user
      const appointmentData = {
        dentistId,
        userId, // Now userId can be `session?.user?.id || 'anonymous'` or an empty string
        appointmentDate: formattedDate,
        appointmentTime: formattedTime,
        patientName: formData.name,
        patientPhone: formData.phone,
        patientEmail: formData.email,
        otherInfo: formData.message || '',
        message: formData.message || '',
      };

      // Send to the API endpoint
      const response = await axios.post(
        '/api/appointments/book',
        appointmentData
      );

      if (response.data.success) {
        toast.success('Appointment booked successfully!');

        // Get the appointment ID from the response
        const appointmentId =
          response.data.appointmentId || response.data.appointment?.id;

        if (appointmentId) {
          // Redirect to confirmation page
          router.push(`/appointment/${appointmentId}`);
        } else {
          // Fallback: call onSuccess callback if no appointment ID
          setSelectedTimeSlot(null);
          setStep('select');
          if (onSuccess) {
            onSuccess();
          }
        }
      } else {
        throw new Error(response.data.error || 'Failed to book appointment');
      }
    } catch (error: any) {
      console.error('Error booking appointment:', error);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        'Failed to book appointment. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Render the day card
  const renderDayCard = (date: Date) => {
    const isToday =
      format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
    const isSelected =
      format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');

    return (
      <motion.div
        key={format(date, 'yyyy-MM-dd')}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-lg p-4 transition-all ${isSelected ? 'bg-primary text-white' : isToday ? 'bg-blue-100' : 'bg-gray-50 hover:bg-gray-100'}`}
        onClick={() => setSelectedDate(date)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <span className="text-sm font-medium">{format(date, 'EEE')}</span>
        <span className="text-xl font-bold">{format(date, 'd')}</span>
        <span className="text-xs">{format(date, 'MMM')}</span>
      </motion.div>
    );
  };

  // Helper to get the year for a given week (array of 7 days)
  const getYearForWeek = (days: Date[]) => {
    if (days.length === 0) return '';
    // If week spans two years, show both (e.g. "2024 / 2025")
    const years = Array.from(new Set(days.map(d => format(d, 'yyyy'))));
    return years.length === 1 ? years[0] : years.join(' / ');
  };

  // Animation variants for different elements
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 },
  };

  const slotVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 },
  };

  return (
    <div className="mx-auto w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-md">
      <div className="p-6">
        {/* Container with animations */}
        <AnimatePresence mode="wait">
          {step === 'select' && (
            <motion.div
              key="select-step"
              className="w-full"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={containerVariants}
            >
              {/* Date slider */}
              <motion.div className="mb-8" variants={itemVariants}>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="flex items-center text-lg font-semibold">
                    <Calendar className="mr-2 h-5 w-5" />
                    Select a Date
                  </h3>
                  <div className="flex space-x-2">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Button
                        onClick={() => navigateDays('prev')}
                        className="bg-secondary hover:bg-secondary-200 rounded-full p-2 transition-colors"
                        aria-label="Previous week"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Button
                        onClick={() => navigateDays('next')}
                        className="bg-secondary hover:bg-secondary-200 rounded-full p-2 transition-colors"
                        aria-label="Next week"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </motion.div>
                  </div>
                </div>

                {/* Year above each week */}
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-500">
                    {getYearForWeek(visibleDays.slice(0, 7))}
                  </span>
                  <span className="text-sm font-semibold text-gray-500">
                    {getYearForWeek(visibleDays.slice(7, 14))}
                  </span>
                </div>

                <motion.div
                  className="grid grid-cols-7 gap-2"
                  variants={itemVariants}
                >
                  {visibleDays.slice(0, 7).map(renderDayCard)}
                </motion.div>
                <motion.div
                  className="mt-2 grid grid-cols-7 gap-2"
                  variants={itemVariants}
                >
                  {visibleDays.slice(7, 14).map(renderDayCard)}
                </motion.div>
              </motion.div>

              {/* Time slots */}
              <motion.div variants={itemVariants}>
                <h3 className="mb-4 flex items-center text-lg font-semibold">
                  <Clock className="mr-2 h-5 w-5" />
                  Available Time Slots for{' '}
                  {format(selectedDate, 'EEEE, MMMM d')}
                </h3>

                {isLoading ? (
                  <motion.div
                    className="flex justify-center py-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
                  </motion.div>
                ) : timeSlots.length > 0 ? (
                  <motion.div
                    className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5"
                    variants={containerVariants}
                  >
                    {timeSlots.map((slot, index) => (
                      <motion.div
                        key={slot.time}
                        variants={slotVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ delay: index * 0.03 }}
                        whileHover={slot.available ? { scale: 1.05 } : {}}
                        whileTap={slot.available ? { scale: 0.95 } : {}}
                      >
                        <Button
                          disabled={!slot.available}
                          className={`rounded-md px-4 py-2 text-center transition-colors ${
                            slot.available
                              ? selectedTimeSlot === slot.time
                                ? 'bg-primary text-white'
                                : 'bg-secondary hover:bg-secondary-200 text-white'
                              : 'cursor-not-allowed bg-gray-100 text-gray-400'
                          }`}
                          onClick={() =>
                            slot.available && handleTimeSlotSelect(slot.time)
                          }
                        >
                          {slot.time}
                        </Button>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.p
                    className="py-12 text-center text-gray-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    No available time slots for this date.
                  </motion.p>
                )}
              </motion.div>
            </motion.div>
          )}

          {step === 'form' && (
            <motion.div
              key="form-step"
              className="w-full"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={containerVariants}
            >
              <motion.div
                className="rounded-lg border bg-gray-50 p-6"
                variants={itemVariants}
              >
                <div className="relative">
                  <motion.div whileHover={{ x: -5 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      type="button"
                      onClick={handleBack}
                      className="hover:text-primary-200 left-0 mb-4 flex items-center font-medium text-black transition-colors"
                      variant="outline"
                    >
                      <ArrowLeft className="mr-1 h-5 w-5" />
                      {mode === 'quick' ? 'Cancel' : 'Back'}
                    </Button>
                  </motion.div>
                  <motion.h3
                    className="mb-6 text-center text-lg font-semibold"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {selectedTimeSlot ? (
                      <>
                        Complete Your Booking for{' '}
                        {format(selectedDate, 'MMMM d')} at {selectedTimeSlot}
                      </>
                    ) : (
                      'Complete Your Booking'
                    )}
                  </motion.h3>
                </div>
                {selectedTimeSlot ? (
                  /* Use the AppointmentForm component with our handleFormSubmit function */
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <AppointmentForm
                      userId={userId}
                      dentistId={dentistId}
                      selectedDate={format(selectedDate, 'yyyy-MM-dd')}
                      selectedTime={selectedTimeSlot}
                      isLoading={isLoading}
                      onSubmit={handleFormSubmit}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    className="py-8 text-center text-gray-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <p>Please select a time slot to continue.</p>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={() => setStep('select')}
                        className="mt-4"
                      >
                        Go Back to Time Selection
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AppointmentBooking;

// src/components/AppointmentForm.tsx
'use client';

import { createAppointment } from '@/app/actions/appointment';
import { AppointmentFormValues, appointmentSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

// shadcn/ui imports
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface AppointmentFormProps {
  onSubmit: (data: AppointmentFormValues) => Promise<void>;
  isLoading: boolean;
  userId?: string;
  dentistId?: string;
  selectedDate: string; // yyyy-MM-dd
  selectedTime: string; // HH:mm
}

export default function AppointmentForm({
  userId,
  dentistId,
  selectedDate,
  selectedTime,
  onSubmit: externalOnSubmit,
  isLoading: externalIsLoading,
}: AppointmentFormProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    error?: string;
  } | null>(null);

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
      date: selectedDate,
      time: selectedTime,
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: AppointmentFormValues) => {
    // If an external submit handler was provided, use that
    if (externalOnSubmit) {
      await externalOnSubmit(data);
      return;
    }

    // Otherwise use the internal server action
    setLoading(true);
    setResult(null);
    const res = await createAppointment(
      { ...data, date: selectedDate, time: selectedTime },
      userId ?? '',
      dentistId ?? ''
    );
    setResult(res);
    setLoading(false);
    if (res.success) reset();
  };

  // Use external loading state if provided, otherwise use internal state
  const isSubmittingOrLoading = externalIsLoading || loading || isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Your name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} placeholder="you@email.com" type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input {...field} placeholder="(555) 123-4567" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message (optional)</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value || ''}
                  placeholder="Any additional info?"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isSubmittingOrLoading}
          className="w-full"
        >
          {isSubmittingOrLoading ? 'Booking...' : 'Book Appointment'}
        </Button>
        {result && (
          <div className={result.success ? 'text-green-600' : 'text-red-600'}>
            {result.success ? 'Appointment booked!' : result.error}
          </div>
        )}
      </form>
    </Form>
  );
}

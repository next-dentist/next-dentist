'use client';

import {
  CostPageAppointment,
  createCostPageAppointment,
} from '@/app/actions/cost/CostPageAppointmentAction';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import LoadingSpinner from './LoadingSpinner';
import { Button } from './ui/button';

const appointmentSchema = z.object({
  patientName: z.string().min(1, 'Name is required'),
  patientPhone: z.string().min(1, 'Phone number is required'),
  patientEmail: z.string().email().optional().or(z.literal('')), // Allow empty string for optional email
  patientAge: z.string().optional().or(z.literal('')), // Allow empty string for optional fields
  patientGender: z.string().optional().or(z.literal('')), // Allow empty string for optional fields
  patientCity: z.string().optional().or(z.literal('')), // Allow empty string for optional fields
  patientCountry: z.string().optional().or(z.literal('')), // Allow empty string for optional fields
  costTableId: z.string().min(1, 'Cost Table ID is required'),
  costPageId: z.string().min(1, 'Cost Page ID is required'),
  dateAndTime: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: 'Invalid Date and Time format. Expected ISO-8601 DateTime.',
  }), // Validate dateAndTime to ensure it is a valid ISO-8601 DateTime
});

interface AppointmentBookingCostPageProps {
  costTablesID: string;
  pageID: string;
  tableSetID: string;
}

const AppointmentBookingCostPage: React.FC<AppointmentBookingCostPageProps> = ({
  costTablesID,
  pageID,
  tableSetID,
}) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof appointmentSchema>>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patientName: '',
      patientPhone: '',
      patientEmail: '',
      patientAge: '',
      patientGender: '',
      patientCity: '',
      patientCountry: '',
      costTableId: costTablesID,
      costPageId: pageID,
      dateAndTime: '', // Default value for date and time
    },
  });

  const onSubmit = async (data: z.infer<typeof appointmentSchema>) => {
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // Ensure all fields have a string value
      const submissionData: CostPageAppointment = {
        patientName: data.patientName,
        patientPhone: data.patientPhone,
        patientEmail: data.patientEmail || '',
        patientAge: data.patientAge || '',
        patientGender: data.patientGender || '',
        patientCity: data.patientCity || '',
        patientCountry: data.patientCountry || '',
        costTableId: costTablesID,
        costPageId: pageID,
        dateAndTime: data.dateAndTime, // Include date and time in submission data
      };

      const response = await createCostPageAppointment(submissionData);

      if ('error' in response) {
        setErrorMessage(response.error || 'Unknown error occurred');
      } else {
        router.push(`/cost/appointment/${response.data.id}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative space-y-4 p-2 sm:p-4">
      {loading && <LoadingSpinner fullScreen />}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2 sm:space-y-3"
        >
          <FormField
            control={form.control}
            name="patientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Patient Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Doe"
                    {...field}
                    className="h-8 text-sm"
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="patientPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Patient Phone</FormLabel>
                <FormControl>
                  <Input
                    placeholder="+1 123 456 7890"
                    {...field}
                    className="h-8 text-sm"
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="patientEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">
                  Patient Email (Optional)
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="john.doe@example.com"
                    type="email"
                    {...field}
                    className="h-8 text-sm"
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 gap-2 sm:gap-3 md:grid-cols-2">
            <FormField
              control={form.control}
              name="patientAge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">
                    Patient Age (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="30"
                      {...field}
                      className="h-8 text-sm"
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="patientGender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">
                    Patient Gender (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Male/Female/Other"
                      {...field}
                      className="h-8 text-sm"
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 gap-2 sm:gap-3 md:grid-cols-2">
            <FormField
              control={form.control}
              name="patientCity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">
                    Patient City (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="New York"
                      {...field}
                      className="h-8 text-sm"
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="patientCountry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">
                    Patient Country (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="USA"
                      {...field}
                      className="h-8 text-sm"
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="dateAndTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Date and Time</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    {...field}
                    className="h-8 text-sm"
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={loading}
            className="h-8 w-full text-sm"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </Button>
        </form>
      </Form>
      {errorMessage && (
        <p className="mt-2 text-xs text-red-500 sm:mt-4 sm:text-sm">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default AppointmentBookingCostPage;

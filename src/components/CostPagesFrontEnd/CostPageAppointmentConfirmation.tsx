'use client';

import {
  getCostPageAppointments,
  getCostPageById,
  getCostTableById,
} from '@/app/actions/cost/CostPageAppointmentAction';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CostPages, CostTable, costTableAppointment } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';

// Define the expected structure of the appointment data

const AppointmentConfirmation = ({ id }: { id: string }) => {
  // Fetch appointment details
  const {
    data: appointment,
    error,
    isLoading,
    refetch,
  } = useQuery<costTableAppointment | null>({
    // Specify type for better type safety
    queryKey: ['appointment', id],
    queryFn: () => getCostPageAppointments(id),
  });

  // Refetch appointment on component mount to ensure we have the latest data
  // This useEffect might be redundant with react-query's default behavior,
  // but keeping it if there's a specific reason for an immediate refetch on mount.
  useEffect(() => {
    refetch();
  }, [refetch]);

  // Fetch cost page details based on the appointment's costPageId
  // Note: The original code used the component's 'id' prop for costPage,
  // but the lint error suggests appointment?.costPageId is the correct key.
  // Assuming costPageId from appointment is the correct link.
  const { data: costPage, isLoading: isLoadingCostPage } =
    useQuery<CostPages | null>({
      queryKey: ['costPage', appointment?.costPageId], // Use appointment?.costPageId
      queryFn: () => getCostPageById(appointment?.costPageId || ''), // Use appointment?.costPageId
      enabled: !!appointment?.costPageId, // Enable only if appointment and costPageId exist
    });

  // Fetch cost table details based on the appointment's costTableId
  const { data: costTable, isLoading: isLoadingCostTable } =
    useQuery<CostTable | null>({
      queryKey: ['costTable', appointment?.costTableId],
      queryFn: () => getCostTableById(appointment?.costTableId || ''),
      enabled: !!appointment?.costTableId, // Enable only if appointment and costTableId exist
    });

  // Show loading state
  if (isLoading || isLoadingCostPage || isLoadingCostTable) {
    return (
      <div className="mx-auto max-w-4xl p-4">
        <Skeleton className="mb-4 h-12 w-full" />
        <Skeleton className="mb-4 h-48 w-full" />
        <Skeleton className="mb-4 h-36 w-full" />
      </div>
    );
  }

  // Show error state
  if (error) {
    toast.error('Failed to load appointment');
    return (
      <div className="mx-auto max-w-4xl p-4">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <XCircle className="h-6 w-6" />
              Error Loading Appointment
            </CardTitle>
            <CardDescription>Please try again later</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Show not found state
  if (!appointment) {
    return (
      <div className="mx-auto max-w-4xl p-4">
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-600">
              <Clock className="h-6 w-6" />
              No Appointment Found
            </CardTitle>
            <CardDescription>
              No appointment has been booked for this treatment yet
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Format the booking date/time
  const bookingDateTime = new Date(appointment.createdAt).toLocaleString();
  // 1987-10-10T04:40:00.000Z
  const appointmentDateTime = new Date(
    appointment.dateAndTime
  ).toLocaleString();

  // Render confirmation details
  return (
    <div className="mx-auto max-w-4xl space-y-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            Appointment Confirmation
          </CardTitle>
          {/* Updated description to include booking time */}
          <CardDescription>
            Your appointment has been successfully booked.
            <br />
            <div className="bg-primary-50 text-primary rounded-md border p-3">
              <span className="font-medium">Appointment Date and Time:</span>{' '}
              <span className="text-base font-semibold">
                {appointmentDateTime}
              </span>
            </div>
            <br />
            <br />
            Booked on: <span className="font-semibold">{bookingDateTime}</span>
            <br />
            Below are the details of your appointment.
            {/* NOTE: If you need to display the scheduled appointment date and time,
                please ensure the AppointmentDetails interface and the backend action
                include fields for this information. */}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Using a div with key is fine, but the key should probably be on the Card if rendering multiple appointments */}
          {/* Since we are rendering a single appointment based on ID, the key is not strictly necessary here */}
          <div className="space-y-6 rounded-lg border p-6">
            {' '}
            {/* Increased padding */}
            {/* Patient Details */}
            <div className="space-y-4">
              {' '}
              {/* Increased spacing */}
              <h3 className="border-b pb-2 text-xl font-semibold text-gray-800">
                Patient Details
              </h3>{' '}
              {/* Added border */}
              <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                {' '}
                {/* Increased gaps */}
                <div className="flex flex-col">
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {appointment.patientName}
                  </dd>
                </div>
                <div className="flex flex-col">
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {appointment.patientPhone}
                  </dd>
                </div>
                <div className="flex flex-col">
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {appointment.patientEmail || 'Not provided'}
                  </dd>
                </div>
                <div className="flex flex-col">
                  <dt className="text-sm font-medium text-gray-500">Age</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {appointment.patientAge || 'Not provided'}
                  </dd>
                </div>
                <div className="flex flex-col">
                  <dt className="text-sm font-medium text-gray-500">Gender</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {appointment.patientGender || 'Not provided'}
                  </dd>
                </div>
                <div className="flex flex-col">
                  <dt className="text-sm font-medium text-gray-500">
                    Location
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {appointment.patientCity && appointment.patientCountry
                      ? `${appointment.patientCity}, ${appointment.patientCountry}`
                      : 'Not provided'}
                  </dd>
                </div>
              </dl>
            </div>
            {/* Cost Details */}
            {costTable && (
              <div className="space-y-4">
                {' '}
                {/* Increased spacing */}
                <h3 className="border-b pb-2 text-xl font-semibold text-gray-800">
                  Cost Details
                </h3>{' '}
                {/* Added border */}
                <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                  {' '}
                  {/* Increased gaps */}
                  <div className="flex flex-col">
                    <dt className="text-sm font-medium text-gray-500">
                      Treatment
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {costTable.title}
                    </dd>
                  </div>
                  <div className="flex flex-col">
                    <dt className="text-sm font-medium text-gray-500">
                      Price Range
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {costTable.costOne || ''}
                      {costTable.costThree
                        ? ` - ${costTable.costThree}` // Added space for clarity
                        : ''}{' '}
                      {costTable.currencyOne || ''}
                      {!costTable.costOne &&
                        !costTable.costThree &&
                        !costTable.currencyOne &&
                        'Not provided'}{' '}
                      {/* Handle case where all are empty */}
                    </dd>
                  </div>
                </dl>
              </div>
            )}
            {/* Cost Page Details (Treatment Details) */}
            {costPage && (
              <div className="space-y-4">
                {' '}
                {/* Increased spacing */}
                <h3 className="border-b pb-2 text-xl font-semibold text-gray-800">
                  Treatment Details
                </h3>{' '}
                {/* Added border */}
                <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                  {' '}
                  {/* Increased gaps */}
                  <div className="flex flex-col sm:col-span-2">
                    {' '}
                    {/* Ensure it spans 2 columns on sm+ */}
                    <dt className="text-sm font-medium text-gray-500">
                      Treatment Name
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {costPage.title}
                    </dd>
                  </div>
                  <div className="flex flex-col sm:col-span-2">
                    {' '}
                    {/* Ensure it spans 2 columns on sm+ */}
                    <dt className="text-sm font-medium text-gray-500">
                      Description
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {costPage.content && typeof costPage.content === 'string'
                        ? `${costPage.content.substring(0, 200)}${costPage.content.length > 200 ? '...' : ''}` // Increased truncation length
                        : 'No description available'}
                    </dd>
                  </div>
                </dl>
              </div>
            )}
            {/* Appointment Details */}
            <div className="space-y-4">
              {' '}
              {/* Increased spacing */}
              <h3 className="border-b pb-2 text-xl font-semibold text-gray-800">
                Appointment Details
              </h3>{' '}
              {/* Added border */}
              {/* Displaying the booking time here as the actual appointment time is not available in the data */}
              <div className="flex items-center gap-4 text-sm text-gray-900">
                {' '}
                {/* Adjusted text color */}
                <Clock className="h-5 w-5 text-blue-600" />{' '}
                {/* Slightly smaller icon */}
                <span>Booked on: {bookingDateTime}</span>
              </div>
              {/* Add placeholder for scheduled appointment time if needed */}
              {/*
              <div className="flex items-center gap-4 text-sm text-gray-900">
                 <CalendarDays className="h-5 w-5 text-blue-600" />
                 <span>
                   Scheduled Date: {appointment.appointmentDate ? new Date(appointment.appointmentDate).toLocaleDateString() : 'Not specified'}
                 </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-900">
                 <Clock className="h-5 w-5 text-blue-600" />
                 <span>
                   Scheduled Time: {appointment.appointmentTime || 'Not specified'}
                 </span>
              </div>
              */}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentConfirmation;

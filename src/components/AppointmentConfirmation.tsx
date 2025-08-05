'use client';

import { getAppointment } from '@/app/(actions)/appointment/get';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Mail,
  Phone,
  User,
  XCircle,
} from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

interface AppointmentConfirmationProps {
  id: string;
}

const AppointmentConfirmation: React.FC<AppointmentConfirmationProps> = ({
  id,
}) => {
  const {
    data: appointmentResponse,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['appointment', id],
    queryFn: () => getAppointment(id),
  });

  /* ────────────────────────────── Loading ───────────────────────────── */
  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl p-4">
        <Skeleton className="mb-4 h-12 w-full" />
        <Skeleton className="mb-4 h-48 w-full" />
        <Skeleton className="mb-4 h-36 w-full" />
      </div>
    );
  }

  /* ─────────────────────────────── Error ────────────────────────────── */
  if (error) {
    toast.error('Failed to load appointment');
    return (
      <div className="mx-auto max-w-4xl p-4">
        <Card className="border-destructive/30 bg-destructive/10">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <XCircle className="h-6 w-6" />
              Error Loading Appointment
            </CardTitle>
            <CardDescription>
              Unable to retrieve appointment details. Please try again later or
              contact support.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  /* ───────────────────────── Unauthorised Access ────────────────────── */
  if (appointmentResponse && 'error' in appointmentResponse) {
    return (
      <div className="mx-auto max-w-4xl p-4">
        <Card className="border-destructive/30 bg-destructive/10">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <XCircle className="h-6 w-6" />
              Access Denied
            </CardTitle>
            <CardDescription>
              {appointmentResponse.error === 'Unauthorized'
                ? 'You are not authorized to view this appointment. Please log in and try again.'
                : appointmentResponse.error}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  /* ───────────────────────────── Not Found ──────────────────────────── */
  if (!appointmentResponse) {
    return (
      <div className="mx-auto max-w-4xl p-4">
        <Card className="border-secondary/40 bg-secondary/10">
          <CardHeader>
            <CardTitle className="text-secondary flex items-center gap-2">
              <AlertCircle className="h-6 w-6" />
              Appointment Not Found
            </CardTitle>
            <CardDescription>
              The appointment you're looking for could not be found. Please
              check the appointment ID and try again.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const appointment = appointmentResponse;

  /* ────────────────────────────── Helpers ───────────────────────────── */
  const bookingDateTime = new Date(appointment.createdAt).toLocaleString(
    'en-US',
    {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }
  );

  const appointmentDate = appointment.appointmentDate
    ? new Date(appointment.appointmentDate).toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  /* ────────────────────────────── Render ────────────────────────────── */
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4">
      {/* ───── Confirmation Card ───── */}
      <Card className="border-primary/20 from-secondary/10 via-tertiary/10 to-primary/10 bg-gradient-to-br">
        <CardHeader className="text-center">
          <CardTitle className="text-primary flex items-center justify-center gap-3 text-2xl">
            <CheckCircle className="h-8 w-8" />
            Appointment Request Received
          </CardTitle>
          <CardDescription className="text-lg">
            Thank you for scheduling your appointment with us. We have
            successfully received your request.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Status Badge */}
          <div className="mb-4 flex justify-center">
            <Badge
              variant="secondary"
              className="bg-secondary/20 text-secondary gap-1"
            >
              <Clock className="h-3 w-3" /> Pending Dentist Confirmation
            </Badge>
          </div>

          {/* Meta */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="bg-primary/5 rounded-lg p-4 shadow-sm">
              <div className="text-primary flex items-center gap-2 text-sm font-medium">
                <Calendar className="h-4 w-4" />
                Appointment ID
              </div>
              <p className="mt-1 font-mono text-lg font-semibold break-all">
                {appointment.id}
              </p>
            </div>
            <div className="bg-primary/5 rounded-lg p-4 shadow-sm">
              <div className="text-primary flex items-center gap-2 text-sm font-medium">
                <Clock className="h-4 w-4" />
                Request Submitted
              </div>
              <p className="mt-1 text-sm">{bookingDateTime}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ───── Details Card ───── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary flex items-center gap-2">
            <User className="h-6 w-6" />
            Appointment Details
          </CardTitle>
          <CardDescription>
            Review the information submitted with your appointment request
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Patient */}
          <section className="space-y-4">
            <h3 className="text-secondary border-b pb-2 text-lg font-semibold">
              Patient Information
            </h3>
            <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground text-sm font-medium">
                  Patient Name
                </dt>
                <dd className="mt-1 text-sm font-semibold">
                  {appointment.patientName || 'Not provided'}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-sm font-medium">
                  Phone Number
                </dt>
                <dd className="mt-1 flex items-center gap-1 text-sm">
                  <Phone className="h-3 w-3" />
                  {appointment.patientPhone || 'Not provided'}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-sm font-medium">
                  Email Address
                </dt>
                <dd className="mt-1 flex items-center gap-1 text-sm">
                  <Mail className="h-3 w-3" />
                  {appointment.patientEmail || 'Not provided'}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-sm font-medium">
                  Age
                </dt>
                <dd className="mt-1 text-sm">
                  {appointment.patientAge
                    ? `${appointment.patientAge} years`
                    : 'Not provided'}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-sm font-medium">
                  Gender
                </dt>
                <dd className="mt-1 text-sm">
                  {appointment.gender || 'Not provided'}
                </dd>
              </div>
            </dl>
          </section>

          {/* Schedule */}
          {appointmentDate && (
            <section className="space-y-4">
              <h3 className="text-secondary border-b pb-2 text-lg font-semibold">
                Requested Schedule
              </h3>
              <div className="bg-tertiary/10 rounded-lg p-4">
                <div className="text-tertiary flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span className="font-medium">Preferred Date & Time:</span>
                </div>
                <p className="mt-1 text-lg font-semibold">{appointmentDate}</p>
              </div>
            </section>
          )}

          {/* Notes */}
          {appointment.otherInfo && (
            <section className="space-y-4">
              <h3 className="text-secondary border-b pb-2 text-lg font-semibold">
                Additional Notes
              </h3>
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm">{appointment.otherInfo}</p>
              </div>
            </section>
          )}
        </CardContent>
      </Card>

      {/* ───── Next Steps ───── */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-primary flex items-center gap-2">
            <Clock className="h-6 w-6" />
            What Happens Next?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3 pl-1">
            {[
              'Our dental team will review your appointment request and medical information.',
              'You will receive a confirmation notification via email or SMS once approved.',
              'If any changes are needed, our team will contact you directly.',
            ].map((step, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="bg-primary flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white">
                  {index + 1}
                </span>
                <p className="text-sm">{step}</p>
              </li>
            ))}
          </ol>

          <div className="border-primary/20 bg-background mt-4 rounded-lg border p-3">
            <p className="text-muted-foreground text-xs">
              <strong>Need assistance?</strong> Contact our support team at{' '}
              <span className="font-semibold">support@nextdentist.com</span> or
              call <span className="font-semibold">+1 (555) 123-4567</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentConfirmation;

'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { format } from 'date-fns';
import {
  AlertCircle,
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  FileText,
  Info,
  MapPin,
  Phone,
  User,
  XCircle,
} from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type AppointmentStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED_BY_PATIENT'
  | 'CANCELLED_BY_DENTIST'
  | 'RESCHEDULED'
  | 'COMPLETED'
  | 'NO_SHOW';

interface Appointment {
  id: string;
  appointmentDate: string;
  appointmentTime: string;
  status: AppointmentStatus;
  patientName: string | null;
  patientPhone: string;
  patientEmail: string | null;
  otherInfo: string | null;
  createdAt: string;
  dentist: {
    id: string;
    name: string | null;
    phone: string | null;
    email: string | null;
    image: string | null;
    city: string | null;
    state: string | null;
    clinicName: string | null;
    clinicAddress: string | null;
  };
}

interface UserAppointmentsProps {
  userId: string;
}

// Get status badge function (defined outside component to avoid scope issues)
const getStatusBadge = (status: AppointmentStatus) => {
  const statusConfig = {
    PENDING: { variant: 'secondary' as const, icon: Clock, text: 'Pending' },
    APPROVED: {
      variant: 'default' as const,
      icon: CheckCircle,
      text: 'Confirmed',
    },
    COMPLETED: {
      variant: 'default' as const,
      icon: CheckCircle,
      text: 'Completed',
    },
    CANCELLED_BY_PATIENT: {
      variant: 'destructive' as const,
      icon: XCircle,
      text: 'Cancelled by You',
    },
    CANCELLED_BY_DENTIST: {
      variant: 'destructive' as const,
      icon: XCircle,
      text: 'Cancelled by Dentist',
    },
    REJECTED: {
      variant: 'destructive' as const,
      icon: XCircle,
      text: 'Rejected',
    },
    RESCHEDULED: {
      variant: 'default' as const,
      icon: Calendar,
      text: 'Rescheduled',
    },
    NO_SHOW: {
      variant: 'destructive' as const,
      icon: User,
      text: 'No Show',
    },
  };

  const config = statusConfig[status] || statusConfig.PENDING;
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <Icon className="h-3 w-3" />
      {config.text}
    </Badge>
  );
};

const UserAppointments: React.FC<UserAppointmentsProps> = ({ userId }) => {
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // Fetch user appointments
  const {
    data: appointments,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['userAppointments', userId],
    queryFn: async () => {
      const response = await axios.get(`/api/appointments/user/${userId}`);
      return response.data.appointments as Appointment[];
    },
  });

  // Cancel appointment
  const handleCancelAppointment = async (appointmentId: string) => {
    setCancellingId(appointmentId);
    try {
      await axios.patch(`/api/appointments/${appointmentId}/cancel`);
      toast.success('Appointment cancelled successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to cancel appointment');
      console.error('Error cancelling appointment:', error);
    } finally {
      setCancellingId(null);
    }
  };

  // Separate appointments by status
  const upcomingAppointments =
    appointments?.filter(
      apt =>
        apt.status === 'PENDING' ||
        apt.status === 'APPROVED' ||
        apt.status === 'RESCHEDULED'
    ) || [];

  const pastAppointments =
    appointments?.filter(
      apt =>
        apt.status === 'COMPLETED' ||
        apt.status === 'CANCELLED_BY_PATIENT' ||
        apt.status === 'CANCELLED_BY_DENTIST' ||
        apt.status === 'REJECTED' ||
        apt.status === 'NO_SHOW'
    ) || [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/20 bg-destructive/10">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <XCircle className="h-5 w-5" />
            Error Loading Appointments
          </CardTitle>
          <CardDescription className="text-destructive/80">
            Unable to load your appointments. Please try again later.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => refetch()} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 rounded-full p-3">
                <Calendar className="text-primary h-6 w-6" />
              </div>
              <div>
                <p className="text-foreground text-2xl font-bold">
                  {upcomingAppointments.length}
                </p>
                <p className="text-muted-foreground text-sm">Upcoming</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-green-500/10 p-3">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-foreground text-2xl font-bold">
                  {
                    pastAppointments.filter(apt => apt.status === 'COMPLETED')
                      .length
                  }
                </p>
                <p className="text-muted-foreground text-sm">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-secondary/10 rounded-full p-3">
                <User className="text-secondary h-6 w-6" />
              </div>
              <div>
                <p className="text-foreground text-2xl font-bold">
                  {appointments?.length || 0}
                </p>
                <p className="text-muted-foreground text-sm">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="info">Appointment Info</TabsTrigger>
          <TabsTrigger value="tips">Care Tips</TabsTrigger>
        </TabsList>

        {/* Upcoming Appointments */}
        <TabsContent value="upcoming" className="space-y-4">
          {upcomingAppointments.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="text-muted-foreground/50 mx-auto mb-4 h-12 w-12" />
                <h3 className="text-foreground mb-2 text-lg font-semibold">
                  No Upcoming Appointments
                </h3>
                <p className="text-muted-foreground mb-4">
                  You don't have any upcoming appointments scheduled.
                </p>
                <Button onClick={() => (window.location.href = '/dentists')}>
                  Book an Appointment
                </Button>
              </CardContent>
            </Card>
          ) : (
            upcomingAppointments.map(appointment => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onCancel={handleCancelAppointment}
                cancellingId={cancellingId}
                isUpcoming={true}
              />
            ))
          )}
        </TabsContent>

        {/* Appointment History */}
        <TabsContent value="history" className="space-y-4">
          {pastAppointments.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="text-muted-foreground/50 mx-auto mb-4 h-12 w-12" />
                <h3 className="text-foreground mb-2 text-lg font-semibold">
                  No Appointment History
                </h3>
                <p className="text-muted-foreground">
                  Your completed and cancelled appointments will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            pastAppointments.map(appointment => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onCancel={handleCancelAppointment}
                cancellingId={cancellingId}
                isUpcoming={false}
              />
            ))
          )}
        </TabsContent>

        {/* Appointment Information */}
        <TabsContent value="info">
          <AppointmentInfoSection />
        </TabsContent>

        {/* Care Tips */}
        <TabsContent value="tips">
          <CareTipsSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Individual Appointment Card Component
interface AppointmentCardProps {
  appointment: Appointment;
  onCancel: (id: string) => void;
  cancellingId: string | null;
  isUpcoming: boolean;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onCancel,
  cancellingId,
  isUpcoming,
}) => {
  const appointmentDate = new Date(appointment.appointmentDate);
  const formattedDate = format(appointmentDate, 'EEEE, MMMM d, yyyy');
  const canCancel =
    isUpcoming &&
    (appointment.status === 'PENDING' || appointment.status === 'APPROVED');

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {appointment.dentist.name}
            </CardTitle>
            <CardDescription>
              {appointment.dentist.clinicName &&
                `${appointment.dentist.clinicName} • `}
              {appointment.dentist.city}, {appointment.dentist.state}
            </CardDescription>
          </div>
          {getStatusBadge(appointment.status)}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Date & Time */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex items-center gap-2">
            <Calendar className="text-muted-foreground h-4 w-4" />
            <span className="text-sm">{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="text-muted-foreground h-4 w-4" />
            <span className="text-sm">{appointment.appointmentTime}</span>
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {appointment.dentist.phone && (
            <div className="flex items-center gap-2">
              <Phone className="text-muted-foreground h-4 w-4" />
              <span className="text-sm">{appointment.dentist.phone}</span>
            </div>
          )}
          {appointment.dentist.clinicAddress && (
            <div className="flex items-center gap-2">
              <MapPin className="text-muted-foreground h-4 w-4" />
              <span className="text-sm">
                {appointment.dentist.clinicAddress}
              </span>
            </div>
          )}
        </div>

        {/* Additional Information */}
        {appointment.otherInfo && (
          <div className="bg-muted/50 rounded-md p-3">
            <p className="text-foreground text-sm">
              <strong>Notes:</strong> {appointment.otherInfo}
            </p>
          </div>
        )}

        {/* Actions */}
        {isUpcoming && (
          <div className="flex gap-2 border-t pt-4">
            {appointment.dentist.phone && (
              <Button variant="outline" size="sm" asChild>
                <a href={`tel:${appointment.dentist.phone}`}>
                  <Phone className="mr-1 h-4 w-4" />
                  Call Dentist
                </a>
              </Button>
            )}
            {canCancel && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onCancel(appointment.id)}
                disabled={cancellingId === appointment.id}
              >
                {cancellingId === appointment.id ? 'Cancelling...' : 'Cancel'}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Appointment Information Section
const AppointmentInfoSection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Before Your Appointment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-2">
            <CheckCircle className="mt-0.5 h-4 w-4 text-green-500" />
            <p className="text-sm">Arrive 15 minutes early for check-in</p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="mt-0.5 h-4 w-4 text-green-500" />
            <p className="text-sm">Bring a valid ID and insurance card</p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="mt-0.5 h-4 w-4 text-green-500" />
            <p className="text-sm">
              Complete medical history forms if first visit
            </p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="mt-0.5 h-4 w-4 text-green-500" />
            <p className="text-sm">List current medications and allergies</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Cancellation Policy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-2">
            <Bell className="text-primary mt-0.5 h-4 w-4" />
            <p className="text-sm">Cancel at least 24 hours in advance</p>
          </div>
          <div className="flex items-start gap-2">
            <Bell className="text-primary mt-0.5 h-4 w-4" />
            <p className="text-sm">Late cancellations may incur fees</p>
          </div>
          <div className="flex items-start gap-2">
            <Bell className="text-primary mt-0.5 h-4 w-4" />
            <p className="text-sm">Contact us for rescheduling options</p>
          </div>
          <div className="flex items-start gap-2">
            <Bell className="text-primary mt-0.5 h-4 w-4" />
            <p className="text-sm">Emergency appointments available</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment & Insurance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-2">
            <CreditCard className="text-secondary mt-0.5 h-4 w-4" />
            <p className="text-sm">Payment is due at time of service</p>
          </div>
          <div className="flex items-start gap-2">
            <CreditCard className="text-secondary mt-0.5 h-4 w-4" />
            <p className="text-sm">
              We accept major credit cards and insurance
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            What to Expect
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-600">
            Your dental visit typically includes:
          </p>
          <ul className="ml-4 space-y-1 text-sm">
            <li>• Review of medical and dental history</li>
            <li>• Clinical examination</li>
            <li>• X-rays if necessary</li>
            <li>• Discussion of treatment options</li>
            <li>• Cost estimates and scheduling</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

// Care Tips Section
const CareTipsSection: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Post-Appointment Care</CardTitle>
        <CardDescription>
          General tips for after your visit. Follow specific instructions from
          your dentist.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <h4 className="font-semibold">Do's</h4>
          <div className="flex items-start gap-2">
            <CheckCircle className="mt-0.5 h-4 w-4 text-green-500" />
            <p className="text-sm">
              Follow your dentist's specific instructions
            </p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="mt-0.5 h-4 w-4 text-green-500" />
            <p className="text-sm">Maintain good oral hygiene</p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="mt-0.5 h-4 w-4 text-green-500" />
            <p className="text-sm">
              Attend follow-up appointments as scheduled
            </p>
          </div>
        </div>
        <div className="space-y-3">
          <h4 className="font-semibold">Don'ts</h4>
          <div className="flex items-start gap-2">
            <XCircle className="text-destructive mt-0.5 h-4 w-4" />
            <p className="text-sm">
              Avoid hard, sticky, or chewy foods if advised
            </p>
          </div>
          <div className="flex items-start gap-2">
            <XCircle className="text-destructive mt-0.5 h-4 w-4" />
            <p className="text-sm">Don't smoke or use tobacco products</p>
          </div>
          <div className="flex items-start gap-2">
            <XCircle className="text-destructive mt-0.5 h-4 w-4" />
            <p className="text-sm">Do not ignore pain, swelling, or bleeding</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserAppointments;

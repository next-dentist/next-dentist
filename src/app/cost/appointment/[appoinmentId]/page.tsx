import AppointmentConfirmation from '@/components/CostPagesFrontEnd/CostPageAppointmentConfirmation';

export default async function ConfirmAppointment({
  params,
}: {
  params: { appointmentId: string };
}) {
  const { appointmentId } = await params;
  return <AppointmentConfirmation id={appointmentId as string} />;
}

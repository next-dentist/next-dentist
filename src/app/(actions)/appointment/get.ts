'use server';
import { auth } from '@/auth';
import { db } from '@/db';
import { revalidatePath } from 'next/cache';




export async function getAppointment(id: string) {
  const session = await auth();
  if (!session?.user) {
    return { error: 'Unauthorized' };
  }
  const appointment = await db.appointment.findUnique({
    where: { id },
  });
  revalidatePath('/');
  return appointment;
}

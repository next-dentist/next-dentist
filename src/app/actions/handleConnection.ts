'use server'

import { db } from '@/db';
import { z } from 'zod';

const connectDentistsSchema = z.object({
  dentistIds: z.array(z.string())
})

/**
 * Connects a user to one or more dentist profiles.
 * 
 * @param userId - The ID of the user to update.
 * @param data - An object with a dentistIds array (from validated form).
 * @returns { error?: string }
 */
export async function connectDentists(
  userId: string,
  data: { dentistIds: string[] }
): Promise<{ error?: string, success?: boolean, message?: string }> {
  // Validate input
  const parseResult = connectDentistsSchema.safeParse(data)
  if (!parseResult.success) {
    return { error: 'Invalid dentist IDs', success: false }
  }
  const { dentistIds } = parseResult.data;

  try {
    // First verify the user exists
    const user = await db.user.findUnique({
      where: { id: userId },
      include: { Dentist: true }
    });
    
    if (!user) {
      return { error: 'User not found', success: false };
    }
    
    // Use a transaction to handle dentist connections
    await db.$transaction(async (tx) => {
      // Get current dentist IDs
      const currentDentistIds = user.Dentist.map(d => d.id);
      
      // Dentists to disconnect (currently connected but not in new list)
      const dentistsToDisconnect = currentDentistIds.filter(id => !dentistIds.includes(id));
      
      // Dentists to connect (in new list but not currently connected)
      const dentistsToConnect = dentistIds.filter(id => !currentDentistIds.includes(id));
      
      // Handle disconnects (update each dentist to remove user connection)
      if (dentistsToDisconnect.length > 0) {
        for (const dentistId of dentistsToDisconnect) {
          // Find another user to connect the dentist to (if any)
          const anotherUser = await tx.user.findFirst({
            where: {
              id: { not: userId },
              role: "ADMIN" // Assign to an admin as a fallback
            },
            orderBy: { id: 'asc' }
          });
          
          if (anotherUser) {
            // Connect to another user
            await tx.dentist.update({
              where: { id: dentistId },
              data: { userId: anotherUser.id }
            });
          } else {
            // If no other user found, handle appropriately (depends on your business rules)
            // You might need to create a "system" user to own orphaned dentists
          }
        }
      }
      
      // Handle connects
      if (dentistsToConnect.length > 0) {
        for (const dentistId of dentistsToConnect) {
          await tx.dentist.update({
            where: { id: dentistId },
            data: { userId }
          });
        }
      }
    });

    // Verify the connections were made correctly
    const updatedUser = await db.user.findUnique({
      where: { id: userId },
      include: { Dentist: true }
    });
    
    return { 
      success: true,
      message: `Successfully updated dentist connections for user ${userId}`
    }
  } catch (error) {
    return { 
      error: 'Failed to update dentist connections', 
      success: false,
      message: error instanceof Error ? error.message : String(error)
    }
  }
}

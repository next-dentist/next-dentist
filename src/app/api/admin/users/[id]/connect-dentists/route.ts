'use server'

import { db } from '@/db'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const connectDentistsSchema = z.object({
  dentistIds: z.array(z.string())
})

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id: userId } = params
    
    const body = await request.json()
    
    const validation = connectDentistsSchema.safeParse(body)
    if (!validation.success) {
      console.error(`Validation error:`, validation.error.format())
      return NextResponse.json({ error: 'Invalid data', details: validation.error.format() }, { status: 400 })
    }
    
    const { dentistIds } = validation.data

    // Check if user exists
    const user = await db.user.findUnique({ where: { id: userId } })
    if (!user) {
      console.error(`User not found: ${userId}`)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get currently connected dentists for logging
    const currentConnections = await db.dentist.findMany({
      where: { userId },
      select: { id: true }
    })

    // Use a transaction to ensure all operations complete or none do
    const result = await db.$transaction(async (tx) => {
      // 1. First, disconnect all existing dentists from this user
      const disconnectResult = await tx.dentist.updateMany({
        where: { userId },
        data: { userId: undefined } // Use undefined instead of null
      })
      
      // 2. Then, if there are dentists to connect, connect them
      let connectResult = { count: 0 }
      if (dentistIds.length > 0) {
        connectResult = await tx.dentist.updateMany({
          where: { id: { in: dentistIds } },
          data: { userId }
        })
      }
      
      return { disconnected: disconnectResult.count, connected: connectResult.count }
    })

    // Verify the connections after transaction
    const newConnections = await db.dentist.findMany({
      where: { userId },
      select: { id: true }
    })

    // Verify if expected changes were made
    const expectedConnections = new Set(dentistIds)
    const actualConnections = new Set(newConnections.map(d => d.id))
    const allMatch = dentistIds.length === newConnections.length && 
                    dentistIds.every(id => actualConnections.has(id))
    
    if (!allMatch) {
      console.warn("Warning: Connected dentists don't match expected list")
      console.warn(`Expected: ${dentistIds.join(', ')}`)
      console.warn(`Actual: ${newConnections.map(d => d.id).join(', ')}`)
    }

    return NextResponse.json({ 
      success: true, 
      message: dentistIds.length > 0 
        ? `Dentist connections updated successfully (${result.connected} connected, ${result.disconnected} disconnected)` 
        : 'All dentists disconnected successfully',
      connectedDentists: newConnections.map(d => d.id)
    })
  } catch (error) {
    console.error('Error updating dentist connections:', error)
    return NextResponse.json({ 
      error: 'Failed to update dentist connections', 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}




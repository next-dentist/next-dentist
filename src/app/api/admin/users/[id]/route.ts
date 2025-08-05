import { db } from '@/db'
import bcrypt from 'bcrypt'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Zod schemas for validation
const userUpdateSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  gender: z.string().optional(),
  dob: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  zip: z.string().optional(),
  image: z.string().optional(),
  role: z.enum(['USER', 'ADMIN', 'DENTIST']).optional(),
})

// Updated schema with two possibilities: admin direct change or user change with current password
const passwordChangeSchema = z.union([
  // Admin direct password change (no current password needed)
  z.object({
    newPassword: z.string().min(8),
    isAdminChange: z.literal(true).optional(),
  }),
  // Regular user password change (requires current password)
  z.object({
    currentPassword: z.string(),
    newPassword: z.string().min(8),
  }),
])

const singleFieldUpdateSchema = z.object({
  field: z.enum([
    'name', 'email', 'phone', 'gender', 'dob', 'address', 
    'city', 'state', 'country', 'zip', 'image'
  ]),
  value: z.string(),
})

// Get a single user by ID, optionally with connected dentists
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const url = new URL(request.url)
    const includeDentists = url.searchParams.get('includeDentists') === '1'

    if (includeDentists) {
      // Fetch user and all dentists where userId matches
      const [user, dentists] = await Promise.all([
        db.user.findUnique({
          where: { id },
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true,
            gender: true,
            dob: true,
            address: true,
            city: true,
            state: true,
            country: true,
            zip: true,
            emailVerified: true,
            role: true,
          },
        }),
        db.dentist.findMany({
          where: { userId: id },
          select: {
            id: true,
            name: true,
            email: true,
            speciality: true,
          },
        })
      ])
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }
      return NextResponse.json({ ...user, dentists })
    }

    // Default: just user
    const user = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        gender: true,
        dob: true,
        address: true,
        city: true,
        state: true,
        country: true,
        zip: true,
        emailVerified: true,
        role: true,
      },
    })
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}

// Update a user
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    
    // Validate request body
    const validation = userUpdateSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: validation.error.format() },
        { status: 400 }
      )
    }
    
    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { id },
    })
    
    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    // If email is being updated, check if it's already in use
    if (validation.data.email && validation.data.email !== existingUser.email) {
      const emailInUse = await db.user.findUnique({
        where: { email: validation.data.email },
      })
      
      if (emailInUse) {
        return NextResponse.json(
          { error: 'Email already in use' },
          { status: 409 }
        )
      }
    }
    
    // Update user
    const updatedUser = await db.user.update({
      where: { id },
      data: validation.data,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        gender: true,
        dob: true,
        address: true,
        city: true,
        state: true,
        country: true,
        zip: true,
        role: true,
      },
    })
    
    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}

// Delete a user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { id },
    })
    
    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    // Delete user
    await db.user.delete({
      where: { id },
    })
    
    return NextResponse.json(
      { message: 'User deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}

// PATCH endpoints for specific operations
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const operation = request.headers.get('X-Operation')
    
    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { id },
    })
    
    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    // Handle different operations based on X-Operation header
    switch (operation) {
      case 'change-password':
        return handlePasswordChange(id, body, existingUser)
      
      case 'update-field':
        return handleSingleFieldUpdate(id, body)
      
      default:
        return NextResponse.json(
          { error: 'Invalid operation' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error in PATCH operation:', error)
    return NextResponse.json(
      { error: 'Operation failed' },
      { status: 500 }
    )
  }
}

// Helper functions for PATCH operations
async function handlePasswordChange(
  userId: string,
  body: any,
  user: any
) {
  // Validate password change data
  const validation = passwordChangeSchema.safeParse(body)
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Invalid data', details: validation.error.format() },
      { status: 400 }
    )
  }
  
  // Check if this is an admin direct change (no current password required)
  const isAdminChange = 'isAdminChange' in validation.data || !('currentPassword' in validation.data);
  
  // If it's not an admin change, verify the current password
  if (!isAdminChange) {
    const { currentPassword } = validation.data as { currentPassword: string, newPassword: string };
    
    // Verify current password
    if (!user.password) {
      return NextResponse.json(
        { error: 'Cannot change password for this account' },
        { status: 400 }
      )
    }
    
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    )
    
    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 401 }
      )
    }
  }
  
  // Hash and update new password
  const hashedPassword = await bcrypt.hash(validation.data.newPassword, 10)
  
  await db.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  })
  
  return NextResponse.json(
    { message: 'Password updated successfully' },
    { status: 200 }
  )
}

async function handleSingleFieldUpdate(
  userId: string,
  body: any
) {
  // Validate single field update data
  const validation = singleFieldUpdateSchema.safeParse(body)
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Invalid data', details: validation.error.format() },
      { status: 400 }
    )
  }
  
  const { field, value } = validation.data
  
  // If updating email, check if it's already in use
  if (field === 'email') {
    const emailInUse = await db.user.findUnique({
      where: { email: value },
    })
    
    if (emailInUse && emailInUse.id !== userId) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 409 }
      )
    }
  }
  
  // Update the single field
  const updatedUser = await db.user.update({
    where: { id: userId },
    data: { [field]: value },
    select: {
      id: true,
      [field]: true,
    },
  })
  
  return NextResponse.json(updatedUser)
} 
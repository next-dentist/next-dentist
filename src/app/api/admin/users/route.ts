'use server'

import { db } from '@/db'
import bcrypt from 'bcrypt'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Zod schemas for validation
const userBaseSchema = z.object({
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
  role: z.enum(['USER', 'ADMIN', 'DENTIST']).optional(),
})

const createUserSchema = userBaseSchema.extend({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['USER', 'ADMIN', 'DENTIST']).default('USER'),
})

// Get all users with pagination
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const search = url.searchParams.get('search') || ''
    
    const skip = (page - 1) * limit
    
    const whereClause = search 
      ? {
          OR: [
            { name: { contains: search } },
            { email: { contains: search } },
            { phone: { contains: search } },
          ],
        } 
      : {}
    
    const [users, totalCount] = await Promise.all([
      db.user.findMany({
        where: whereClause,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          image: true,
          gender: true,
          role: true,
          city: true,
          state: true,
          country: true,
          emailVerified: true,
        },
        skip,
        take: limit,
      }),
      db.user.count({ where: whereClause }),
    ])
    
    return NextResponse.json({
      users,
      meta: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

// Create a new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validation = createUserSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: validation.error.format() },
        { status: 400 }
      )
    }
    
    const { password, ...userData } = validation.data
    
    // Check if user with email already exists
    const existingUser = await db.user.findUnique({
      where: { email: userData.email },
    })
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)
    
    // Create user
    const newUser = await db.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        gender: true,
        role: true,
      },
    })
    
    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}

// Get user by ID (moved to [id]/route.ts)
// Update user by ID (moved to [id]/route.ts)
// Delete user (moved to [id]/route.ts)




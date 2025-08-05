'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { z } from 'zod'

// User schema for validation
const userSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  image: z.string().nullable(),
  gender: z.string().nullable(),
  role: z.string().nullable(),
  city: z.string().nullable(),
  state: z.string().nullable(),
  country: z.string().nullable(),
  emailVerified: z.boolean().nullable(),
})

const metaSchema = z.object({
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
})

const usersResponseSchema = z.object({
  users: z.array(userSchema),
  meta: metaSchema,
})

export interface AdminUser {
  id: string
  name?: string | null
  email?: string | null
  phone?: string | null
  image?: string | null
  gender?: string | null
  role?: string | null
  city?: string | null
  state?: string | null
  country?: string | null
  emailVerified?: boolean | null
}

export interface AdminUsersMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface UseAdminUsersResult {
  users: AdminUser[]
  meta: AdminUsersMeta | null
  isLoading: boolean
  isError: boolean
  error: any
  refetch: () => void
}

interface FetchUsersParams {
  page?: number
  limit?: number
  search?: string
}

const fetchAdminUsers = async ({
  page = 1,
  limit = 10,
  search = '',
}: FetchUsersParams = {}) => {
  const params = new URLSearchParams()
  params.append('page', String(page))
  params.append('limit', String(limit))
  if (search) params.append('search', search)

  const res = await fetch(`/api/admin/users?${params.toString()}`)
  if (!res.ok) {
    throw new Error('Failed to fetch users')
  }
  const data = await res.json()
  const parsed = usersResponseSchema.safeParse(data)
  if (!parsed.success) {
    throw new Error('Invalid users data format')
  }
  return parsed.data
}

export function useAdminUsers(params: FetchUsersParams = {}) : UseAdminUsersResult {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['admin-users', params],
    queryFn: () => fetchAdminUsers(params),
    placeholderData: keepPreviousData,
  })

  return {
    users: data?.users ?? [],
    meta: data?.meta ?? null,
    isLoading,
    isError,
    error,
    refetch,
  }
}

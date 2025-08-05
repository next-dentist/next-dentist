'use client';

import { connectDentists } from '@/app/actions/handleConnection';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AdminUser, useAdminUsers } from '@/hooks/useAdminUsers';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  PaginationState,
  useReactTable,
} from '@tanstack/react-table';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Edit,
  Key,
  Loader2,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  UserPlus,
  X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

// Schema for user form validation
const userFormSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  gender: z.string().optional(),
  role: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
});

// Schema for password change validation
const passwordChangeSchema = z
  .object({
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Confirm password is required'),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// Dentist connection schema - simple approach without complex types
const dentistConnectionSchema = z.object({
  dentistIds: z.array(z.string()),
});

// Dentist interface
interface Dentist {
  id: string;
  name?: string | null;
  email?: string | null;
  speciality?: string | null;
  image?: string | null;
}

type UserFormValues = z.infer<typeof userFormSchema>;
type PasswordChangeValues = z.infer<typeof passwordChangeSchema>;
type DentistConnectionValues = z.infer<typeof dentistConnectionSchema>;

// Add schema for new user form
const newUserSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Valid email is required'),
    phone: z.string().optional(),
    gender: z.string().optional(),
    role: z.enum(['USER', 'ADMIN', 'DENTIST']),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type NewUserFormValues = z.infer<typeof newUserSchema>;

const UserListClient: React.FC = () => {
  // Query client for cache invalidation
  const queryClient = useQueryClient();

  // Pagination state
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [dentistDialogOpen, setDentistDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newUserDialogOpen, setNewUserDialogOpen] = useState(false);

  // Selected user state
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  // Dentist list state
  const [dentists, setDentists] = useState<Dentist[]>([]);
  const [loadingDentists, setLoadingDentists] = useState(false);

  // Connection mode
  const [selectedDentistIds, setSelectedDentistIds] = useState<string[]>([]);

  // Loading states
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dentist search state
  const [dentistSearch, setDentistSearch] = useState('');

  // Fetch users with pagination and search
  const { users, meta, isLoading, refetch } = useAdminUsers({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: debouncedSearchQuery,
  });

  // Debounce search query
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Fetch dentists when needed
  useEffect(() => {
    if (dentistDialogOpen) {
      fetchDentists();
    }
  }, [dentistDialogOpen]);

  // Fetch dentists function
  const fetchDentists = async (search = '') => {
    setLoadingDentists(true);
    try {
      const params = new URLSearchParams();
      params.set('limit', '500');
      if (search) params.set('search', search);
      const response = await fetch(`/api/admin/dentists?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch dentists');
      }
      const data = await response.json();
      setDentists(data.dentists || []);
    } catch (error) {
      toast.error('Failed to load dentists');
    } finally {
      setLoadingDentists(false);
    }
  };

  // Forms
  const editForm = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      gender: '',
      role: '',
      city: '',
      state: '',
      country: '',
    },
  });

  const passwordForm = useForm<PasswordChangeValues>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const dentistForm = useForm<DentistConnectionValues>({
    resolver: zodResolver(dentistConnectionSchema),
    defaultValues: {
      dentistIds: [],
    },
  });

  // Add newUserForm here
  const newUserForm = useForm<NewUserFormValues>({
    resolver: zodResolver(newUserSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      gender: '',
      role: 'USER',
      password: '',
      confirmPassword: '',
    },
  });

  // Table columns definition
  const columns: ColumnDef<AdminUser>[] = [
    {
      accessorKey: 'image',
      header: '',
      cell: ({ row }) => {
        const user = row.original;
        return (
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.image || ''} alt={user.name || 'User'} />
            <AvatarFallback>
              {user.name ? user.name.substring(0, 2).toUpperCase() : 'U'}
            </AvatarFallback>
          </Avatar>
        );
      },
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className="font-medium">{row.original.name || 'N/A'}</div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => <div>{row.original.phone || 'N/A'}</div>,
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => (
        <div className="capitalize">
          {row.original.role?.toLowerCase() || 'user'}
        </div>
      ),
    },
    {
      accessorKey: 'emailVerified',
      header: 'Verified',
      cell: ({ row }) => (
        <div>
          {row.original.emailVerified ? (
            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
              Yes
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
              No
            </span>
          )}
        </div>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const user = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setSelectedUser(user);
                  // Populate form with user data
                  editForm.reset({
                    name: user.name || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    gender: user.gender || '',
                    role: user.role || 'USER',
                    city: user.city || '',
                    state: user.state || '',
                    country: user.country || '',
                  });
                  setEditDialogOpen(true);
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit User
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedUser(user);
                  passwordForm.reset();
                  setPasswordDialogOpen(true);
                }}
              >
                <Key className="mr-2 h-4 w-4" />
                Change Password
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  handleOpenDentistDialog(user);
                }}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Connect Dentist
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => {
                  setSelectedUser(user);
                  setDeleteDialogOpen(true);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // Initialize the table
  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: meta?.totalPages || -1,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
  });

  // Handle edit user form submission
  const handleEditUser = async (data: UserFormValues) => {
    if (!selectedUser) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update user');
      }

      await queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User updated successfully');
      setEditDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update user');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle password change form submission
  const handlePasswordChange = async (data: PasswordChangeValues) => {
    if (!selectedUser) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Operation': 'change-password',
        },
        body: JSON.stringify({
          newPassword: data.newPassword,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to change password');
      }

      toast.success('Password changed successfully');
      setPasswordDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to change password');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle dentist connection form submission
  const handleConnectDentist = async (data: DentistConnectionValues) => {
    if (!selectedUser) return;

    setIsSubmitting(true);
    try {
      const response = await connectDentists(selectedUser.id, data);

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success(
          response.message || 'Dentist connections updated successfully'
        );
        setDentistDialogOpen(false);

        // Refresh data if needed
        queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      }
    } catch (error: any) {
      console.error('Error connecting dentists:', error);
      toast.error(error.message || 'Failed to update dentist connections');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle user deletion
  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete user');
      }

      await queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User deleted successfully');
      setDeleteDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete user');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle new user form submission
  const handleCreateUser = async (data: NewUserFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          gender: data.gender,
          role: data.role,
          password: data.password,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create user');
      }

      await queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User created successfully');
      setNewUserDialogOpen(false);
      dentistForm.reset();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenDentistDialog = async (user: AdminUser) => {
    setSelectedUser(user);
    setLoadingDentists(true);
    try {
      const res = await fetch(`/api/admin/users/${user.id}?includeDentists=1`);
      if (!res.ok) throw new Error('Failed to fetch user dentists');
      const data = await res.json();

      // Set the initial dentist IDs
      const connectedDentistIds = data.dentists
        ? data.dentists.map((d: any) => d.id)
        : [];
      dentistForm.reset({
        dentistIds: connectedDentistIds,
      });

      // Also update the dentists array with the connected dentists
      if (data.dentists && data.dentists.length > 0) {
        setDentists(prev => {
          // Add the connected dentists to our current dentist list to ensure they display
          const existingIds = new Set(prev.map(d => d.id));
          const newDentists = [...prev];

          data.dentists.forEach((d: Dentist) => {
            if (!existingIds.has(d.id)) {
              newDentists.push(d);
            }
          });

          return newDentists;
        });
      }

      setDentistDialogOpen(true);
    } catch (error) {
      toast.error('Failed to load dentist connections');
    } finally {
      setLoadingDentists(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchDentists(dentistSearch);
    }, 300);
    return () => clearTimeout(timeout);
  }, [dentistSearch]);

  useEffect(() => {
    if (dentistDialogOpen) {
      setDentistSearch('');
      fetchDentists('');
    }
  }, [dentistDialogOpen]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold">User Management</h1>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
            <Input
              placeholder="Search users..."
              className="w-full pr-4 pl-8"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            onClick={() => {
              newUserForm.reset();
              setNewUserDialogOpen(true);
            }}
            className="whitespace-nowrap"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex items-center justify-center">
                    <LoadingSpinner />
                  </div>
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-muted-foreground text-sm">
          {meta ? (
            <div>
              Showing{' '}
              <span className="font-medium">
                {pagination.pageIndex * pagination.pageSize + 1}
              </span>{' '}
              to{' '}
              <span className="font-medium">
                {Math.min(
                  (pagination.pageIndex + 1) * pagination.pageSize,
                  meta.total
                )}
              </span>{' '}
              of <span className="font-medium">{meta.total}</span> users
            </div>
          ) : null}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Previous
          </Button>
          <div className="flex items-center gap-1">
            <span className="text-sm">Page</span>
            <span className="text-sm font-medium">
              {table.getState().pagination.pageIndex + 1} of{' '}
              {meta?.totalPages || 1}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form
              onSubmit={editForm.handleSubmit(handleEditUser)}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={editForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Doe"
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="user@example.com"
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+1234567890"
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value || ''}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || 'USER'}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="USER">User</SelectItem>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                          <SelectItem value="DENTIST">Dentist</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Set a new password for this user account.
            </DialogDescription>
          </DialogHeader>
          <Form {...passwordForm}>
            <form
              onSubmit={passwordForm.handleSubmit(handlePasswordChange)}
              className="space-y-4"
            >
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setPasswordDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Change Password
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Connect Dentist Dialog */}
      <Dialog open={dentistDialogOpen} onOpenChange={setDentistDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Connect Dentist Profiles</DialogTitle>
            <DialogDescription>
              Connect this user to one or more dentist profiles.
            </DialogDescription>
          </DialogHeader>

          <Form {...dentistForm}>
            <form
              onSubmit={dentistForm.handleSubmit(handleConnectDentist)}
              className="space-y-4"
            >
              {/* Connected Dentists List */}
              <FormField
                control={dentistForm.control}
                name="dentistIds"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    {/* Show connected dentists */}
                    {field.value.length > 0 && (
                      <div className="space-y-2">
                        <FormLabel>Connected Dentists</FormLabel>
                        <div className="divide-y rounded-lg border">
                          {dentists
                            .filter(dentist => field.value.includes(dentist.id))
                            .map(dentist => (
                              <div
                                key={dentist.id}
                                className="hover:bg-muted/50 flex items-center justify-between p-2"
                              >
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage
                                      src={dentist.image || ''}
                                      alt={dentist.name || 'Dentist'}
                                    />
                                    <AvatarFallback>
                                      {dentist.name
                                        ? dentist.name
                                            .substring(0, 2)
                                            .toUpperCase()
                                        : 'DR'}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex flex-col">
                                    <span className="text-sm font-medium">
                                      {dentist.name || 'Unnamed'}
                                    </span>
                                    <span className="text-muted-foreground text-xs">
                                      {dentist.email || 'No email'}
                                    </span>
                                  </div>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="text-muted-foreground hover:text-destructive h-8 w-8 p-0"
                                  onClick={() => {
                                    const updatedValue = field.value.filter(
                                      id => id !== dentist.id
                                    );
                                    field.onChange(updatedValue);
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                  <span className="sr-only">Remove</span>
                                </Button>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Dentist search */}
                    <FormItem className="flex flex-col">
                      <FormLabel>Add Dentists</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                'w-full justify-between',
                                !field.value.length && 'text-muted-foreground'
                              )}
                            >
                              Select dentists...
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search dentists..."
                              value={dentistSearch}
                              onValueChange={value => {
                                setDentistSearch(value);
                              }}
                            />
                            <CommandList>
                              {loadingDentists ? (
                                <CommandEmpty>
                                  <div className="flex h-full items-center justify-center">
                                    <LoadingSpinner />
                                  </div>
                                </CommandEmpty>
                              ) : dentists.length === 0 ? (
                                <CommandEmpty>No dentists found</CommandEmpty>
                              ) : (
                                <CommandGroup>
                                  {dentists
                                    .filter(
                                      dentist =>
                                        !dentistSearch ||
                                        dentist.name
                                          ?.toLowerCase()
                                          .includes(
                                            dentistSearch.toLowerCase()
                                          ) ||
                                        dentist.email
                                          ?.toLowerCase()
                                          .includes(dentistSearch.toLowerCase())
                                    )
                                    .map(dentist => {
                                      const isSelected = field.value.includes(
                                        dentist.id
                                      );
                                      return (
                                        <CommandItem
                                          key={dentist.id}
                                          value={dentist.id}
                                          onSelect={() => {
                                            const updatedValue = isSelected
                                              ? field.value.filter(
                                                  id => id !== dentist.id
                                                )
                                              : [...field.value, dentist.id];
                                            field.onChange(updatedValue);
                                          }}
                                        >
                                          <div className="flex flex-1 items-center gap-2">
                                            <Avatar className="h-6 w-6">
                                              <AvatarImage
                                                src={dentist.image || ''}
                                                alt={dentist.name || 'Dentist'}
                                              />
                                              <AvatarFallback>
                                                {dentist.name
                                                  ? dentist.name
                                                      .substring(0, 2)
                                                      .toUpperCase()
                                                  : 'DR'}
                                              </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                              <span className="text-sm">
                                                {dentist.name || 'Unnamed'}
                                              </span>
                                              <span className="text-muted-foreground text-xs">
                                                {dentist.email || 'No email'}
                                              </span>
                                            </div>
                                          </div>
                                          <Check
                                            className={cn(
                                              'ml-auto h-4 w-4',
                                              isSelected
                                                ? 'opacity-100'
                                                : 'opacity-0'
                                            )}
                                          />
                                        </CommandItem>
                                      );
                                    })}
                                </CommandGroup>
                              )}
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDentistDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>Delete User</>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* New User Dialog */}
      <Dialog open={newUserDialogOpen} onOpenChange={setNewUserDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Add a new user to the system. Fill in the required information
              below.
            </DialogDescription>
          </DialogHeader>
          <Form {...newUserForm}>
            <form
              onSubmit={newUserForm.handleSubmit(handleCreateUser)}
              className="space-y-4"
            >
              <FormField
                control={newUserForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={newUserForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="user@example.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={newUserForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone (optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+1234567890"
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={newUserForm.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender (optional)</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value || ''}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={newUserForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="USER">User</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="DENTIST">Dentist</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={newUserForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={newUserForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setNewUserDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create User
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserListClient;

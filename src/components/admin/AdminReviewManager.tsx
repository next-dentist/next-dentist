'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useAdminReviews,
  useDebounce,
  useDeleteReview,
  useUpdateReviewStatus,
  type ReviewWithRelations,
} from '@/hooks/useAdminReviews';
import { ReviewStatus } from '@prisma/client';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
} from '@tanstack/react-table';
import { format } from 'date-fns';
import {
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronsLeft,
  ChevronsRight,
  Clock,
  Eye,
  RefreshCcw,
  Search,
  Star,
  Trash2,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

const AdminReviewManager: React.FC = () => {
  // State for table
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [searchInputValue, setSearchInputValue] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedReview, setSelectedReview] =
    useState<ReviewWithRelations | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Debounce the search value
  const debouncedSearch = useDebounce(searchInputValue, 300);

  // Fetch reviews data
  const { data, isLoading, isError, refetch } = useAdminReviews({
    page,
    limit,
    search: debouncedSearch,
    sortBy: sorting.length > 0 ? sorting[0].id : undefined,
    sortOrder:
      sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : undefined,
  });
  const [reviews, setReviews] = useState<ReviewWithRelations[]>([]);

  // Mutations
  const updateStatus = useUpdateReviewStatus();
  const deleteReview = useDeleteReview();

  useEffect(() => {
    if (data) {
      setReviews(data.reviews);
    }
  }, [data]);

  // Handle status change
  const handleStatusChange = (reviewId: string, newStatus: ReviewStatus) => {
    updateStatus.mutate(
      { reviewId, status: newStatus },
      {
        onSuccess: () => {
          toast.success('Review status updated successfully');
        },
        onError: error => {
          toast.error(
            `Failed to update status: ${
              error instanceof Error ? error.message : 'Unknown error'
            }`
          );
        },
      }
    );
  };

  // Handle review deletion
  const handleDeleteReview = (reviewId: string) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      deleteReview.mutate(reviewId);
    }
  };

  // Render rating stars
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
    );
  };

  // Render status display
  const renderStatusDisplay = (status: ReviewStatus) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="flex items-center text-green-600">
            <CheckCircle className="mr-1 h-3 w-3" /> Approved
          </span>
        );
      case 'REJECTED':
        return (
          <span className="flex items-center text-red-600">
            <XCircle className="mr-1 h-3 w-3" /> Rejected
          </span>
        );
      case 'PENDING':
      default:
        return (
          <span className="flex items-center text-yellow-600">
            <Clock className="mr-1 h-3 w-3" /> Pending
          </span>
        );
    }
  };

  // Review detail dialog content
  const ReviewDetailDialog = ({ review }: { review: ReviewWithRelations }) => (
    <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <span>Review Details</span>
          {renderStars(review.rating)}
        </DialogTitle>
        <DialogDescription>
          Review submitted on {format(new Date(review.createdAt), 'PPP')}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        {/* Reviewer Information */}
        <div className="rounded-lg bg-gray-50 p-4">
          <h3 className="mb-3 font-semibold text-gray-900">
            Reviewer Information
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-600">Name</label>
              <p className="text-gray-900">{review.reviewerName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="text-gray-900">
                {review.reviewerEmail || 'Not provided'}
              </p>
            </div>
            {review.user && (
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-600">
                  Registered User
                </label>
                <p className="text-gray-900">
                  {review.user.name} ({review.user.email})
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Dentist Information */}
        <div className="rounded-lg bg-blue-50 p-4">
          <h3 className="mb-3 font-semibold text-gray-900">
            Dentist Information
          </h3>
          <div className="flex items-center gap-3">
            {review.dentist.image && (
              <div className="relative h-12 w-12 overflow-hidden rounded-full">
                <Image
                  src={review.dentist.image}
                  alt={review.dentist.name || 'Dentist'}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <p className="font-medium text-gray-900">{review.dentist.name}</p>
              <p className="text-sm text-gray-600">{review.dentist.email}</p>
            </div>
          </div>
        </div>

        {/* Review Content */}
        <div className="space-y-4">
          {review.title && (
            <div>
              <h3 className="mb-2 font-semibold text-gray-900">Review Title</h3>
              <p className="font-medium text-gray-700">{review.title}</p>
            </div>
          )}

          <div>
            <h3 className="mb-2 font-semibold text-gray-900">Review Body</h3>
            <div className="rounded-lg border bg-white p-4">
              <p className="leading-relaxed whitespace-pre-wrap text-gray-700">
                {review.body}
              </p>
            </div>
          </div>

          {/* Subcategory Ratings */}
          {review.subratings && review.subratings.length > 0 && (
            <div>
              <h3 className="mb-2 font-semibold text-gray-900">
                Detailed Ratings
              </h3>
              <div className="rounded-lg border bg-white p-4">
                <div className="grid gap-4">
                  {review.subratings.map(subrating => (
                    <div
                      key={subrating.id}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm font-medium text-gray-700">
                        {subrating.category.name}
                      </span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= subrating.value
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="ml-1 text-sm text-gray-600">
                          ({subrating.value})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Status and Actions */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-600">
                Current Status
              </label>
              <div className="mt-1">{renderStatusDisplay(review.status)}</div>
            </div>
            <div className="flex gap-2">
              <Select
                value={review.status}
                onValueChange={(value: ReviewStatus) =>
                  handleStatusChange(review.id, value)
                }
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">
                    <span className="flex items-center text-yellow-600">
                      <Clock className="mr-1 h-3 w-3" /> Pending
                    </span>
                  </SelectItem>
                  <SelectItem value="APPROVED">
                    <span className="flex items-center text-green-600">
                      <CheckCircle className="mr-1 h-3 w-3" /> Approved
                    </span>
                  </SelectItem>
                  <SelectItem value="REJECTED">
                    <span className="flex items-center text-red-600">
                      <XCircle className="mr-1 h-3 w-3" /> Rejected
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );

  // Define columns
  const columns: ColumnDef<ReviewWithRelations>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => (
        <div className="max-w-[100px] truncate">{row.original.id}</div>
      ),
    },
    {
      accessorKey: 'reviewerName',
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Reviewer
            {column.getIsSorted() === 'asc' ? (
              <ChevronUp className="ml-1 h-4 w-4" />
            ) : column.getIsSorted() === 'desc' ? (
              <ChevronDown className="ml-1 h-4 w-4" />
            ) : null}
          </button>
        );
      },
      cell: ({ row }) => (
        <div className="max-w-[150px]">
          <div className="font-medium">{row.original.reviewerName}</div>
          {row.original.reviewerEmail && (
            <div className="truncate text-sm text-gray-500">
              {row.original.reviewerEmail}
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'dentist',
      header: 'Dentist',
      cell: ({ row }) => (
        <div className="flex max-w-[200px] items-center gap-2">
          {row.original.dentist.image && (
            <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full">
              <Image
                src={row.original.dentist.image}
                alt={row.original.dentist.name || 'Dentist'}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="truncate font-medium">
              {row.original.dentist.name || 'Unknown'}
            </div>
            <div className="truncate text-sm text-gray-500">
              {row.original.dentist.email}
            </div>
          </div>
        </div>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'rating',
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Rating
            {column.getIsSorted() === 'asc' ? (
              <ChevronUp className="ml-1 h-4 w-4" />
            ) : column.getIsSorted() === 'desc' ? (
              <ChevronDown className="ml-1 h-4 w-4" />
            ) : null}
          </button>
        );
      },
      cell: ({ row }) => renderStars(row.original.rating),
    },
    {
      accessorKey: 'title',
      header: 'Review Title',
      cell: ({ row }) => (
        <div className="max-w-[200px]">
          <div className="truncate" title={row.original.title || undefined}>
            {row.original.title || 'No title'}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'body',
      header: 'Review Content',
      cell: ({ row }) => (
        <div className="max-w-[250px]">
          <p
            className="truncate text-sm text-gray-600"
            title={row.original.body}
          >
            {row.original.body}
          </p>
        </div>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'status',
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Status
            {column.getIsSorted() === 'asc' ? (
              <ChevronUp className="ml-1 h-4 w-4" />
            ) : column.getIsSorted() === 'desc' ? (
              <ChevronDown className="ml-1 h-4 w-4" />
            ) : null}
          </button>
        );
      },
      cell: ({ row }) => {
        const review = row.original;

        return (
          <Select
            value={review.status}
            onValueChange={(value: ReviewStatus) =>
              handleStatusChange(review.id, value)
            }
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue>{renderStatusDisplay(review.status)}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">
                <span className="flex items-center text-yellow-600">
                  <Clock className="mr-1 h-3 w-3" /> Pending
                </span>
              </SelectItem>
              <SelectItem value="APPROVED">
                <span className="flex items-center text-green-600">
                  <CheckCircle className="mr-1 h-3 w-3" /> Approved
                </span>
              </SelectItem>
              <SelectItem value="REJECTED">
                <span className="flex items-center text-red-600">
                  <XCircle className="mr-1 h-3 w-3" /> Rejected
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Created
            {column.getIsSorted() === 'asc' ? (
              <ChevronUp className="ml-1 h-4 w-4" />
            ) : column.getIsSorted() === 'desc' ? (
              <ChevronDown className="ml-1 h-4 w-4" />
            ) : null}
          </button>
        );
      },
      cell: ({ row }) => {
        return row.original.createdAt ? (
          <div>{format(new Date(row.original.createdAt), 'dd MMM yyyy')}</div>
        ) : (
          <div>N/A</div>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Dialog
              open={isDialogOpen && selectedReview?.id === row.original.id}
              onOpenChange={open => {
                setIsDialogOpen(open);
                if (!open) setSelectedReview(null);
              }}
            >
              <DialogTrigger asChild>
                <button
                  onClick={() => {
                    setSelectedReview(row.original);
                    setIsDialogOpen(true);
                  }}
                  className="rounded-full p-2 text-blue-600 hover:bg-blue-50 hover:text-blue-800"
                  title="View Details"
                >
                  <Eye className="h-4 w-4" />
                </button>
              </DialogTrigger>
              {selectedReview?.id === row.original.id && (
                <ReviewDetailDialog review={row.original} />
              )}
            </Dialog>
            <button
              onClick={() => handleDeleteReview(row.original.id)}
              className="rounded-full p-2 text-red-600 hover:bg-red-50 hover:text-red-800"
              title="Delete Review"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        );
      },
    },
  ];

  // Filter reviews based on search query
  useEffect(() => {
    if (data && searchInputValue) {
      const filtered = data.reviews.filter(
        (review: ReviewWithRelations) =>
          review.reviewerName
            ?.toLowerCase()
            .includes(searchInputValue.toLowerCase()) ||
          review.reviewerEmail
            ?.toLowerCase()
            .includes(searchInputValue.toLowerCase()) ||
          review.dentist.name
            ?.toLowerCase()
            .includes(searchInputValue.toLowerCase()) ||
          review.title
            ?.toLowerCase()
            .includes(searchInputValue.toLowerCase()) ||
          review.body?.toLowerCase().includes(searchInputValue.toLowerCase())
      );
      setReviews(filtered);
    } else if (data) {
      setReviews(data.reviews);
    }
  }, [searchInputValue, data]);

  // Initialize table
  const table = useReactTable({
    data: reviews || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    manualPagination: true,
    pageCount: data?.pagination.totalPages || 0,
    state: {
      sorting,
      columnFilters,
      pagination: {
        pageIndex: page - 1,
        pageSize: limit,
      },
    },
  });

  // Update the search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInputValue(e.target.value);
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-center text-red-600">
        Error loading reviews. Please try again later.
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white shadow">
      <div className="p-6">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">
          Manage Reviews
        </h1>

        {/* Search */}
        <div className="mb-6 flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchInputValue}
                onChange={handleSearchChange}
                className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {searchInputValue.length > 0 && searchInputValue.length < 3 && (
                <div className="mt-1 text-xs text-gray-500">
                  Type at least 3 characters to search
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Total Reviews: {data?.pagination.total || 0}
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    {row.getVisibleCells().map(cell => (
                      <td
                        key={cell.id}
                        className="px-6 py-4 text-sm whitespace-nowrap text-gray-500"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-4 text-center text-sm whitespace-nowrap text-gray-500"
                  >
                    No reviews found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <select
              value={limit}
              onChange={e => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="rounded border border-gray-300 px-2 py-1 text-sm"
            >
              {[10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-700">
              Page {page} of {data?.pagination.totalPages || 0}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              className="rounded border border-gray-300 p-1 disabled:opacity-50"
              onClick={() => setPage(1)}
              disabled={page === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
            <button
              className="rounded border border-gray-300 p-1 disabled:opacity-50"
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              className="rounded border border-gray-300 p-1 disabled:opacity-50"
              onClick={() =>
                setPage(prev =>
                  Math.min(prev + 1, data?.pagination.totalPages || prev)
                )
              }
              disabled={page >= (data?.pagination.totalPages || 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              className="rounded border border-gray-300 p-1 disabled:opacity-50"
              onClick={() => setPage(data?.pagination.totalPages || 1)}
              disabled={page >= (data?.pagination.totalPages || 1)}
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Refresh button */}
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => refetch()}
            className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
          >
            <RefreshCcw className="mr-1 h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminReviewManager;

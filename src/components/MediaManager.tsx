'use client';
import {
  listMedia,
  MediaListParams,
  MediaListResponse,
} from '@/app/(actions)/media/list';
import { useQuery } from '@tanstack/react-query';
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Grid3X3,
  LayoutGrid,
  List,
  Search,
  Settings,
  SortAsc,
  SortDesc,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { MediaCard } from './MediaCard';
import UploadDropzone from './UploadDropzone';

type ViewMode = 'grid' | 'grid-detailed' | 'list' | 'manage';
type SortField = 'createdAt' | 'filename' | 'size';
type SortOrder = 'asc' | 'desc';

export default function MediaManager({
  onSelect,
  multiple = false,
}: {
  onSelect?: (url: string | string[]) => void;
  multiple?: boolean;
}) {
  // State for filters and pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [mimeTypeFilter, setMimeTypeFilter] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to first page when searching
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Build query parameters
  const queryParams: MediaListParams = useMemo(
    () => ({
      page,
      limit,
      search: debouncedSearch,
      sortBy,
      sortOrder,
      mimeType: mimeTypeFilter,
    }),
    [page, limit, debouncedSearch, sortBy, sortOrder, mimeTypeFilter]
  );

  // Fetch media with React Query
  const { data, isLoading, error, refetch } = useQuery<MediaListResponse>({
    queryKey: ['media', queryParams],
    queryFn: () => listMedia(queryParams),
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: true,
  });

  // Handle selection
  const handleSelect = useCallback(
    (url: string) => {
      // Don't allow selection in management mode
      if (viewMode === 'manage') return;

      if (multiple) {
        setSelectedUrls(prev => {
          const newSelection = prev.includes(url)
            ? prev.filter(u => u !== url)
            : [...prev, url];
          onSelect?.(newSelection);
          return newSelection;
        });
      } else {
        onSelect?.(url);
      }
    },
    [multiple, onSelect, viewMode]
  );

  // Handle sort change
  const handleSort = (field: SortField) => {
    if (field === sortBy) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setPage(1);
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // Scroll to top of media grid
    document
      .getElementById('media-grid')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle limit change
  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setMimeTypeFilter('');
    setSortBy('createdAt');
    setSortOrder('desc');
    setPage(1);
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {Array.from({ length: limit }).map((_, i) => (
        <div
          key={i}
          className="bg-muted/50 aspect-square animate-pulse rounded-lg"
        />
      ))}
    </div>
  );

  if (error) {
    console.error('MediaManager Error:', error);
    return (
      <div className="space-y-6">
        <UploadDropzone />
        <div className="border-destructive/20 bg-destructive/10 text-destructive rounded-lg border p-8 text-center">
          <p className="mb-2 text-lg font-medium">Error loading media</p>
          <p className="mb-4 text-sm">
            {error instanceof Error ? error.message : 'Unknown error occurred'}
          </p>
          <button
            onClick={() => refetch()}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-lg px-4 py-2 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const media = data?.media || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <UploadDropzone />

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <input
            type="text"
            placeholder="Search media by filename..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border-border bg-input focus:border-primary focus:ring-primary/50 w-full rounded-lg border py-2 pr-4 pl-10 outline-none focus:ring-2"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transform"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Left side - View controls */}
          <div className="flex items-center gap-2">
            {/* View Mode */}
            <div className="border-border flex overflow-hidden rounded-lg border">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-background text-foreground hover:bg-muted'}`}
                title="Grid View"
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('grid-detailed')}
                className={`px-3 py-2 ${viewMode === 'grid-detailed' ? 'bg-primary text-primary-foreground' : 'bg-background text-foreground hover:bg-muted'}`}
                title="Detailed Grid View"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'bg-background text-foreground hover:bg-muted'}`}
                title="List View"
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('manage')}
                className={`px-3 py-2 ${viewMode === 'manage' ? 'bg-secondary text-secondary-foreground' : 'bg-background text-foreground hover:bg-muted'}`}
                title="Management View - Delete & Preview"
              >
                <Settings className="h-4 w-4" />
              </button>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`border-border flex items-center gap-2 rounded-lg border px-3 py-2 ${
                showFilters
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background text-foreground hover:bg-muted'
              }`}
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>

            {/* Results Info */}
            {pagination && (
              <div className="text-muted-foreground text-sm">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{' '}
                of {pagination.total} items
              </div>
            )}
          </div>

          {/* Right side - Sort and page size */}
          <div className="flex items-center gap-2">
            {/* Page Size */}
            <select
              value={limit}
              onChange={e => handleLimitChange(Number(e.target.value))}
              className="border-border bg-background rounded-lg border px-3 py-2 text-sm"
            >
              <option value={12}>12 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>

            {/* Sort */}
            <div className="border-border flex overflow-hidden rounded-lg border">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as SortField)}
                className="bg-background border-none px-3 py-2 text-sm outline-none"
              >
                <option value="createdAt">Date</option>
                <option value="filename">Name</option>
                <option value="size">Size</option>
              </select>
              <button
                onClick={() =>
                  setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))
                }
                className="border-border bg-background text-foreground hover:bg-muted border-l px-2 py-2"
                title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
              >
                {sortOrder === 'asc' ? (
                  <SortAsc className="h-4 w-4" />
                ) : (
                  <SortDesc className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="border-border bg-muted/50 space-y-4 rounded-lg border p-4">
            <div className="flex flex-wrap items-center gap-4">
              {/* Media Type Filter */}
              <div className="flex items-center gap-2">
                <label className="text-foreground text-sm font-medium">
                  Type:
                </label>
                <select
                  value={mimeTypeFilter}
                  onChange={e => setMimeTypeFilter(e.target.value)}
                  className="border-border bg-background rounded border px-3 py-1 text-sm"
                >
                  <option value="">All Types</option>
                  <option value="image">Images</option>
                  <option value="video">Videos</option>
                  <option value="audio">Audio</option>
                  <option value="application">Documents</option>
                </select>
              </div>

              {/* Clear Filters */}
              <button
                onClick={clearFilters}
                className="text-muted-foreground hover:text-foreground px-3 py-1 text-sm underline"
              >
                Clear all filters
              </button>
            </div>

            {/* View Mode Info */}
            {viewMode === 'manage' && (
              <div className="bg-secondary/10 text-secondary flex items-center gap-2 rounded-lg px-3 py-2 text-sm">
                <Settings className="h-4 w-4" />
                <span>
                  Management Mode: Click the ⋮ button on images to delete or
                  preview. Selection is disabled in this mode.
                </span>
              </div>
            )}

            {/* Selected Count for Multiple Selection */}
            {multiple && selectedUrls.length > 0 && viewMode !== 'manage' && (
              <div className="text-primary flex items-center gap-2 text-sm">
                <span>
                  {selectedUrls.length} item{selectedUrls.length > 1 ? 's' : ''}{' '}
                  selected
                </span>
                <button
                  onClick={() => setSelectedUrls([])}
                  className="text-destructive hover:text-destructive/80 underline"
                >
                  Clear selection
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Media Grid */}
      <div id="media-grid">
        {isLoading ? (
          <LoadingSkeleton />
        ) : media.length > 0 ? (
          <div
            className={`grid gap-4 ${
              viewMode === 'grid'
                ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
                : viewMode === 'grid-detailed'
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                  : viewMode === 'list'
                    ? 'grid-cols-1'
                    : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
            }`}
          >
            {media.map(m => (
              <MediaCard
                key={m.id}
                media={m}
                onSelect={handleSelect}
                isSelected={selectedUrls.includes(m.url)}
                showDetails={viewMode !== 'grid'}
                managementMode={viewMode === 'manage'}
              />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <div className="text-muted-foreground/50 mb-4 text-6xl">📁</div>
            <h3 className="text-foreground mb-2 text-lg font-medium">
              {debouncedSearch ? 'No media found' : 'No media uploaded yet'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {debouncedSearch
                ? `No media found matching "${debouncedSearch}"`
                : 'Upload some images to get started!'}
            </p>
            {debouncedSearch && (
              <button
                onClick={() => setSearch('')}
                className="text-primary hover:text-primary/80 underline"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="border-border flex items-center justify-between border-t pt-6">
          <div className="text-muted-foreground text-sm">
            Page {pagination.page} of {pagination.totalPages}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={!pagination.hasPrev}
              className="border-border bg-background text-foreground hover:bg-muted flex items-center gap-1 rounded-lg border px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {Array.from(
                { length: Math.min(5, pagination.totalPages) },
                (_, i) => {
                  const pageNum = i + Math.max(1, pagination.page - 2);
                  if (pageNum > pagination.totalPages) return null;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`rounded-lg px-3 py-2 text-sm ${
                        pageNum === pagination.page
                          ? 'bg-primary text-primary-foreground'
                          : 'border-border bg-background text-foreground hover:bg-muted border'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
              )}
            </div>

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={!pagination.hasNext}
              className="border-border bg-background text-foreground hover:bg-muted flex items-center gap-1 rounded-lg border px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useBlogs } from '@/hooks/useBlogs';
import { formatDistanceToNow } from 'date-fns';
import { Calendar, ChevronRight, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

const BlogCard = ({ blog }: { blog: any }) => {
  return (
    <div className="group bg-card rounded-lg border shadow-sm transition-all hover:shadow-md">
      <div className="relative aspect-video overflow-hidden rounded-t-lg">
        {blog.image ? (
          <Image
            src={blog.image}
            alt={blog.imageAlt || blog.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100">
            <span className="text-gray-400">No image</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="text-muted-foreground mb-2 flex items-center gap-3 text-sm">
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>
              {blog.createdAt
                ? formatDistanceToNow(new Date(blog.createdAt), {
                    addSuffix: true,
                  })
                : 'Recent'}
            </span>
          </div>
          {blog.authorName && (
            <div className="flex items-center gap-1">
              <User size={14} />
              <span>{blog.authorName}</span>
            </div>
          )}
        </div>
        <h3 className="group-hover:text-primary mb-2 line-clamp-2 text-xl font-semibold tracking-tight transition-colors">
          {blog.title}
        </h3>
        <p className="text-muted-foreground line-clamp-3 text-sm">
          {blog.content?.replace(/<[^>]*>/g, '').substring(0, 150)}...
        </p>
        <div className="mt-4">
          <Link
            href={`/posts/${blog.slug}`}
            className="text-primary inline-flex items-center text-sm font-medium hover:underline"
          >
            Read more
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

const BlogSkeleton = () => (
  <div className="bg-card rounded-lg border shadow-sm">
    <Skeleton className="aspect-video w-full rounded-t-lg" />
    <div className="p-4">
      <div className="mb-2 flex gap-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="mb-2 h-7 w-full" />
      <Skeleton className="mb-1 h-4 w-full" />
      <Skeleton className="mb-1 h-4 w-full" />
      <Skeleton className="mb-4 h-4 w-3/4" />
      <Skeleton className="h-5 w-24" />
    </div>
  </div>
);

const BlogPageClient: React.FC = () => {
  const [page, setPage] = useState(1);
  const [displayedBlogs, setDisplayedBlogs] = useState<any[]>([]);
  const { blogs, isLoading, isError, error } = useBlogs();
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView();

  // Number of blogs to load per "page"
  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    if (blogs?.data && blogs.data.length > 0) {
      const totalAvailable = blogs.data.length;
      const nextBatch = blogs.data.slice(0, page * ITEMS_PER_PAGE);
      setDisplayedBlogs(nextBatch);
      setHasMore(nextBatch.length < totalAvailable);
    }
  }, [blogs, page]);

  // Load more posts when the user reaches the bottom
  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      setPage(prevPage => prevPage + 1);
    }
  }, [inView, hasMore, isLoading]);

  if (isError) {
    return (
      <div className="container mx-auto my-12 flex flex-col items-center px-4">
        <div className="rounded-lg bg-red-50 p-6 text-center text-red-600">
          <h2 className="mb-2 text-xl font-semibold">Error Loading Blogs</h2>
          <p>
            {error?.message || 'Something went wrong. Please try again later.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto my-12 px-4">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">
          Our Blog
        </h1>
        <p className="text-muted-foreground mx-auto max-w-2xl">
          Explore the latest insights, tips, and news about dental care and
          treatments
        </p>
      </div>

      {isLoading && displayedBlogs.length === 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array(6)
            .fill(null)
            .map((_, index) => (
              <BlogSkeleton key={index} />
            ))}
        </div>
      ) : (
        <>
          {displayedBlogs.length === 0 ? (
            <div className="my-16 text-center">
              <h2 className="text-xl font-medium">No blog posts found</h2>
              <p className="text-muted-foreground mt-2">
                Check back later for new content and updates.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {displayedBlogs.map(blog => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          )}
        </>
      )}

      {hasMore && (
        <div ref={ref} className="mt-8 text-center">
          {isLoading && displayedBlogs.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array(3)
                .fill(null)
                .map((_, index) => (
                  <BlogSkeleton key={`load-more-${index}`} />
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BlogPageClient;

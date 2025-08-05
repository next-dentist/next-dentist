'use client';

import { getBlogBySlug } from '@/app/actions/blogAction';
import '@/app/css/content.css';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { formatDistance } from 'date-fns';
import { Calendar, ChevronLeft, Clock, Share2, User } from 'lucide-react';
import Head from 'next/head';
import './content.css';

import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';

// Reading time calculator helper
const calculateReadingTime = (content: string): number => {
  // Remove HTML tags and calculate words
  const text = content?.replace(/<[^>]*>/g, '') || '';
  const words = text.trim().split(/\s+/).length;
  // Average reading speed: 200 words per minute
  const readingTime = Math.ceil(words / 200);
  return readingTime < 1 ? 1 : readingTime;
};

// Components for loading states
const TitleSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-3/4" />
    <div className="flex gap-4">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-4 w-32" />
    </div>
  </div>
);

const ContentSkeleton = () => (
  <div className="space-y-6">
    <Skeleton className="aspect-video w-full rounded-lg" />
    <div className="space-y-3">
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-4/5" />
    </div>
    <div className="space-y-3">
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-3/5" />
    </div>
  </div>
);

const BlogMetadata = ({ blog }: { blog: any }) => {
  const readingTime = calculateReadingTime(blog.content || '');

  return (
    <div className="text-muted-foreground reader-content mb-6 flex flex-wrap items-center gap-4 text-sm">
      {blog.createdAt && (
        <div className="flex items-center gap-1">
          <Calendar size={16} />
          <span>
            {formatDistance(new Date(blog.createdAt), new Date(), {
              addSuffix: true,
            })}
          </span>
        </div>
      )}

      {blog.authorName && (
        <div className="flex items-center gap-1">
          <User size={16} />
          <span>{blog.authorName}</span>
        </div>
      )}

      <div className="flex items-center gap-1">
        <Clock size={16} />
        <span>{readingTime} min read</span>
      </div>
    </div>
  );
};

const SingleBlogPostClient = () => {
  const { slug } = useParams();
  const router = useRouter();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['blog', slug],
    queryFn: () => getBlogBySlug(slug as string),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const blog = data?.data;

  // Share function
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog?.title || 'Blog Post',
          text: blog?.seoDescription || 'Check out this blog post',
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard');
    }
  };

  if (isError) {
    return (
      <div className="container mx-auto my-12 flex flex-col items-center px-4">
        <div className="rounded-lg bg-red-50 p-6 text-center text-red-600">
          <h2 className="mb-2 text-xl font-semibold">
            Error Loading Blog Post
          </h2>
          <p>
            {error instanceof Error
              ? error.message
              : 'Something went wrong. Please try again later.'}
          </p>
          <button
            onClick={() => router.back()}
            className="mt-4 inline-flex items-center text-sm font-medium text-red-600 hover:underline"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // SEO metadata
  const pageTitle = blog?.seoTitle || blog?.title || 'Blog Post';
  const pageDescription =
    blog?.seoDescription ||
    blog?.content?.replace(/<[^>]*>/g, '').substring(0, 160) + '...' ||
    'Read our latest blog post';
  const pageImage = blog?.image || '/images/default-blog-image.jpg';

  return (
    <>
      {/* Next.js App Router doesn't use Head component directly in pages 
          but we can still include it for SEO optimization in the client component */}
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={pageImage} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={pageImage} />
        {blog?.seoKeyword && <meta name="keywords" content={blog.seoKeyword} />}
      </Head>

      <article className="reader-content container mx-auto my-12 max-w-4xl px-4">
        <div className="mb-8">
          <button
            onClick={() => router.push('/posts')}
            className="text-muted-foreground hover:text-primary mb-6 inline-flex items-center text-sm font-medium"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to all posts
          </button>

          {isLoading ? (
            <TitleSkeleton />
          ) : (
            <>
              <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                {blog?.title}
              </h1>
              <BlogMetadata blog={blog} />
            </>
          )}
        </div>

        {isLoading ? (
          <ContentSkeleton />
        ) : (
          <>
            {blog?.image && (
              <div className="mb-8 overflow-hidden rounded-lg">
                <Image
                  src={blog.image}
                  alt={blog.imageAlt || blog.title || 'Blog post image'}
                  width={1200}
                  height={630}
                  className="w-full object-cover"
                  priority
                />
              </div>
            )}

            <div
              className="prose prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: blog?.content || '' }}
            />

            <div className="mt-12 flex items-center justify-between border-t border-b py-4">
              <div>
                {blog?.authorName && (
                  <div className="text-muted-foreground text-sm">
                    Written by{' '}
                    <span className="font-medium">{blog.authorName}</span>
                  </div>
                )}
              </div>
              <button
                onClick={handleShare}
                className="text-muted-foreground hover:bg-muted hover:text-foreground inline-flex items-center rounded-full p-2"
                aria-label="Share this post"
              >
                <Share2 size={18} />
              </button>
            </div>

            {/* Related posts would go here */}
          </>
        )}
      </article>
    </>
  );
};

export default SingleBlogPostClient;

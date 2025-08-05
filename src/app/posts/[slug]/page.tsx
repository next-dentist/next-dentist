import { getBlogBySlug } from '@/app/actions/blogAction';
import { Metadata, ResolvingMetadata } from 'next';
import SingleBlogPostClient from './SingleBlogPostClient';

// Define the props for the page component
type Props = {
  params: { slug: string };
};

// Generate metadata for the page
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Fetch blog post data
  const { slug } = await params;
  const blogData = await getBlogBySlug(slug);
  const blog = blogData?.data;

  // If no blog is found, return default metadata
  if (!blog) {
    return {
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }

  // Use blog data to generate metadata
  const title = blog.seoTitle || blog.title || 'Blog Post';
  const description =
    blog.seoDescription ||
    (blog.content
      ? blog.content.replace(/<[^>]*>/g, '').substring(0, 160) + '...'
      : 'Read our latest dental blog post');

  // Construct metadata object
  const metadata: Metadata = {
    title,
    description,
    openGraph: {
      title,
      description,
      images: blog.image
        ? [
            {
              url: blog.image,
              alt: blog.imageAlt || blog.title || 'Blog post image',
            },
          ]
        : [],
      type: 'article',
      publishedTime: blog.createdAt
        ? new Date(blog.createdAt).toISOString()
        : undefined,
      authors: blog.authorName ? [blog.authorName] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: blog.image ? [blog.image] : [],
    },
    keywords: blog.seoKeyword || 'dental blog, dentist, dental care',
  };

  // Add dynamic SEO extra data
  if (blog.seoExtra) {
    metadata.openGraph = {
      ...(metadata.openGraph as Metadata),
      ...(blog.seoExtra as Metadata),
    };
  }

  return metadata;
}

export default function BlogPostPage() {
  return <SingleBlogPostClient />;
}

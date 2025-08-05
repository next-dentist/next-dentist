import { Metadata } from 'next';
import BlogPageClient from './blogPageClient';

export const metadata: Metadata = {
  title: 'Dental Blog | NextDentist',
  description:
    'Explore our dental blog for the latest insights, tips, and news about dental care, oral health, and dental treatments.',
  openGraph: {
    title: 'Dental Blog | NextDentist',
    description:
      'Explore our dental blog for the latest insights, tips, and news about dental care, oral health, and dental treatments.',
    type: 'website',
    url: '/posts',
    images: [
      {
        url: '/images/blog-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'NextDentist Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dental Blog | NextDentist',
    description:
      'Explore our dental blog for the latest insights, tips, and news about dental care, oral health, and dental treatments.',
  },
  keywords:
    'dental blog, dental care, oral health, dental treatments, dentist, NextDentist',
};

export default function BlogPage() {
  return <BlogPageClient />;
}

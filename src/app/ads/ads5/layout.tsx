import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dental Search Engine Optimization | Complete SEO Services for Dentists',
  description:
    'Expert dental search engine optimization, dental practice local listings, and dental patient acquisition SEO. Comprehensive dental website structure optimization and dental SERP analysis.',
  openGraph: {
    title: 'Dental Search Engine Optimization | Complete SEO Services for Dentists',
    description:
      'Expert dental search engine optimization, dental practice local listings, and dental patient acquisition SEO. Comprehensive dental website structure optimization and dental SERP analysis.',
    url: '/ads/ads5',
    images: [
      {
        url: '/images/nd-seo3.webp',
        width: 1200,
        height: 630,
        alt: 'Dental search engine optimization showing improved search rankings and patient acquisition',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dental Search Engine Optimization | Complete SEO Services for Dentists',
    description:
      'Expert dental search engine optimization, dental practice local listings, and dental patient acquisition SEO. Comprehensive dental website structure optimization and dental SERP analysis.',
    images: ['/images/nd-seo3.webp'],
  },
};

export default function Ads5Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

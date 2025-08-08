import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dental Website Optimization Services | Complete SEO Packages',
  description:
    'Expert dental website optimization, Google My Business optimization, and dental schema markup. Monthly dental SEO packages with dental content optimization and dental backlink analysis.',
  openGraph: {
    title: 'Dental Website Optimization Services | Complete SEO Packages',
    description:
      'Expert dental website optimization, Google My Business optimization, and dental schema markup. Monthly dental SEO packages with dental content optimization and dental backlink analysis.',
    url: '/ads/ads4',
    images: [
      {
        url: '/images/nd-seo3.webp',
        width: 1200,
        height: 630,
        alt: 'Dental website optimization showing improved search rankings',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dental Website Optimization Services | Complete SEO Packages',
    description:
      'Expert dental website optimization, Google My Business optimization, and dental schema markup. Monthly dental SEO packages with dental content optimization and dental backlink analysis.',
    images: ['/images/nd-seo3.webp'],
  },
};

export default function Ads4Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 
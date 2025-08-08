import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SEO for Dentists | Dental Google Maps Optimization & Dental SSL Certificate',
  description:
    'Expert SEO for dentists with dental Google Maps optimization, dental SSL certificate implementation, and dental landing page optimization. Get your dedicated dental SEO consultant for new patient dental SEO strategies.',
  openGraph: {
    title: 'SEO for Dentists | Dental Google Maps Optimization & Dental SSL Certificate',
    description:
      'Expert SEO for dentists with dental Google Maps optimization, dental SSL certificate implementation, and dental landing page optimization. Get your dedicated dental SEO consultant for new patient dental SEO strategies.',
    url: '/ads/ads6',
    images: [
      {
        url: '/images/nd-seo6.webp',
        width: 1200,
        height: 630,
        alt: 'SEO for dentists showing dental Google Maps optimization and dental SSL certificate services',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SEO for Dentists | Dental Google Maps Optimization & Dental SSL Certificate',
    description:
      'Expert SEO for dentists with dental Google Maps optimization, dental SSL certificate implementation, and dental landing page optimization. Get your dedicated dental SEO consultant for new patient dental SEO strategies.',
    images: ['/images/nd-seo6.webp'],
  },
  keywords: [
    'SEO for dentists',
    'dental Google Maps optimization',
    'dental SSL certificate',
    'dental landing page optimization',
    'dental market research SEO',
    'new patient dental SEO',
    'dental SEO consultant',
    'dental website optimization',
    'dental SEO services',
    'dental search engine optimization'
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/ads/ads6',
  },
};

export default function Ads6Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

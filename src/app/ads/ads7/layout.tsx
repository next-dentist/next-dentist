import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dental Clinic SEO | Dental Local Citations & Dental Website Crawlability',
  description:
    'Expert dental clinic SEO services with dental local citations, dental website crawlability, dental FAQ optimization, and dental video SEO. Get comprehensive dental directory listings and white label dental SEO solutions.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    title: 'Dental Clinic SEO | Dental Local Citations & Dental Website Crawlability',
    description:
      'Expert dental clinic SEO services with dental local citations, dental website crawlability, dental FAQ optimization, and dental video SEO. Get comprehensive dental directory listings and white label dental SEO solutions.',
    url: '/ads/ads7',
    images: [
      {
        url: '/images/nd-seo7.webp',
        width: 1200,
        height: 630,
        alt: 'Dental clinic SEO services showing dental local citations and dental website crawlability optimization',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dental Clinic SEO | Dental Local Citations & Dental Website Crawlability',
    description:
      'Expert dental clinic SEO services with dental local citations, dental website crawlability, dental FAQ optimization, and dental video SEO. Get comprehensive dental directory listings and white label dental SEO solutions.',
    images: ['/images/nd-seo7.webp'],
  },
  keywords: [
    'dental clinic SEO',
    'dental local citations',
    'dental website crawlability',
    'dental FAQ optimization',
    'white label dental SEO',
    'orthodontist SEO',
    'dental directory listings',
    'dental video SEO',
    'dental SEO case studies',
    'dental clinic SEO services',
    'dental local SEO',
    'dental search engine optimization',
    'dental website optimization',
    'dental Google My Business optimization',
    'dental schema markup',
    'dental content strategy',
    'dental backlink building',
    'dental conversion tracking'
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
    canonical: '/ads/ads7',
  },
};

export default function Ads7Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

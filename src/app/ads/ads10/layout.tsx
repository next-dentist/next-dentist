import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dental SEO Services | Cosmetic Dentist SEO, Dental Implant SEO & Pediatric Dentist SEO',
  description:
    'Specialized dental SEO services including cosmetic dentist SEO, dental implant SEO, pediatric dentist SEO, teeth whitening SEO, and Invisalign SEO marketing. Get more high-value patients with targeted local search optimization.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    title: 'Dental SEO Services | Cosmetic Dentist SEO, Dental Implant SEO & Pediatric Dentist SEO',
    description:
      'Specialized dental SEO services including cosmetic dentist SEO, dental implant SEO, pediatric dentist SEO, teeth whitening SEO, and Invisalign SEO marketing. Get more high-value patients with targeted local search optimization.',
    url: '/ads/ads10',
    images: [
      {
        url: '/images/nd-seo10.webp',
        width: 1200,
        height: 630,
        alt: 'Dental SEO services for cosmetic dentists, dental implants, pediatric dentists, teeth whitening, and Invisalign marketing',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dental SEO Services | Cosmetic Dentist SEO, Dental Implant SEO & Pediatric Dentist SEO',
    description:
      'Specialized dental SEO services including cosmetic dentist SEO, dental implant SEO, pediatric dentist SEO, teeth whitening SEO, and Invisalign SEO marketing. Get more high-value patients with targeted local search optimization.',
    images: ['/images/nd-seo10.webp'],
  },
  keywords: [
    'cosmetic dentist SEO',
    'dental implant SEO',
    'pediatric dentist SEO',
    'teeth whitening SEO',
    'Invisalign SEO marketing',
    'endodontist SEO',
    'dental SEO services',
    'dental practice marketing',
    'dental clinic SEO',
    'dental practice growth',
    'dental SEO specialist',
    'dental marketing services',
    'dental practice SEO expert',
    'cosmetic dentistry SEO',
    'dental implant marketing',
    'pediatric dentistry SEO',
    'teeth whitening marketing',
    'Invisalign marketing SEO',
    'endodontist marketing',
    'dental practice growth strategies',
    'dental SEO optimization',
    'dental practice growth consultant',
    'dental SEO specialist services',
    'cosmetic dentist marketing',
    'dental implant SEO specialist',
    'pediatric dentist marketing',
    'teeth whitening SEO expert',
    'Invisalign SEO specialist',
    'endodontist SEO services',
    'dental practice growth marketing',
    'dental SEO consultant',
    'dental marketing expert',
    'dental practice SEO services',
    'cosmetic dentistry marketing',
    'dental implant marketing expert',
    'pediatric dentistry marketing',
    'teeth whitening marketing expert',
    'Invisalign marketing specialist',
    'endodontist marketing expert'
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
    canonical: '/ads/ads10',
  },
};

export default function Ads10Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

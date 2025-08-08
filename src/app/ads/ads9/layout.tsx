import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Oral Surgeon SEO & Dental Practice Growth SEO | Expert Dental Reputation Management',
  description:
    'Expert oral surgeon SEO and dental practice growth SEO services. Specialized dental reputation management, periodontist SEO, emergency dentist SEO, and comprehensive dental review management. Get proven results.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    title: 'Oral Surgeon SEO & Dental Practice Growth SEO | Expert Dental Reputation Management',
    description:
      'Expert oral surgeon SEO and dental practice growth SEO services. Specialized dental reputation management, periodontist SEO, emergency dentist SEO, and comprehensive dental review management. Get proven results.',
    url: '/ads/ads9',
    images: [
      {
        url: '/images/nd-seo9.webp',
        width: 1200,
        height: 630,
        alt: 'Oral surgeon SEO and dental practice growth SEO services with expert dental reputation management',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Oral Surgeon SEO & Dental Practice Growth SEO | Expert Dental Reputation Management',
    description:
      'Expert oral surgeon SEO and dental practice growth SEO services. Specialized dental reputation management, periodontist SEO, emergency dentist SEO, and comprehensive dental review management. Get proven results.',
    images: ['/images/nd-seo9.webp'],
  },
  keywords: [
    'oral surgeon SEO',
    'dental practice growth SEO',
    'dental reputation management SEO',
    'dental review management',
    'periodontist SEO',
    'emergency dentist SEO',
    'dental SEO services',
    'dental practice marketing',
    'dental clinic SEO',
    'dental practice growth',
    'dental reputation management',
    'dental review optimization',
    'dental practice SEO expert',
    'oral surgery SEO services',
    'dental practice growth strategies',
    'dental reputation management services',
    'dental review management system',
    'periodontist SEO optimization',
    'emergency dentist SEO services',
    'dental practice growth marketing',
    'dental reputation management expert',
    'dental review management platform',
    'oral surgeon SEO specialist',
    'dental practice growth consultant',
    'dental reputation management strategies'
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
    canonical: '/ads/ads9',
  },
};

export default function Ads9Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

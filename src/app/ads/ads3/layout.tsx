import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dental Marketing SEO Agency | Dentist Near Me SEO Services',
  description:
    'Leading dental SEO agency near me. Expert dental website audit, dental keyword research, and dental conversion rate optimization. Transform your practice with dental marketing SEO.',
  openGraph: {
    title: 'Dental Marketing SEO Agency | Dentist Near Me SEO Services',
    description:
      'Leading dental SEO agency near me. Expert dental website audit, dental keyword research, and dental conversion rate optimization. Transform your practice with dental marketing SEO.',
    url: '/ads/ads3',
    images: [
      {
        url: '/images/nd-seo3.webp',
        width: 1200,
        height: 630,
        alt: 'Dental SEO marketing results showing top search rankings',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dental Marketing SEO Agency | Dentist Near Me SEO Services',
    description:
      'Leading dental SEO agency near me. Expert dental website audit, dental keyword research, and dental conversion rate optimization. Transform your practice with dental marketing SEO.',
    images: ['/images/nd-seo3.webp'],
  },
};

export default function Ads3Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 
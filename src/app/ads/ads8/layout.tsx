import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dental Website Design & SEO Services | Custom Dental Website Development',
  description:
    'Expert dental website design and SEO services. Custom dental website development, responsive dental websites, local SEO for dentists, and dental marketing solutions. Get affordable dentist SEO packages.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    title: 'Dental Website Design & SEO Services | Custom Dental Website Development',
    description:
      'Expert dental website design and SEO services. Custom dental website development, responsive dental websites, local SEO for dentists, and dental marketing solutions. Get affordable dentist SEO packages.',
    url: '/ads/ads8',
    images: [
      {
        url: '/images/nd-seo8.webp',
        width: 1200,
        height: 630,
        alt: 'Dental website design and SEO services showing custom dental website development and responsive dental websites',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dental Website Design & SEO Services | Custom Dental Website Development',
    description:
      'Expert dental website design and SEO services. Custom dental website development, responsive dental websites, local SEO for dentists, and dental marketing solutions. Get affordable dentist SEO packages.',
    images: ['/images/nd-seo8.webp'],
  },
  keywords: [
    'dental website design',
    'dentist website development',
    'dental SEO services',
    'SEO for dentists',
    'dental clinic website design',
    'dental marketing and SEO',
    'dental practice website design',
    'SEO for dental clinics',
    'best dental website designers',
    'affordable dentist SEO packages',
    'local SEO for dentists',
    'mobile-friendly dental websites',
    'dental website redesign services',
    'SEO for orthodontists',
    'cosmetic dentist SEO services',
    'dental content marketing services',
    'dentist website optimization',
    'responsive dental websites',
    'dental appointment booking integration',
    'patient-focused website design',
    'HIPAA-compliant dental websites',
    'Google ranking for dental clinics',
    'SEO for dental professionals',
    'dental practice growth marketing',
    'online presence for dentists'
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
    canonical: '/ads/ads8',
  },
};

export default function Ads8Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

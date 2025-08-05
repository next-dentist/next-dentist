// create layout for about page for metadata

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About NextDentist | Our Mission and Values',
  description:
    'Learn about NextDentist, our mission to revolutionize dental care through innovation, and how we connect patients with qualified dental professionals.',
  keywords: [
    'NextDentist about',
    'dental appointment platform',
    'dental care innovation',
    'find qualified dentists',
    'dental practice management',
    'dental implants',
    'cosmetic dentistry',
    'orthodontics',
    'root canal procedures',
  ],
};

export default function AboutLayout({
      children,
    }) {
  return <div className="bg-background">{children}</div>;
}

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Accessibility Statement | NextDentist',
  description:
    'NextDentist is committed to digital accessibility for all users. Learn about our standards, ongoing improvements, and how to contact us for assistance.',
  keywords: [
    'NextDentist accessibility',
    'WCAG 2.1 AA',
    'digital accessibility',
    'website accessibility',
    'disability access',
    'inclusive design',
  ],
};

export default function AccessibilityLayout({
      children,
    }) {
  return <div className="bg-background">{children}</div>;
}

import { Breadcrumbs } from '@/components/Breadcrumbs';
import { SectionTwo } from '@/components/SectionTwo';
import type { Metadata } from 'next';
import { ReactNode, Suspense } from 'react';

export const metadata: Metadata = {
  title: 'FAQ | NextDentist',
  description:
    'Frequently asked questions about NextDentist - Find answers about our dental services, booking process, and more.',
  openGraph: {
    title: 'FAQ | NextDentist',
    description:
      'Frequently asked questions about NextDentist - Find answers about our dental services, booking process, and more.',
  },
};

interface FaqLayoutProps {
  children: ReactNode;
}

export default function FaqLayout({ children }: FaqLayoutProps) {
  return (
    <SectionTwo>
      <div className="container mx-auto max-w-4xl px-4 py-6">
        <Suspense fallback={<div>Loading...</div>}>
          <Breadcrumbs />
        </Suspense>
        {children}
      </div>
    </SectionTwo>
  );
}

import { Skeleton } from '@/components/ui/skeleton';
import { Metadata } from 'next';
import { Suspense } from 'react';
import ContactPageClient from './ContactPageClient';

export const metadata: Metadata = {
  title: 'Contact Us | NextDentist',
  description:
    'Get in touch with NextDentist. Contact our support team for inquiries, feedback, or assistance with your dental appointments and services.',
  keywords: [
    'contact NextDentist',
    'dental support',
    'customer service',
    'dental platform contact',
    'NextDentist help',
    'get in touch',
  ],
};

export default function ContactPage(props) {
  return (
    <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
      <ContactPageClient />
    </Suspense>
  );
}

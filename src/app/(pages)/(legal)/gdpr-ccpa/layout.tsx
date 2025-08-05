import { Metadata } from 'next';
import React from 'react';

interface GDPRCCPALayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: 'GDPR & CCPA Compliance | NextDentist',
  description:
    'Learn how NextDentist complies with GDPR and CCPA, safeguarding your data privacy rights and providing transparent information about personal data handling.',
};

export default function GDPRCCPALayout({ children }: GDPRCCPALayoutProps) {
  return <main>{children}</main>;
}

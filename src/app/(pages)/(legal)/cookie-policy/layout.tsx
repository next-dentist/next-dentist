import { Metadata } from 'next';
import React from 'react';

interface CookiePolicyLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: 'Cookie Policy | NextDentist',
  description:
    'Learn how NextDentist uses cookies and similar technologies to improve functionality, personalize content, analyze traffic, and deliver relevant advertisements.',
};

export default function CookiePolicyLayout({
  children,
}: CookiePolicyLayoutProps) {
  return <main>{children}</main>;
}

import { Metadata } from 'next';
import React from 'react';

interface MedicalDisclaimerLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: 'Medical Disclaimer | NextDentist',
  description:
    'Learn about the medical disclaimer on NextDentist, which outlines the limitations of the information provided on the platform.',
};

export default function MedicalDisclaimerLayout({
  children,
}: MedicalDisclaimerLayoutProps) {
  return <main>{children}</main>;
}

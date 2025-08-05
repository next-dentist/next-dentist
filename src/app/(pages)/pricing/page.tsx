import PricingTables from '@/components/PricingTables';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Pricing Plans | NextDentist',
  description:
    'Explore flexible pricing plans for dentists and clinics on NextDentist. Find the perfect subscription to manage appointments, attract patients, and grow your practice.',
  keywords: [
    'dental practice pricing',
    'dentist subscription plans',
    'NextDentist pricing',
    'clinic management software cost',
    'dental appointment booking platform price',
    'affordable dental software',
  ],
};

const PricingPage: React.FC = (props) => {
  return <PricingTables />;
};

export default PricingPage;

'use client';

import { Suspense } from 'react';
import DentistsPageClient from './DentistsPageClient';

export default function DentistsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DentistsPageClient />
    </Suspense>
  );
}

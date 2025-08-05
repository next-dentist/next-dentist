'use client';

import { useParams } from 'next/navigation';
import EditTreatmentClient from './EditTreatmentClient';

export default function EditTreatmentPage() {
  const params = useParams();
  const id = params?.id as string;

  if (!id) {
    return <div>Loading...</div>;
  }

  return <EditTreatmentClient id={id} />;
}

'use client';

import AdminGalleryForm from '@/components/admin/AdminGalleryForm';
import { useParams } from 'next/navigation';

export default function DentistImageGallery() {
  const { id } = useParams();
  return <AdminGalleryForm dentistId={id as string} />;
}

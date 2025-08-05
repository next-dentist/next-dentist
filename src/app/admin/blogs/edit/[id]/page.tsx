'use client';

import { use } from 'react';
import EditBlogClient from './EditBlogClient';

export default function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  return <EditBlogClient id={resolvedParams.id} />;
}

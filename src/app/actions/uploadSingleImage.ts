'use server';

import { mkdir, stat } from 'fs/promises';
import path from 'path';
import { z } from 'zod';

// ─── config ────────────────────────────────────────────────────────────────
// uploads outside of public folder

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
const ALLOWED = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

// ─── helper to ensure directory exists ─────────────────────────────────────
async function ensureDir(dir: string) {
  try {
    await stat(dir);
  } catch {
    await mkdir(dir, { recursive: true });
  }
}

// ─── main server action ────────────────────────────────────────────────────
export async function uploadSingleImage(
  _prevState: unknown,
  formData: FormData,
) {
  'use server';

  // Extract data ───────────────────────────────────────────────────────────
  const file = formData.get('image') as File;
  const folder = formData.get('folder') as string;

  // Validate with Zod ─────────────────────────────────────────────────────
  const schema = z.object({
    file: z.any().refine((f) => f instanceof File, 'File is required'),
    folder: z.string().min(1, 'Folder name is required'),
  });

  schema.parse({ file, folder });

  // Validate file type ────────────────────────────────────────────────────
  if (!ALLOWED.includes(file.type)) {
    throw new Error(`File type ${file.type} not allowed`);
  }

  // Upload to FTP ────────────────────────────────────────────────────────
  const uploadFormData = new FormData();
  uploadFormData.append('file', file);
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const response = await fetch(`${baseUrl}/api/upload`, {
    method: 'POST',
    body: uploadFormData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Upload failed');
  }

  const result = await response.json();
  
  // The /api/upload route already saves to db.media, so we don't need to do it again
  
  return { path: result.url };
} 
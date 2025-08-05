// app/actions/uploadCostImages.ts
'use server';

import { db } from '@/db';
import { mkdir, stat, writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

// ─── config ────────────────────────────────────────────────────────────────
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'costImages');
const ALLOWED = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

// --helper to fetch images from the server
export async function getCostImages(costPageId: string) {
  try {
    const images = await db.costImages.findMany({
      where: { costPageId },
    });
    return images;
  } catch (error) {
    console.error('Error fetching cost images:', error);
    throw error;
  }
}

// --helper to delete image
export async function deleteCostImage(imageId: string) {
  try {
    const image = await db.costImages.delete({
      where: { id: imageId },
    });
    return image;
  } catch (error) {
    throw new Error('Failed to delete cost image');
  }
}

// --helper to update image
export async function updateCostImage(imageId: string, data: { imageAlt?: string }) {
  try {
    const image = await db.costImages.update({
      where: { id: imageId },
      data,
    });
    return image;
  } catch (error) {
    throw new Error('Failed to update cost image');
  }
}

// ─── helper to ensure directory exists ─────────────────────────────────────
async function ensureDir(dir: string) {
  try {
    await stat(dir);
  } catch {
    await mkdir(dir, { recursive: true });
  }
}

// ─── main server action ────────────────────────────────────────────────────
export async function uploadCostImages(
  _prevState: unknown,
  formData: FormData,
) {
  'use server';

  // Extract data ───────────────────────────────────────────────────────────
  const costPageId = formData.get('costPageId') as string;
  const files = formData.getAll('images') as File[];

  // Validate costPageId and files with Zod──────────────────────────────────
  const schema = z.object({
    costPageId: z.string().min(1, 'Missing costPageId'),
    files: z
      .array(z.any())
      .min(1, 'At least one file required')
      .max(10, 'Max 10 images per request'),
  });

  schema.parse({ costPageId, files });

  await ensureDir(UPLOAD_DIR);

  const uploadedPaths: string[] = [];

  // Save each file & insert into DB ────────────────────────────────────────
  for (const file of files) {
    if (!ALLOWED.includes(file.type)) {
      throw new Error(`File type ${file.type} not allowed`);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name) || '.jpg';
    const filename = `${uuidv4()}${ext}`;
    const serverPath = path.join(UPLOAD_DIR, filename);
    const publicPath = `/uploads/costImages/${filename}`;

    await writeFile(serverPath, buffer);

    await db.costImages.create({
      data: {
        image: publicPath,
        imageAlt: path.parse(file.name).name,
        costPageId,
      },
    });

    uploadedPaths.push(publicPath);
  }

  return uploadedPaths;          // ← returned to the client
}

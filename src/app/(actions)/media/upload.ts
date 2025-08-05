'use server';

import { db } from '@/db';
import { uploadFile } from '@/lib/ftpClient';
import { unlink, writeFile } from 'fs/promises';
import mime from 'mime-types';
import path from 'path';
import { v4 as uuid } from 'uuid';

export async function uploadAction(prev: unknown, formData: FormData) {
  const file = (formData.get('file') as File | null);
  if (!file) throw new Error('No file');

  // 1. save to tmp
  const tmpPath = path.join('/tmp', uuid());
  await writeFile(tmpPath, Buffer.from(await file.arrayBuffer()));

  // 2. push over FTP
  const remoteName = `${Date.now()}-${file.name}`;
  const remotePath = `${process.env.FTP_BASE_PATH}/${remoteName}`;
  await uploadFile(tmpPath, remotePath);

  // 3. delete tmp
  await unlink(tmpPath);

  // 4. persist meta
  const url = `${process.env.FTP_BASE_URL}/${remoteName}`;
  return db.media.create({
    data: {
      filename: file.name,
      url,
      mimeType: mime.lookup(file.name) || 'application/octet-stream',
      size: file.size,
    },
  });
}

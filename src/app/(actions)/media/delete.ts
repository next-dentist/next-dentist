'use server';
import { db } from '@/db';
import { deleteFile } from '@/lib/ftpClient';

export async function deleteMedia(id: string) {
  // 1. read DB
  const media = await db.media.findUnique({ where: { id } });
  if (!media) throw new Error('Not found');

  // 2. remove from FTP
  const remotePath = `${process.env.FTP_BASE_PATH}/${media.url.split('/').pop()}`;
  await deleteFile(remotePath);

  // 3. remove db row
  await db.media.delete({ where: { id } });
  return true;
}

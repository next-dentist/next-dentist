import { Client } from 'basic-ftp';

export const getFtp = async () => {
  const client = new Client();
  await client.access({
    host: process.env.FTP_HOST!,
    user: process.env.FTP_USER!,
    password: process.env.FTP_PASSWORD!,
    secure: false,
  });
  return client;
};

export const uploadFile = async (local: string, remote: string) => {
  const ftp = await getFtp();
  await ftp.ensureDir(remote.substring(0, remote.lastIndexOf('/')));
  await ftp.uploadFrom(local, remote);
  ftp.close();
};

export const deleteFile = async (remote: string) => {
  const ftp = await getFtp();
  await ftp.remove(remote);
  ftp.close();
};

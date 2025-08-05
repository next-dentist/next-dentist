'use client';
import { uploadAction } from '@/app/(actions)/media/upload';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

export default function UploadDropzone() {
  const qc = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: async (f: File) => {
      const fd = new FormData();
      fd.append('file', f);
      return uploadAction(null, fd);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['media'] });
      toast.success('Uploaded');
    },
    onError: (e: any) => toast.error(e.message),
  });

  const onDrop = useCallback(
    (accepted: File[]) => accepted.forEach(f => mutate(f)),
    [mutate]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: true,
  });

  return (
    <div
      {...getRootProps()}
      className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-teal-400 p-4 text-center"
    >
      <input {...getInputProps()} />
      {isDragActive ? 'Drop files here …' : 'Drag & drop or click to upload'}
    </div>
  );
}

'use client';

import { TreatmentImages } from '@prisma/client';
import Image from 'next/image';
interface BeforeAfterImagesProps {
  images: TreatmentImages[];
}

export default function BeforeAfterImages({ images }: BeforeAfterImagesProps) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl">Before and After Images</h2>
      <div className="flex flex-wrap gap-4">
        {images.map((image) => (
          <div key={image.id} className="w-1/2">
            <Image
              src={image.url || ''}
              alt={image.url || ''}
              width={500}
              height={500}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';

import ImagesGallery from '@/components/ImagesGallery';
import { Images } from '@prisma/client';
import { Award } from 'lucide-react';

interface GalleryTabProps {
  images: Images[];
}

export const GalleryTab: React.FC<GalleryTabProps> = ({ images }) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="mb-4 text-4xl font-bold text-[#356574]">
          Clinic Gallery
        </h2>
        <p className="mx-auto max-w-3xl text-xl text-[#92b5b9]">
          Take a look at our modern facilities and comfortable environment
        </p>
      </div>

      {images.length > 0 ? (
        <ImagesGallery images={images} />
      ) : (
        <div className="py-12 text-center">
          <div className="mx-auto max-w-md">
            <Award className="mx-auto mb-4 h-12 w-12 text-[#92b5b9]" />
            <h3 className="mb-2 text-xl font-semibold text-[#356574]">
              No Gallery Images
            </h3>
            <p className="text-[#92b5b9]">
              Gallery images will be available soon. Contact us to learn more
              about our facilities.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

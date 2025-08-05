'use client';

import ImagesGallery from '@/components/ImagesGallery';
import { Images, Treatments } from '@prisma/client';
import { Award, Heart, Smile } from 'lucide-react';
import { DentistWithRelations } from './types';

interface MobileContentProps {
  dentist: DentistWithRelations;
  treatments: Treatments[];
  images: Images[];
  onTreatmentSelect: (treatment: Treatments) => void;
  onTabChange: (tab: string) => void;
}

export const MobileContent: React.FC<MobileContentProps> = ({
  dentist,
  treatments,
  images,
  onTreatmentSelect,
  onTabChange,
}) => {
  return (
    <div className="space-y-6">
      {/* About Section */}
      {(dentist?.longBio || dentist?.shortBio) && (
        <div className="rounded-2xl border border-[#92b5b9]/20 bg-white p-6 shadow-lg">
          <h2 className="mb-4 flex items-center text-xl font-bold text-[#356574]">
            <Smile className="mr-2 h-5 w-5 text-[#df9d7c]" />
            About
          </h2>
          <p className="text-sm whitespace-pre-wrap text-gray-600">
            {dentist.longBio || dentist.shortBio}
          </p>
        </div>
      )}

      {/* Treatments Section */}
      {treatments.length > 0 && (
        <div className="rounded-2xl border border-[#92b5b9]/20 bg-white p-6 shadow-lg">
          <h2 className="mb-4 flex items-center text-xl font-bold text-[#356574]">
            <Heart className="mr-2 h-5 w-5 text-[#df9d7c]" />
            Treatments
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {treatments.slice(0, 6).map((treatment, index) => (
              <div
                key={treatment.id || index}
                className="cursor-pointer rounded-lg border border-[#92b5b9]/20 bg-gradient-to-br from-[#fffbf8] to-white p-3 transition-all duration-300 hover:shadow-md"
                onClick={() => onTreatmentSelect(treatment)}
              >
                <h3 className="font-medium text-[#356574]">{treatment.name}</h3>
                <p className="text-sm text-[#df9d7c]">
                  ₹{treatment.minPrice || treatment.maxPrice}
                </p>
              </div>
            ))}
          </div>
          {treatments.length > 6 && (
            <button
              onClick={() => onTabChange('treatments')}
              className="mt-4 w-full rounded-lg border border-[#356574] py-2 text-sm font-medium text-[#356574] transition-colors hover:bg-[#356574] hover:text-white"
            >
              View All Treatments
            </button>
          )}
        </div>
      )}

      {/* Gallery Section */}
      {images.length > 0 && (
        <div className="rounded-2xl border border-[#92b5b9]/20 bg-white p-6 shadow-lg">
          <h2 className="mb-4 flex items-center text-xl font-bold text-[#356574]">
            <Award className="mr-2 h-5 w-5 text-[#df9d7c]" />
            Gallery
          </h2>
          <ImagesGallery images={images.slice(0, 4)} />
          {images.length > 4 && (
            <button
              onClick={() => onTabChange('gallery')}
              className="mt-4 w-full rounded-lg border border-[#356574] py-2 text-sm font-medium text-[#356574] transition-colors hover:bg-[#356574] hover:text-white"
            >
              View Full Gallery
            </button>
          )}
        </div>
      )}
    </div>
  );
};

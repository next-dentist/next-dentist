'use client';

import { Star } from 'lucide-react';
import Image from 'next/image';
import { DentistWithRelations } from './types';

interface MobileProfileProps {
  dentist: DentistWithRelations;
}

export const MobileProfile: React.FC<MobileProfileProps> = ({ dentist }) => {
  return (
    <div className="rounded-2xl border border-[#92b5b9]/20 bg-white p-6 shadow-lg">
      <div className="flex flex-col items-center gap-4">
        <Image
          src={dentist?.image || '/images/dentist-card.jpg'}
          alt={dentist?.name || 'Dentist'}
          width={120}
          height={120}
          className="aspect-square rounded-full object-cover"
        />
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#356574]">
            {dentist?.name || 'Dentist'}
          </h1>
          <p className="text-[#df9d7c]">
            {dentist?.speciality || 'Dental Professional'}
          </p>
          <div className="mt-2 flex items-center justify-center gap-2">
            <Star className="h-4 w-4 fill-[#df9d7c] text-[#df9d7c]" />
            <span className="text-sm text-gray-600">
              {dentist?.rating || 5} ({dentist?.totalReviews || 0} reviews)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

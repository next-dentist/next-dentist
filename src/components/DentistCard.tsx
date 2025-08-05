'use client';

import { Button } from '@/components/ui/button';
import { Dentist } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { WhiteTransperentBox } from './WhiteTransperentBox';

interface DentistCardProps {
  dentist: Dentist;
}

export const DentistCard = ({ dentist }: DentistCardProps) => {
  return (
    <WhiteTransperentBox className="transition-shadow duration-300 hover:shadow-lg">
      <div className="flex h-full flex-col">
        {/* Top section with image and basic info */}
        <div className="mb-3 flex items-center gap-3">
          <div className="relative h-16 w-16 flex-shrink-0">
            <Image
              src={dentist.image || '/images/default-avatar.png'}
              alt={dentist.name || ''}
              width={64}
              height={64}
              className="border-primary/20 rounded-full border-2 object-cover"
            />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <h3 className="text-primary truncate font-bold">{dentist.name}</h3>
            <span className="truncate text-sm text-gray-600">
              {dentist.speciality}
            </span>
            <span className="truncate text-xs text-gray-500">
              {dentist.address}
            </span>
          </div>
        </div>

        <div className="">
          <Link href={`/dentists/${dentist.slug}`} className="block w-full">
            <Button className="w-full" size="sm">
              View Profile
            </Button>
          </Link>
        </div>
      </div>
    </WhiteTransperentBox>
  );
};

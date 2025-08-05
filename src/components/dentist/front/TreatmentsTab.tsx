'use client';

import { Treatments } from '@prisma/client';
import { Heart } from 'lucide-react';
import { TreatmentCard } from './TreatmentCard';

interface TreatmentsTabProps {
  treatments: Treatments[];
  onTreatmentSelect: (treatment: Treatments) => void;
  isVisible: boolean;
}

export const TreatmentsTab: React.FC<TreatmentsTabProps> = ({
  treatments,
  onTreatmentSelect,
  isVisible,
}) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <p className="mx-auto max-w-3xl text-xl text-[#92b5b9]">
          Comprehensive dental care with state-of-the-art technology and
          personalized treatment plans
        </p>
      </div>

      {treatments.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {treatments.map((treatment, index) => (
            <TreatmentCard
              key={treatment.id || index}
              treatment={treatment}
              index={index}
              onSelect={onTreatmentSelect}
              isVisible={isVisible}
            />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <div className="mx-auto max-w-md">
            <Heart className="mx-auto mb-4 h-12 w-12 text-[#92b5b9]" />
            <h3 className="mb-2 text-xl font-semibold text-[#356574]">
              No Treatments Listed
            </h3>
            <p className="text-[#92b5b9]">
              This dentist hasn't listed their treatments yet. Please contact
              them directly for more information.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

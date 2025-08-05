'use client';

import { Treatments } from '@prisma/client';
import { Calendar, Phone } from 'lucide-react';

interface TreatmentModalProps {
  treatment: Treatments | null;
  dentistPhone?: string;
  onClose: () => void;
}

export const TreatmentModal: React.FC<TreatmentModalProps> = ({
  treatment,
  dentistPhone,
  onClose,
}) => {
  if (!treatment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-8">
        <div className="mb-6 flex items-start justify-between">
          <h2 className="text-2xl font-bold text-[#356574]">
            {treatment.name}
          </h2>
          <button
            onClick={onClose}
            className="text-2xl text-[#92b5b9] transition-colors hover:text-[#356574]"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg bg-[#fffbf8] p-4">
            <span className="font-medium text-[#356574]">Starting Price</span>
            <span className="text-2xl font-bold text-[#df9d7c]">
              ₹{treatment.minPrice || treatment.maxPrice || 'Contact for price'}
            </span>
          </div>

          {treatment.maxPrice && treatment.minPrice && (
            <div className="flex items-center justify-between rounded-lg bg-[#fffbf8] p-4">
              <span className="font-medium text-[#356574]">Price Range</span>
              <span className="text-lg font-semibold text-[#356574]">
                ₹{treatment.minPrice} - ₹{treatment.maxPrice}
              </span>
            </div>
          )}

          {treatment.duration && (
            <div className="flex items-center justify-between rounded-lg bg-[#fffbf8] p-4">
              <span className="font-medium text-[#356574]">Duration</span>
              <span className="text-lg font-semibold text-[#356574]">
                {treatment.duration}
              </span>
            </div>
          )}

          {treatment.description && (
            <div className="rounded-lg bg-[#fffbf8] p-4">
              <span className="mb-2 block font-medium text-[#356574]">
                Description
              </span>
              <p className="text-sm text-[#92b5b9]">{treatment.description}</p>
            </div>
          )}

          <div className="space-y-3 pt-4">
            <button className="w-full rounded-lg bg-[#356574] py-3 font-semibold text-white transition-all duration-300 hover:bg-[#356574]/90">
              <Calendar className="mr-2 inline h-4 w-4" />
              Book This Treatment
            </button>
            {dentistPhone && (
              <button
                onClick={() => (window.location.href = `tel:${dentistPhone}`)}
                className="w-full rounded-lg border-2 border-[#356574] py-3 font-semibold text-[#356574] transition-all duration-300 hover:bg-[#356574] hover:text-white"
              >
                <Phone className="mr-2 inline h-4 w-4" />
                Call for Consultation
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

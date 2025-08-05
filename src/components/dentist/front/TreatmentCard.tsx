'use client';

import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import AppointmentBooking from '../../AppointmentBooking';
import Drawer from '../../Drawer';
import { TreatmentCardProps } from './types';

interface TreatmentCardComponentProps extends TreatmentCardProps {
  isVisible?: boolean;
}

export const TreatmentCard: React.FC<TreatmentCardComponentProps> = ({
  treatment,
  index,
  onSelect,
  isVisible = true,
}) => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();

  const handleBookNowClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card's onClick from firing

    if (authStatus === 'loading') {
      toast.info('Verifying session, please wait...');
      return;
    }

    if (authStatus !== 'authenticated' || !session?.user?.id) {
      toast.error('Please log in to book an appointment.');
      router.push('/login');
      return;
    }

    // Assuming treatment object has dentistId. This is crucial.
    if (!treatment.dentistId) {
      toast.error('Dentist information is missing for this treatment.');
      console.error('Treatment object is missing dentistId:', treatment);
      return;
    }

    setIsBookingOpen(true);
  };

  const handleBookingSuccess = () => {
    setIsBookingOpen(false);
    // Optionally show a success message or redirect
  };

  const handleCloseDrawer = () => {
    setIsBookingOpen(false);
  };
  return (
    <>
      <div
        className={`transform cursor-pointer rounded-xl border border-[#92b5b9]/20 bg-white p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl ${isVisible ? 'animate-in slide-in-from-bottom-4' : ''}`}
        style={{ animationDelay: `${index * 100}ms` }}
        onClick={() => onSelect(treatment)}
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <Image
            src={treatment.image || '/default-image.jpg'} // Fallback image if treatment.image is not available
            alt={treatment.name}
            className="h-16 w-16 rounded-full object-cover" // Full rounded image
            width={64}
            height={64}
          />
          <h3 className="text-lg font-semibold text-[#356574]">
            {treatment.name}
          </h3>
          <Button variant="outline" size="sm" onClick={handleBookNowClick}>
            Book Now
          </Button>
        </div>
        <div className="space-y-2">
          {treatment.minPrice || treatment.maxPrice ? (
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#92b5b9]">Starting from</span>
              <span className="font-bold text-[#df9d7c]">
                ₹{treatment.minPrice || treatment.maxPrice}
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#92b5b9]">
                Book Appointment for {treatment.name}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#92b5b9]">Duration</span>
            <span className="text-sm text-[#356574]">
              {treatment.duration || 'Varies'}
            </span>
          </div>
        </div>
      </div>
      {isBookingOpen && session?.user?.id && treatment.dentistId && (
        <Drawer
          isOpen={isBookingOpen}
          onClose={handleCloseDrawer}
          title={`Book Appointment for ${treatment.name}`}
          side="right"
          width="w-2/3"
        >
          <AppointmentBooking
            dentistId={treatment.dentistId}
            userId={session.user.id}
            onSuccess={handleBookingSuccess}
            mode="full"
          />
        </Drawer>
      )}
    </>
  );
};

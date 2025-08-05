'use client';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  CheckCircle,
  Clock,
  MapPin,
  MessageCircle,
  Phone,
  Star,
  User,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import AppointmentBooking from './AppointmentBooking';
import CardTimeSlot from './CardTimeSlot';
import Drawer from './Drawer';
import { Badge } from './ui/badge';

interface DentistSearchCardProps {
  dentistData: {
    id: string;
    name: string;
    speciality: string;
    image?: string;
    priceStart?: number;
    phone?: string;
    city?: string;
    state?: string;
    country?: string;
    slug?: string;
    experience?: number;
    patientsServed?: number;
    treatmentsAvailable?: number;
    distance?: number;
    distanceText?: string;
    rating?: number;
    reviewCount?: number;
    freeConsultation?: boolean;
    isAvailable?: boolean;
    onlineNow?: boolean;
    availableSlots?: string[];
    clinicName?: string;
    businessHours?: any;
    verified?: boolean;
    totalReviews?: number;
    treatments?: {
      id: string;
      name: string;
      price: number;
      duration: number;
      image: string;
    }[];
    treatmentCompleted?: number;
    userId?: string;
  };
  compact?: boolean;
}

const DentistSearchCard = ({
  dentistData,
  compact = false,
}: DentistSearchCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [preselectedTimeSlot, setPreselectedTimeSlot] = useState<string | null>(
    null
  );
  const [preselectedDate, setPreselectedDate] = useState<Date | null>(null);
  const [bookingMode, setBookingMode] = useState<'quick' | 'full'>('full');
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();

  const slug = dentistData.slug || `dentist-${dentistData.id}`;

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(prev => !prev);
  };

  const handleBookNowClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Reset preselected values for manual booking
    setPreselectedTimeSlot(null);
    setPreselectedDate(null);
    setBookingMode('full');
    setShowBooking(true);
  };

  const handleMessageClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    console.log('💬 Message button clicked - START:', {
      authStatus,
      dentistId: dentistData.id,
      dentistUserId: dentistData.userId,
      dentistName: dentistData.name,
      timestamp: new Date().toISOString(),
    });

    if (authStatus !== 'authenticated') {
      console.log('❌ User not authenticated');
      toast.error('Please login to send messages');
      router.push('/login');
      return;
    }

    // Prefer userId if available, otherwise use dentist ID (server will resolve it)
    const idToUse = dentistData.userId || dentistData.id;
    const idType = dentistData.userId ? 'userId' : 'dentistId';

    if (!idToUse) {
      console.error('❌ No dentist ID or user ID found:', dentistData);
      toast.error('Unable to message this dentist - missing ID information');
      return;
    }

    console.log('🚀 About to navigate to chat:', {
      idToUse,
      idType,
      dentistName: dentistData.name,
    });
    console.log('🔍 Current URL:', window.location.href);

    // Show loading toast
    const loadingToast = toast.loading('Starting conversation...');

    try {
      // Create chat URL with the resolved ID
      const chatUrl = `/chat?user=${idToUse}&dentist=${dentistData.id}&type=${idType}`;
      console.log('🎯 Navigating to:', chatUrl);

      // Use window.location for immediate navigation
      window.location.href = chatUrl;

      // Also try router.push as backup
      await router.push(chatUrl);

      console.log('✅ Navigation completed successfully');

      // Dismiss loading toast after short delay
      setTimeout(() => {
        toast.dismiss(loadingToast);
      }, 1000);
    } catch (error: any) {
      console.error('❌ Error during navigation:', error);
      toast.dismiss(loadingToast);
      toast.error('Failed to start conversation. Please try again.');
    }

    console.log('💬 Message button clicked - END');
  };

  const handleTimeSlotSelect = (timeSlot: string) => {
    // Set preselected values for quick booking
    setPreselectedTimeSlot(timeSlot);
    setPreselectedDate(new Date()); // Current date
    setBookingMode('quick');
    setShowBooking(true);
  };

  const handleCloseModal = () => {
    setShowBooking(false);
    // Reset preselected values when closing
    setPreselectedTimeSlot(null);
    setPreselectedDate(null);
  };

  const handleBookingSuccess = () => {
    setShowBooking(false);
    // Reset preselected values after successful booking
    setPreselectedTimeSlot(null);
    setPreselectedDate(null);
  };

  const totalTreatments = dentistData.treatments?.length || 0;

  return (
    <>
      <div
        className={`overflow-hidden rounded-lg bg-white p-3 shadow-sm transition-shadow hover:shadow-md md:p-5 ${compact ? 'h-full' : ''}`}
      >
        {/* Redesigned Header Section with Image on left, details on right */}
        <Link href={`/dentists/${dentistData.slug}`} className="block">
          <div className="relative flex">
            {/* Left side - Avatar image with rounded corner */}

            <div className="relative flex-shrink-0">
              <Image
                src={dentistData.image || '/images/default-avatar.png'}
                alt={dentistData.name}
                className={`object-cover ${compact ? 'h-24 w-24' : 'h-24 w-24'} rounded-full bg-gray-100`}
                width={100}
                height={100}
              />
              {dentistData.freeConsultation && (
                <div className="absolute top-2 left-2 z-10 rounded-full bg-green-500 px-1.5 py-0.5 text-xs font-semibold text-white">
                  FREE Consult
                </div>
              )}
            </div>

            {/* Right side - Name, specialty, verification badge */}
            <div className="flex-grow p-2.5">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <span className="flex items-center text-sm leading-tight font-bold text-gray-800">
                    {dentistData.name}
                  </span>
                  <div className="flex items-center gap-1">
                    {dentistData.verified && (
                      <Badge className="ml-1 flex items-center border-green-200 bg-green-100 px-1.5 py-0 text-[10px] text-green-700">
                        <CheckCircle className="mr-0.5 h-2.5 w-2.5" /> Verified
                      </Badge>
                    )}
                  </div>
                  {dentistData.speciality && (
                    <span className="text-dental-blue text-xs leading-tight font-medium">
                      {dentistData.speciality}
                    </span>
                  )}

                  {/* Location */}
                  {(dentistData.city || dentistData.clinicName) && (
                    <div className="mt-1 flex items-center text-xs text-gray-600">
                      <MapPin className="mr-0.5 h-3 w-3 flex-shrink-0" />
                      <span className="truncate">
                        {dentistData.clinicName
                          ? `${dentistData.clinicName} · `
                          : ''}
                        {dentistData.city}
                        {dentistData.state ? `, ${dentistData.state}` : ''}
                      </span>
                    </div>
                  )}

                  {/* Distance */}
                  {dentistData.distanceText && (
                    <span className="mt-0.5 text-xs text-gray-500">
                      {dentistData.distanceText}
                    </span>
                  )}
                </div>

                <div className="flex flex-col items-end gap-1">
                  {/* Favorite button */}
                  {/* <Button
                  variant="outline"
                  className="rounded-full bg-white p-1.5 shadow-sm transition-shadow hover:shadow-md"
                  onClick={toggleFavorite}
                  aria-label={
                    isFavorite ? 'Remove from favorites' : 'Add to favorites'
                  }
                  tabIndex={-1}
                >
                  <Heart
                    className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                  />
                </Button> */}

                  {/* Rating */}
                  {dentistData.rating !== undefined && (
                    <div className="flex items-center rounded bg-gray-50 px-1 py-0.5 text-xs">
                      {dentistData.rating > 0 ? (
                        <>
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="ml-0.5 font-semibold">
                            {dentistData.rating}
                          </span>
                          {dentistData.totalReviews !== undefined &&
                            dentistData.totalReviews > 0 && (
                              <span className="ml-0.5 text-gray-500">
                                ({dentistData.totalReviews})
                              </span>
                            )}
                        </>
                      ) : (
                        <>
                          <Star className="h-3 w-3 fill-gray-400 text-gray-400" />
                          <span className="ml-0.5 font-semibold">0</span>
                          {dentistData.reviewCount !== undefined && (
                            <span className="ml-0.5 text-gray-500">
                              ({dentistData.reviewCount})
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* Content Section */}
        <div className="p-2.5 pt-0">
          {/* Status Tags */}
          {dentistData.onlineNow && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              <div className="flex items-center rounded-full bg-blue-50 px-1.5 py-0.5 text-xs text-blue-700">
                <div className="mr-0.5 h-2 w-2 rounded-full bg-green-500"></div>
                Online Now
              </div>
            </div>
          )}

          {/* Time Slots */}
          {!compact && dentistData.businessHours && (
            <div className="mt-1.5">
              <CardTimeSlot
                businessHours={dentistData.businessHours}
                onTimeSlotSelect={handleTimeSlotSelect}
              />
            </div>
          )}

          {/* Available Slots */}
          {!compact &&
            dentistData.availableSlots &&
            dentistData.availableSlots.length > 0 && (
              <div className="mt-1.5">
                <span className="mb-0.5 flex items-center text-xs text-gray-500">
                  <Clock className="mr-0.5 h-3 w-3" /> Available slots today:
                </span>
                <div className="flex flex-wrap gap-1">
                  {dentistData.availableSlots.map((slot, idx) => (
                    <div
                      key={idx}
                      className="border-dental-blue text-dental-blue rounded-full border px-1.5 py-0.5 text-xs"
                    >
                      {slot}
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Quick Stats */}
          <div className="mt-1.5 grid grid-cols-4 gap-1">
            {totalTreatments !== undefined && totalTreatments > 0 && (
              <div className="bg-primary/5 flex flex-col items-center justify-center rounded p-1.5">
                <span className="text-sm leading-none font-bold">
                  {totalTreatments}+
                </span>
                <span className="text-center text-[10px] leading-tight text-gray-500">
                  Treatments
                </span>
              </div>
            )}
            {dentistData.patientsServed !== undefined &&
              dentistData.patientsServed > 0 && (
                <div className="bg-primary/5 flex flex-col items-center justify-center rounded p-1.5">
                  <span className="text-sm leading-none font-bold">
                    {dentistData.patientsServed}+
                  </span>
                  <span className="text-center text-[10px] leading-tight text-gray-500">
                    Patients
                  </span>
                </div>
              )}
            {dentistData.treatmentCompleted !== undefined &&
              dentistData.treatmentCompleted > 0 && (
                <div className="bg-primary/5 flex flex-col items-center justify-center gap-0.5 rounded p-1.5">
                  <span className="text-sm leading-none font-bold">
                    {dentistData.treatmentCompleted}+
                  </span>
                  <span className="text-center text-[10px] leading-tight text-gray-500">
                    Treatments Completed
                  </span>
                </div>
              )}
          </div>

          {/* Pricing & Experience */}
          {!compact && (
            <div className="mt-1.5 flex items-center justify-between">
              {(dentistData.freeConsultation === true ||
                (dentistData.priceStart !== undefined &&
                  dentistData.priceStart !== null &&
                  dentistData.priceStart !== 0)) && (
                <div className="flex flex-row items-center justify-center gap-2 rounded bg-gray-50 p-1.5">
                  <span className="mb-0 text-xs text-gray-500">
                    Consultation Fee
                  </span>
                  <span className="text-sm font-semibold text-gray-800">
                    {dentistData.freeConsultation
                      ? 'FREE'
                      : dentistData.priceStart
                        ? `₹${dentistData.priceStart}`
                        : '₹500'}
                  </span>
                </div>
              )}
              {dentistData.experience !== undefined &&
                dentistData.experience > 0 && (
                  <div className="rounded bg-gray-50 px-1.5 py-0.5 text-xs">
                    <User className="mr-0.5 inline h-3 w-3" />
                    <span className="font-medium">
                      {dentistData.experience} years exp.
                    </span>
                  </div>
                )}
            </div>
          )}

          {/* Action Buttons */}
          <div className={`flex gap-1 ${compact ? 'mt-1.5' : 'mt-2'}`}>
            <Button
              className="btn-pulse bg-primary/10 hover:bg-primary/30 text-primary h-8 flex-1 py-1 text-xs"
              onClick={handleBookNowClick}
              type="button"
              title="Book an appointment"
            >
              <Calendar className="mr-0.5 h-3 w-3" />
              Book
            </Button>
            {dentistData.id && (
              <Button
                variant="secondary"
                className="bg-primary/10 hover:bg-primary/30 text-primary h-8 flex-1 py-1 text-xs"
                onClick={handleMessageClick}
                type="button"
                title="Send message"
              >
                <MessageCircle className="mr-0.5 h-3 w-3" />
                Message
              </Button>
            )}
            {dentistData.phone && (
              <Button
                variant="secondary"
                className="bg-primary/10 hover:bg-primary/30 text-primary h-8 flex-1 py-1 text-xs"
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.location.href = `tel:${dentistData.phone}`;
                }}
                type="button"
              >
                <Phone className="mr-0.5 h-3 w-3" /> Call
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Booking Drawer - Only rendered when showBooking is true */}
      {showBooking && (
        <Drawer
          isOpen={showBooking}
          onClose={handleCloseModal}
          title={`Book Appointment with ${dentistData.name}`}
          side="right"
          width="w-2/3"
        >
          <AppointmentBooking
            dentistId={dentistData.id || ''}
            userId={session?.user?.id || 'anonymous'}
            onSuccess={handleBookingSuccess}
            businessHours={dentistData.businessHours}
            mode={bookingMode}
            preselectedDate={preselectedDate}
            preselectedTimeSlot={preselectedTimeSlot}
          />
        </Drawer>
      )}
    </>
  );
};

export default DentistSearchCard;

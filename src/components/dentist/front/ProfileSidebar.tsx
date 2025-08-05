'use client';

import {
  CheckCircle,
  ClipboardPlus,
  Clock,
  Mail,
  Phone,
  Star,
  Timer,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import { Degree, DentistWithRelations } from './types';

interface ProfileSidebarProps {
  dentist: DentistWithRelations;
  degreeData: Degree[];
  age: number | null;
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  dentist,
  degreeData,
  age,
}) => {
  return (
    <div className="w-80 flex-shrink-0">
      <div className="sticky top-4 rounded-4xl border border-[#92b5b9]/20 bg-white p-6">
        <div className="flex flex-col items-center gap-4">
          <Image
            src={dentist?.image || '/images/dentist-card.jpg'}
            alt={dentist?.name || 'Dentist'}
            width={100}
            height={100}
            className="aspect-square rounded-full object-cover"
          />
          <div className="flex w-full flex-col items-center gap-2 text-center">
            <h2 className="text-2xl font-bold text-[#356574]">
              {dentist?.name || 'Dentist'}
            </h2>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-[#df9d7c] text-[#df9d7c]" />
              <span className="text-sm text-gray-600">
                {dentist?.rating || 5} ({dentist?.totalReviews || 0} reviews)
              </span>
            </div>

            {(dentist?.gender || age !== null) && (
              <div className="text-sm text-gray-500">
                {dentist?.gender && <span>{dentist.gender}</span>}
                {dentist?.gender && age !== null && (
                  <span className="mx-1">•</span>
                )}
                {age !== null && <span>{age} years old</span>}
              </div>
            )}

            <div className="my-2 h-px w-full bg-[#92b5b9]/20"></div>

            {/* Degrees */}
            <div className="flex min-h-[20px] flex-wrap justify-center gap-2 text-sm text-gray-500">
              {degreeData &&
                Array.isArray(degreeData) &&
                degreeData.map(degree => (
                  <span
                    key={degree.id}
                    className="rounded-full bg-[#356574]/10 px-3 py-1 text-xs text-[#356574]"
                  >
                    {degree.name}
                  </span>
                ))}
            </div>

            {/* Specialty */}
            {dentist?.speciality && (
              <span className="rounded-full bg-[#df9d7c]/10 px-3 py-1 text-xs font-medium text-[#df9d7c]">
                {dentist.speciality}
              </span>
            )}

            <div className="my-2 h-px w-full bg-[#92b5b9]/20"></div>

            {/* Verification Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {dentist?.verified && (
                <span className="flex items-center gap-1 rounded-full bg-green-500 px-3 py-1 text-xs text-white">
                  <CheckCircle className="h-3 w-3" />
                  Verified
                </span>
              )}
              <span className="flex items-center gap-1 rounded-full bg-[#356574] px-3 py-1 text-xs text-white">
                <ClipboardPlus className="h-3 w-3" />
                Clinic Verified
              </span>
            </div>

            <div className="my-2 h-px w-full bg-[#92b5b9]/20"></div>

            {/* Stats */}
            <div className="flex w-full flex-col gap-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-[#92b5b9]" />
                <span className="text-sm text-gray-600">
                  {dentist?.patientsServed || 1000}+ Patients Served
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-[#92b5b9]" />
                <span className="text-sm text-gray-600">
                  {dentist?.treatmentCompleted || 500}+ Treatments Completed
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#92b5b9]" />
                <span className="text-sm text-gray-600">
                  {dentist?.experience || 10} Years Experience
                </span>
              </div>
            </div>

            <div className="my-2 h-px w-full bg-[#92b5b9]/20"></div>

            {/* Contact Buttons */}
            <div className="grid w-full grid-cols-1 gap-2">
              {dentist?.phone && (
                <button
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#356574] px-4 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-[#356574]/90"
                  onClick={() =>
                    (window.location.href = `tel:${dentist?.phone}`)
                  }
                >
                  <Phone className="h-4 w-4 flex-shrink-0" /> Call Now
                </button>
              )}
              {dentist?.email && (
                <button
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-[#356574] px-4 py-3 text-sm font-medium text-[#356574] transition-all duration-300 hover:bg-[#356574] hover:text-white"
                  onClick={() =>
                    (window.location.href = `mailto:${dentist?.email}`)
                  }
                >
                  <Mail className="h-4 w-4 flex-shrink-0" /> Send Email
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

'use client';

import { Degree } from '@prisma/client';
import { Award, CheckCircle, Phone, Star, Users } from 'lucide-react';
import Image from 'next/image';
import { StatCard } from './StatCard';
import { DentistWithRelations } from './types';

interface HeroSectionProps {
  dentist: DentistWithRelations;
  isVisible: boolean;
  degreeData: Degree[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  dentist,
  isVisible,
  degreeData,
}) => {
  return (
    <div className="gradient-bg relative overflow-hidden rounded-2xl">
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div
          className={`grid items-center gap-8 lg:grid-cols-2 ${isVisible ? 'animate-in fade-in duration-1000' : ''}`}
        >
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 rounded-full bg-amber-400 px-4 py-2 backdrop-blur-sm">
              <Award className="h-4 w-4" />
              <span className="text-sm">
                {dentist?.verified
                  ? 'Verified Professional'
                  : 'Professional Dentist'}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Image
                src={dentist?.image || '/images/dentist-card.jpg'}
                alt={dentist?.name || 'Dentist'}
                width={150}
                height={150}
                className="aspect-square rounded-full object-cover"
              />
              <div className="flex flex-col">
                <span className="rounded-lg bg-[#91BCC375] px-6 py-2">
                  <h1 className="text-4xl text-[#356574] lg:text-5xl">
                    {dentist?.name || 'Dentist'}
                  </h1>
                </span>
                <span className="mt-2 block text-[#df9d7c]">
                  {dentist?.speciality || 'Dental Professional'}
                </span>
                {degreeData.length > 0 && (
                  <div className="mb-4">
                    <h3 className="mb-2 font-semibold text-[#356574]">
                      Qualifications
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {degreeData.map(degree => (
                        <span
                          key={degree.id}
                          className="rounded-full bg-[#356574]/10 px-3 py-1 text-xs text-[#356574]"
                        >
                          {degree.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <p className="text-sm leading-relaxed md:text-xl">
              {dentist?.shortBio ||
                dentist?.longBio?.substring(0, 200) + '...' ||
                'Professional dental care with years of experience and dedication to patient satisfaction.'}
            </p>

            <div className="flex flex-wrap gap-4">
              <button className="bg-secondary transform rounded-full px-8 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#df9d7c]/90">
                Book Appointment
              </button>
              {dentist?.phone && (
                <button
                  onClick={() =>
                    (window.location.href = `tel:${dentist.phone}`)
                  }
                  className="border-secondary hover:bg-secondary rounded-full border-2 px-8 py-3 font-semibold text-[#356574] transition-all duration-300 hover:text-[#356574]"
                >
                  <Phone className="mr-2 inline h-4 w-4" />
                  Call Now
                </button>
              )}
            </div>

            <div className="flex items-center space-x-6 pt-4">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < (dentist?.rating || 5) ? 'fill-[#df9d7c] text-[#df9d7c]' : 'text-white/30'}`}
                  />
                ))}
                <span className="text-secondary/90 ml-2">
                  {dentist?.rating || 5}.0 ({dentist?.totalReviews || 0}{' '}
                  reviews)
                </span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10 rounded-4xl border border-white/20 bg-[#91BCC375] p-8 backdrop-blur-sm">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {dentist?.patientsServed && (
                  <StatCard
                    icon={Users}
                    value={`${dentist.patientsServed}+`}
                    label="Patients Served"
                    color="text-primary/70"
                    isVisible={isVisible}
                  />
                )}
                {dentist?.treatmentCompleted && (
                  <StatCard
                    icon={CheckCircle}
                    value={`${dentist.treatmentCompleted}+`}
                    label="Treatments Done"
                    color="text-primary/70"
                    isVisible={isVisible}
                  />
                )}
                {dentist?.experience && (
                  <StatCard
                    icon={Award}
                    value={`${dentist.experience}+`}
                    label="Years Experience"
                    color="text-primary/70"
                    isVisible={isVisible}
                  />
                )}
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-[#df9d7c]/30 blur-xl"></div>
            <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-white/20 blur-xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

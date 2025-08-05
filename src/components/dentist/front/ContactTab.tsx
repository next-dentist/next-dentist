'use client';

import { Calendar, Clock, Globe, Mail, MapPin, Phone } from 'lucide-react';
import { BusinessHours, DentistWithRelations } from './types';

interface ContactTabProps {
  dentist: DentistWithRelations;
  businessHours: BusinessHours;
}

export const ContactTab: React.FC<ContactTabProps> = ({
  dentist,
  businessHours,
}) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="mb-4 text-4xl font-bold text-[#356574]">Get In Touch</h2>
        <p className="mx-auto max-w-3xl text-xl text-[#92b5b9]">
          Ready to schedule your appointment? Contact us today
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Contact Information */}
        <div className="rounded-2xl border border-[#92b5b9]/20 bg-white p-8 shadow-sm">
          <h3 className="mb-6 text-2xl font-bold text-[#356574]">
            Contact Information
          </h3>
          <div className="space-y-6">
            {(dentist?.practiceLocation || dentist?.city) && (
              <div className="flex items-start space-x-4">
                <MapPin className="mt-1 h-6 w-6 text-[#df9d7c]" />
                <div>
                  <h4 className="mb-1 font-semibold text-[#356574]">Address</h4>
                  <p className="text-[#92b5b9]">
                    {dentist?.practiceLocation && (
                      <span>
                        {dentist.practiceLocation}
                        <br />
                      </span>
                    )}
                    {[dentist?.city, dentist?.state, dentist?.country]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                </div>
              </div>
            )}

            {dentist?.phone && (
              <div className="flex items-center space-x-4">
                <Phone className="h-6 w-6 text-[#df9d7c]" />
                <div>
                  <h4 className="mb-1 font-semibold text-[#356574]">Phone</h4>
                  <p className="text-[#92b5b9]">{dentist.phone}</p>
                </div>
              </div>
            )}

            {dentist?.email && (
              <div className="flex items-center space-x-4">
                <Mail className="h-6 w-6 text-[#df9d7c]" />
                <div>
                  <h4 className="mb-1 font-semibold text-[#356574]">Email</h4>
                  <p className="text-[#92b5b9]">{dentist.email}</p>
                </div>
              </div>
            )}

            {dentist?.website && (
              <div className="flex items-center space-x-4">
                <Globe className="h-6 w-6 text-[#df9d7c]" />
                <div>
                  <h4 className="mb-1 font-semibold text-[#356574]">Website</h4>
                  <a
                    href={
                      dentist.website.startsWith('http')
                        ? dentist.website
                        : `https://${dentist.website}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#df9d7c] hover:underline"
                  >
                    {dentist.website}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Working Hours */}
        <div className="rounded-2xl border border-[#92b5b9]/20 bg-white p-8 shadow-sm">
          <h3 className="mb-6 text-2xl font-bold text-[#356574]">
            <Clock className="mr-3 inline h-6 w-6 text-[#df9d7c]" />
            Business Hours
          </h3>
          <div className="space-y-4">
            {Object.entries(businessHours).map(([day, schedule]) => {
              const daySchedule = schedule as {
                Hours: { from: string; to: string }[];
                Closed: boolean;
              };
              return (
                <div
                  key={day}
                  className="flex items-center justify-between rounded-lg bg-gradient-to-r from-[#fffbf8] to-[#92b5b9]/10 p-4"
                >
                  <span className="font-semibold text-[#356574]">{day}</span>
                  <span className="text-[#92b5b9]">
                    {daySchedule?.Closed
                      ? 'Closed'
                      : `${daySchedule?.Hours?.[0]?.from} - ${daySchedule?.Hours?.[0]?.to}`}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-6 rounded-xl bg-gradient-to-r from-[#df9d7c]/10 to-[#356574]/10 p-6">
            <h4 className="mb-3 text-xl font-semibold text-[#356574]">
              Ready to Schedule?
            </h4>
            <p className="mb-4 text-[#92b5b9]">
              Book your appointment today and take the first step towards better
              oral health.
            </p>
            <button className="transform rounded-full bg-[#356574] px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-[#356574]/90">
              <Calendar className="mr-2 inline h-4 w-4" />
              Book Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

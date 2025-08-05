'use client';

import {
  Award,
  Car,
  CheckCircle,
  CreditCard,
  Facebook,
  Globe,
  Heart,
  Instagram,
  Linkedin,
  Shield,
  ShieldCheck,
  Smile,
  Twitter,
  Wifi,
  Youtube,
  Zap,
} from 'lucide-react';
import { DentistWithRelations, KnowsAboutItem } from './types';

interface OverviewTabProps {
  dentist: DentistWithRelations;
  knowsAboutData: KnowsAboutItem[];
  socialLinks: Record<string, string>;
  isVisible: boolean;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  dentist,
  knowsAboutData,
  socialLinks,
  isVisible,
}) => {
  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook':
        return Facebook;
      case 'instagram':
        return Instagram;
      case 'twitter':
        return Twitter;
      case 'linkedin':
        return Linkedin;
      case 'youtube':
        return Youtube;
      default:
        return Globe;
    }
  };

  return (
    <div className="space-y-8">
      {/* About Section */}
      <div
        className={`${isVisible ? 'animate-in slide-in-from-bottom-4' : ''}`}
      >
        <div className="mb-6 flex items-center text-3xl font-bold text-[#356574]">
          <Smile className="mr-3 h-8 w-8 text-[#df9d7c]" />
          About {dentist?.name || 'Our Dentist'}
        </div>
        <div className="prose prose-lg leading-relaxed text-[#356574]">
          {dentist?.longBio || dentist?.shortBio ? (
            <p className="whitespace-pre-wrap">
              {dentist.longBio || dentist.shortBio}
            </p>
          ) : (
            <p>
              Professional dental care with experience and dedication to patient
              satisfaction.
            </p>
          )}
        </div>
      </div>

      {/* Areas of Expertise */}
      {knowsAboutData.length > 0 && (
        <div className="space-y-4">
          <h3 className="flex items-center text-2xl font-bold text-[#356574]">
            <Award className="mr-3 h-6 w-6 text-[#df9d7c]" />
            Areas of Expertise
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {knowsAboutData.map((item, index) => (
              <div
                key={index}
                className="rounded-lg border bg-indigo-50 p-4 shadow-sm"
              >
                <p className="font-semibold text-indigo-700">{item.name}</p>
                <p className="mt-1 text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Features */}
      <div className="space-y-4">
        <h3 className="flex items-center text-2xl font-bold text-[#356574]">
          <Shield className="mr-3 h-6 w-6 text-[#df9d7c]" />
          Why Choose Us
        </h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {[
            {
              icon: Wifi,
              text: 'Free Wi-Fi',
              desc: 'Complimentary Wi-Fi for all patients.',
            },
            {
              icon: CreditCard,
              text: 'Credit Cards',
              desc: 'Major credit cards accepted.',
            },
            {
              icon: Car,
              text: 'Free Parking',
              desc: 'Ample free parking available.',
            },
            {
              icon: Shield,
              text: 'Advanced Technology',
              desc: 'State-of-the-art dental equipment.',
            },
            {
              icon: Heart,
              text: 'Patient-Centered Care',
              desc: 'Personalized treatment plans.',
            },
            {
              icon: Zap,
              text: 'Quick & Efficient',
              desc: 'Minimized waiting times.',
            },
          ].map(({ icon: Icon, text, desc }, index) => (
            <div
              key={index}
              className="rounded-lg bg-gradient-to-br from-[#df9d7c]/10 to-[#92b5b9]/10 p-4"
            >
              <div className="flex items-center space-x-3">
                <Icon className="h-5 w-5 text-[#df9d7c]" />
                <div>
                  <div className="font-medium text-[#356574]">{text}</div>
                  <div className="text-xs text-[#92b5b9]">{desc}</div>
                </div>
              </div>
            </div>
          ))}
          {dentist?.acceptsInsurance && (
            <div className="rounded-lg bg-gradient-to-br from-green-50 to-green-100 p-4">
              <div className="flex items-center space-x-3">
                <ShieldCheck className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium text-green-800">Insurance</div>
                  <div className="text-xs text-green-600">
                    Accepts various insurance plans.
                  </div>
                </div>
              </div>
            </div>
          )}
          {dentist?.freeConsultation && (
            <div className="rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 p-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-medium text-blue-800">
                    Free Consultation
                  </div>
                  <div className="text-xs text-blue-600">
                    Initial consultation at no cost.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Social Links */}
      {Object.keys(socialLinks).length > 0 && (
        <div className="space-y-4">
          <h3 className="flex items-center text-2xl font-bold text-[#356574]">
            <Globe className="mr-3 h-6 w-6 text-[#df9d7c]" />
            Connect With Us
          </h3>
          <div className="flex space-x-4">
            {Object.entries(socialLinks).map(([platform, url]) => {
              if (!url) return null;
              const Icon = getSocialIcon(platform);
              const colors =
                {
                  facebook: 'bg-blue-500 hover:bg-blue-600',
                  instagram: 'bg-pink-500 hover:bg-pink-600',
                  twitter: 'bg-sky-500 hover:bg-sky-600',
                  linkedin: 'bg-blue-700 hover:bg-blue-800',
                  youtube: 'bg-red-500 hover:bg-red-600',
                }[platform.toLowerCase()] ||
                'bg-[#356574] hover:bg-[#356574]/90';

              return (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`rounded-full p-3 text-white transition-colors ${colors}`}
                >
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}
            {dentist?.website && (
              <a
                href={
                  dentist.website.startsWith('http')
                    ? dentist.website
                    : `https://${dentist.website}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-[#356574] p-3 text-white transition-colors hover:bg-[#356574]/90"
              >
                <Globe className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

import { Dentist, Images, Treatments } from '@prisma/client';

export type BusinessHours = {
  [key: string]: {
    Name: string;
    Hours: { from: string; to: string }[];
    Closed: boolean;
  };
};

export type Degree = {
  id: string;
  name: string;
  fullName: string;
};

export type AwardItem = {
  name: string;
  dateAwarded: string;
};

export type AlumniItem = {
  name: string;
  '@type': string;
  sameAs?: string;
};

export type WorkingAtItem = {
  name: string;
  '@type': string;
  sameAs?: string;
  position: string;
  startDate: string;
};

export type KnowsAboutItem = {
  name: string;
  '@type': 'Thing';
  description: string;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type DentistWithRelations = Dentist & {
  treatments: Treatments[];
  images: Images[];
  dentistDegree: Degree[];
  languages: string[];
  specializations: string[];
  businessHours: BusinessHours;
  awards?: AwardItem[];
  alumniOf?: AlumniItem[];
  workingAt?: WorkingAtItem[];
  knowsAbout?: KnowsAboutItem[];
  socialLinks?: Record<string, string>;
  faq?: FaqItem[];
};

export interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
  color?: string;
}

export interface TreatmentCardProps {
  treatment: Treatments;
  index: number;
  onSelect: (treatment: Treatments) => void;
} 
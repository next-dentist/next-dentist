import {
  Appointment,
  Cost,
  FAQ,
  FavoriteDentists,
  Images,
  Instruction,
  Language,
  Message,
  Post,
  SavedDentists,
  Section,
  Specialization,
  TreatmentImages,
  Treatments,
  TreatmentsReviews,
  TreatmentVideos,
  User
} from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";

export type Treatment = {
  name: string;

  description: string;
  image: string;
  cost: number;
};

export type DentistBasic = {
  userId: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  website: string;
};

export interface DentistStatus {
  pending: string;
  verified: string;
  rejected: string;
  banned: string;
  deleted: string;
  suspended: string;
  closed: string;
}

export interface TreatmentMeta {
  id: string;
  image?: string;
  beforeAfter?: string;
  name?: string;
  description?: string;
  duration?: string;
  slug?: string;
  relatedKeys?: string;
  contents?: string;
  dateAndTime?: Date;
  updatedDateAndTime?: Date;
  video?: string;
  imageCaption?: string;
  imageCaptionLink?: string;
  imageTopRightDescription?: string;
  imageTopRightLink?: string;
  imageTopRightText?: string;
  costs?: Cost[];
  faq?: FAQ[];
  instructions?: Instruction[];
  sections?: Section[];
  images?: TreatmentImages[];
  Treatments?: Treatments[];
  videos?: TreatmentVideos[];
}

export type Degree = {
  id: string;
  name: string;
  fullName: string;
};

export type EmailVerificationResponse = {
  success?: boolean;
  available?: boolean;
  message?: string;
  error?: string;
};

export interface Award {
  "@type": "Award";
  name: string;
  dateAwarded: string;
}

export type Awards = Award[];

export type Alumni = {
  id: string;
  name: string;
  year: string;
  website: string;
};

export type AlumniOf = Alumni[];

export type WorkingAt = {
  id: string;
  name: string;
  year: string;
  website: string;
};

export type WorkingFor = WorkingAt[];

export type Knows = {
  id: string;
  name: string;
  website: string;
};

export type KnowsAbout = Knows[];

export type Dentist = {
  id: string;
  userId: string;
  name: string | null;
  email: string | null;
  emailVerified: boolean;
  image: string | null;
  seo: JsonValue | null;
  priceStart: string | null;
  gender: string | null;
  dob: string | null;
  verified: boolean;
  experience: string | null;
  shortBio: string | null;
  longBio: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  slug: string;
  status: DentistStatus;
  rating: number | null;

  speciality: string | null;
  createdAt: Date;
  updatedAt: Date;
  businessHours: JsonValue | null;
  acceptsInsurance: boolean | null;
  DegreesID: string | null;
  dentistDegree: JsonValue | null;
  treatmentCompleted: number | null;
  patientsServed: number | null;
  isAvailable: boolean | null;
  isQuickResponse: boolean | null;
  hasVideoCall: boolean | null;
  specialLineOneTitle: string | null;
  specialLineOne: string | null;
  specialLineTwoTitle: string | null;
  specialLineTwo: string | null;
  specialLineThreeTitle: string | null;
  specialLineThree: string | null;
  lastName: string | null;
  website: string | null;
  zipCode: string | null;
  dateAndTime: Date | null;
  updatedDateAndTime: Date | null;
  Appointment: Appointment[];
  user: User;
  FavoriteDentists: FavoriteDentists[];
  images: Images[];
  languages: Language[];
  messages: Message[];
  post: Post[];
  reviews: any[];
  SavedDentists: SavedDentists[];
  treatments: Treatments[];
  TreatmentsReviews: TreatmentsReviews[];
  specializations: Specialization[];
  faq: FAQ[];
  socialLinks?: JsonValue | null;
  awards?: JsonValue | null;
  alumniOf?: JsonValue | null;
  workingAt?: JsonValue | null;
  nationality?: string | null;
  knowsAbout?: JsonValue | null;
};
export type Currency = 'INR' | 'USD' | 'GBP';

export interface CostTable {
  id: string;
  title: string;
  titleUrl: string | null;
  content: string;
  image: string | null;
  imageAlt: string | null;
  currencyOne: string | null;
  currencyTwo: string | null;
  currencyThree: string | null;
  costOne: string | null; // range formatted string
  costTwo: string | null;
  costThree: string | null;
  costPageId: string;
  tableSetId: string | null;
}

export interface CostSection {
  id: string;
  title: string;
  image: string;
  imageAlt: string;
  content: string;
}

export interface CostImage {
  id: string;
  image: string;
  imageAlt: string;
}

export interface CostVideo {
  id: string;
  video: string;
  videoAlt: string | null;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
}

export interface CostPageData {
  id: string;
  title: string;
  slug: string;
  content: string;
  image: string | null;
  imageAlt: string | null;
  city: string | null;
  relatedKeys: string[] | null;
  costTables: CostTable[];
  tableSets?: CostTableSet[];
  CostSection: CostSection[];
  costImages: CostImage[];
  CostVideo: CostVideo[];
  faqs: Faq[];
}

export interface CostTableSet {
  id: string;
  name: string;
  slug: string;
  costPageId: string;
  costTables: CostTable[];
}

// Export WhatsApp types
export * from './whatsapp';


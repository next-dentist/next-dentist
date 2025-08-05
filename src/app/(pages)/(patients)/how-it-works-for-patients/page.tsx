import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  CalendarCheck,
  CalendarCheck2,
  ClipboardList,
  HeartPulse,
  Search,
  Star,
} from 'lucide-react';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'How It Works for Patients | NextDentist',
  description:
    'Discover how patients can easily search for dentists, book appointments, and manage their dental health through NextDentist.',
  keywords: [
    'find dentists online',
    'book dental appointment',
    'patient dental platform',
    'trusted dentists',
    'dental care search',
    'NextDentist how it works',
  ],
};

interface Step {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const steps: Step[] = [
  {
    title: 'Search for Dentists',
    description:
      'Enter your location and dental need. Filter by specialty, language, ratings, availability, and insurance.',
    icon: Search,
  },
  {
    title: 'View Detailed Clinic Profiles',
    description:
      'Explore verified credentials, photos, services, patient reviews, and transparent pricing—all in one place.',
    icon: ClipboardList,
  },
  {
    title: 'Book Appointments Instantly',
    description:
      'Pick a time that suits you and receive instant confirmation, reminders, and easy online rescheduling.',
    icon: CalendarCheck,
  },
  {
    title: 'Attend Your Appointment',
    description:
      'Visit with confidence—every clinic meets our Quality Guidelines for safety, cleanliness, and ethical care.',
    icon: CalendarCheck2,
  },
  {
    title: 'Leave a Review',
    description:
      'Share your experience to help others and support clinics in continuously improving their service.',
    icon: Star,
  },
  {
    title: 'Manage Your Dental Health Digitally',
    description:
      'Track appointments, store documents, set follow‑up reminders, and message providers—all from your account.',
    icon: HeartPulse,
  },
];

const HowItWorksPatientsPage: React.FC = props => {
  return (
    <div className="bg-background text-foreground container mx-auto flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="from-primary/10 to-background bg-gradient-to-b px-4 py-24 text-center">
        <h1 className="mb-4 text-4xl font-bold md:text-5xl">
          How It Works for Patients
        </h1>
        <p className="mx-auto max-w-2xl text-lg md:text-xl">
          Finding trusted dental care has never been easier. Follow six simple
          steps to connect with verified professionals anytime, anywhere.
        </p>
      </section>

      {/* Steps Grid */}
      <section className="container grid grid-cols-1 gap-8 py-16 md:grid-cols-2 lg:grid-cols-3">
        {steps.map(({ title, description, icon: Icon }, idx) => (
          <Card
            key={title}
            className="bg-white/90 shadow-sm backdrop-blur transition-shadow hover:shadow-md supports-[backdrop-filter]:bg-white/60"
          >
            <CardHeader className="flex items-center gap-4">
              <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                <Icon className="text-primary h-6 w-6" />
              </div>
              <CardTitle className="text-xl leading-tight font-semibold">
                {idx + 1}. {title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {description}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* CTA Section */}
      <section className="bg-muted/20 px-4 py-24 text-center">
        <h2 className="mb-4 text-3xl font-bold md:text-4xl">
          Your Health, Our Priority
        </h2>
        <p className="mx-auto mb-8 max-w-3xl text-lg md:text-xl">
          Founded by Dr. Megha Vyas and managed by Project Manager Mr. Palak
          Bhatt, NextDentist bridges the gap between patients and dental
          professionals worldwide.
        </p>
        <Button size="lg">Find a Dentist Now</Button>
      </section>
    </div>
  );
};

export default HowItWorksPatientsPage;

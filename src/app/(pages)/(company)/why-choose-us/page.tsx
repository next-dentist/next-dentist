import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AreaChart,
  BadgeCheck,
  BookUser,
  Globe,
  Languages,
  LayoutGrid,
  Presentation,
  Star,
  Timer,
  Users,
  Wallet,
} from 'lucide-react';
import { Metadata } from 'next'; // Import Metadata
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

// Add Metadata for the page
export const metadata: Metadata = {
  title: 'Why Choose NextDentist? | Your Trusted Dental Platform',
  description:
    'Discover why NextDentist is the best choice for patients seeking quality dental care and for dentists looking to grow their practice. Explore our features, benefits, and commitment to excellence.',
  keywords: [
    'Why NextDentist',
    'choose NextDentist',
    'dental platform benefits',
    'find a dentist',
    'grow dental practice',
    'online dental booking',
    'verified dentists',
    'patient reviews',
    'dental technology',
    'NextDentist advantages',
    'best dental platform',
  ],
};

const WhyChooseUsPage: React.FC = props => {
  const patientFeatures = [
    {
      title: 'Easy Access to Global Dental Care',
      description:
        'Find trusted dentists near you or abroad in just a few clicks and book appointments online without waiting on calls.',
      icon: <Globe className="text-primary h-8 w-8" />,
    },
    {
      title: 'Verified Dentist Listings',
      description:
        'All dentists on the platform are screened for qualifications, licensing, and patient reviews.',
      icon: <BadgeCheck className="text-primary h-8 w-8" />,
    },
    {
      title: '24/7 Appointment Booking',
      description:
        'Book anytime, from anywhere—convenient for busy schedules or emergencies.',
      icon: <Timer className="text-primary h-8 w-8" />,
    },
    {
      title: 'Transparent Pricing & Treatment Info',
      description:
        'Know your options, compare treatments, and understand costs upfront.',
      icon: <Wallet className="text-primary h-8 w-8" />,
    },
    {
      title: 'Multilingual & Multinational Support',
      description:
        'Ideal for medical tourists or expats looking for care in their language.',
      icon: <Languages className="text-primary h-8 w-8" />,
    },
    {
      title: 'Patient Reviews & Ratings',
      description: 'Make confident choices based on real patient feedback.',
      icon: <Star className="text-primary h-8 w-8" />,
    },
  ];

  const dentistFeatures = [
    {
      title: 'Grow Your Practice',
      description: 'Reach a wider audience and attract new patients online.',
      icon: <Users className="text-primary h-8 w-8" />,
    },
    {
      title: 'Lead Generation Tools',
      description:
        'Get high-quality leads and inquiries from patients actively looking for services.',
      icon: <BookUser className="text-primary h-8 w-8" />,
    },
    {
      title: 'Online Profile & Branding',
      description:
        'Showcase your expertise, services, and reviews in a professional profile.',
      icon: <Presentation className="text-primary h-8 w-8" />,
    },
    {
      title: 'Appointment Management',
      description:
        'Integrated tools to manage bookings, reminders, and cancellations easily.',
      icon: <LayoutGrid className="text-primary h-8 w-8" />,
    },
    {
      title: 'Analytics & Insights',
      description:
        'Understand your performance with patient interaction data and trends.',
      icon: <AreaChart className="text-primary h-8 w-8" />,
    },
    {
      title: 'Support & Marketing',
      description:
        'Get help with SEO, marketing campaigns, and patient engagement strategies.',
      icon: <Star className="text-primary h-8 w-8" />,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-tertiary-light relative overflow-hidden border-white/20 p-8 py-20 backdrop-blur-sm">
        <div className="relative z-10 container mx-auto px-4">
          <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
            <Image
              src="/images/benefits.png"
              alt="Why Choose Us"
              width={500}
              height={500}
              className="mb-6"
            />
            <h1 className="mb-6 text-4xl font-bold text-white md:text-5xl">
              Why Choose NextDentist?
            </h1>
            <p className="mb-8 text-lg text-white/90">
              Connecting patients and dentists worldwide with trust,
              convenience, and cutting-edge technology.
            </p>
          </div>
        </div>
        <div className="from-primary/90 to-primary/70 absolute inset-0 bg-gradient-to-b" />
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          {/* For Patients */}
          <div className="mb-20">
            <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
              For Patients
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {patientFeatures.map((feature, index) => (
                <Card key={index} className="border-primary/20 bg-white">
                  <CardHeader className="flex flex-row items-center gap-4">
                    {feature.icon}
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* For Dentists */}
          <div>
            <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
              For Dentists
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {dentistFeatures.map((feature, index) => (
                <Card key={index} className="border-primary/20 bg-white">
                  <CardHeader className="flex flex-row items-center gap-4">
                    {feature.icon}
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold text-white">
              Ready to Get Started?
            </h2>
            <p className="mb-8 text-lg text-white/90">
              Join our community today, whether you're seeking care or looking
              to grow your practice.
            </p>
            <div className="flex justify-center gap-4">
              <Button
                size="lg"
                className="text-primary bg-white hover:bg-white/90"
                asChild
              >
                <Link href="/dentists">Find a Dentist</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary text-primary bg-tertiary hover:bg-tertiary/90"
                asChild
              >
                <Link href="/register">For Dentists</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUsPage;

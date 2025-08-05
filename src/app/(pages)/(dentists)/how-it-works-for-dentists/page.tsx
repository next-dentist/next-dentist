import { Metadata } from 'next'; // Import Metadata

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  CheckCircle2,
  ClipboardCheck,
  Search,
  Star,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import React from 'react';

// Add Metadata for the page
export const metadata: Metadata = {
  title: 'How NextDentist Works for Dentists | Grow Your Practice',
  description:
    'Learn how NextDentist helps dentists attract new patients, manage appointments, and grow their practice with a powerful online profile and marketing tools. Discover our step-by-step process.',
  keywords: [
    'NextDentist for dentists',
    'how it works dentists',
    'dental practice growth',
    'dentist marketing platform',
    'online dental booking for dentists',
    'dentist lead generation',
    'dental practice management software',
    'claim dentist profile',
    'dentist directory',
    'dental patient acquisition',
    'dentist online presence',
  ],
};

const HowItWorksForDentists: React.FC = props => {
  const steps = [
    {
      title: 'Step 1: Create Your Profile',
      description:
        'Sign up in minutes with your practice email. Complete your profile with bio, qualifications, services, photos, insurance accepted, and treatment specialties.',
      icon: <ClipboardCheck className="text-primary h-8 w-8" />,
      image: '/images/documents/create-profile.webp',
      seoBenefit:
        'Creates crawlable, unique pages Google indexes for local intent (e.g., "dentist near me" searches).',
    },
    {
      title: 'Step 2: Get Verified',
      description:
        'Our team reviews credentials for quality assurance. Verified badges increase visibility and trust.',
      icon: <CheckCircle2 className="text-primary h-8 w-8" />,
      image: '/images/documents/get-verified.webp',
      seoBenefit:
        'Increases trust signals that align with 2025 search quality expectations.',
    },
    {
      title: 'Step 3: Appear in Searches',
      description:
        'Get discovered in local, treatment-specific, and insurance-filtered searches. Our AI-powered engine recommends your profile based on relevance, location, and patient needs.',
      icon: <Search className="text-primary h-8 w-8" />,
      image: '/images/documents/appear-in-search.webp',
      seoBenefit:
        'Patients see the most relevant professionals, improving satisfaction and conversions.',
    },
    {
      title: 'Step 4: Receive Leads and Appointments',
      description:
        'Patients contact you via secure messages, lead forms, or direct booking (if enabled). Track your leads, responses, and ROI from your dentist dashboard.',
      icon: <Users className="text-primary h-8 w-8" />,
      image: '/images/documents/receive-leads.webp',
      seoBenefit: 'Streamlined patient-to-dentist communication system.',
    },
    {
      title: 'Step 5: Manage and Grow Your Reputation',
      description:
        'Collect and display patient reviews. Respond to reviews to build trust. Showcase treatment outcomes (before/after images, case studies).',
      icon: <Star className="text-primary h-8 w-8" />,
      image: '/images/documents/grow.webp',
      seoBenefit: 'Fresh content and engagement help rankings and credibility.',
    },
  ];

  const features = [
    'Professional Bio & Credentials',
    'Real-Time Appointment Availability',
    'Insurance & Payment Options',
    'Treatment Areas & Conditions Treated',
    'Patient Reviews & Ratings',
    'Google Map Integration for Directions',
    '"Request an Appointment" or "Contact" CTA',
  ];

  const dashboardFeatures = [
    'Real-time analytics: Views, leads, appointments',
    'Profile editor and photo uploader',
    'Lead response tracking',
    'Integration options (e.g., Calendly, practice software)',
    'Billing & subscription management',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-white/20 bg-[#91BCC375] p-8 py-20 backdrop-blur-sm">
        <div className="relative z-10 container mx-auto px-4">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <Image
              src="/images/dentist-group-removebg-preview.png"
              alt="NextDentist Logo"
              width={500}
              height={500}
            />
            <h1 className="mb-6 text-4xl font-bold text-white md:text-5xl">
              Join the Fastest-Growing Dentist Network.
            </h1>
            <p className="mb-8 text-lg text-white/90">
              Connect with patients, grow your practice, and enhance your
              digital presence—all from one powerful platform.
            </p>
            <Button
              size="lg"
              className="text-primary bg-white hover:bg-white/90"
              asChild
            >
              <Link href="/register">Claim Your Free Profile</Link>
            </Button>
          </div>
        </div>
        <div className="from-primary/90 to-primary/70 absolute inset-0 bg-gradient-to-b" />
      </div>

      {/* Steps Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
            Step-by-Step Overview
          </h2>
          <div className="space-y-8">
            {steps.map((step, index) => (
              <Card key={index} className="border-primary/20 bg-white">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Image
                      src={step.image}
                      alt={step.title}
                      width={100}
                      height={100}
                      className="rounded-full"
                    />
                    <CardTitle className="text-xl">{step.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-gray-600">{step.description}</p>
                  <div className="bg-primary/5 rounded-lg p-4">
                    <p className="text-primary text-sm">
                      <strong>Benefit:</strong> {step.seoBenefit}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
              What's Included in Your Profile
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-primary/20 bg-white">
                <CardHeader>
                  <CardTitle>Profile Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle2 className="text-primary h-5 w-5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-primary/20 bg-white">
                <CardHeader>
                  <CardTitle>Dashboard Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {dashboardFeatures.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle2 className="text-primary h-5 w-5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
            What Dentists Are Saying
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-primary/20 bg-white">
              <CardContent className="pt-6">
                <blockquote className="text-lg text-gray-600 italic">
                  "NextDentist doubled our new patient bookings in 3 months."
                </blockquote>
              </CardContent>
            </Card>
            <Card className="border-primary/20 bg-white">
              <CardContent className="pt-6">
                <blockquote className="text-lg text-gray-600 italic">
                  "Finally, a directory that actually understands the business
                  of dentistry."
                </blockquote>
              </CardContent>
            </Card>
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
              It's free to claim your profile. Premium plans offer even more
              exposure.
            </p>
            <Button
              size="lg"
              className="text-primary bg-white hover:bg-white/90"
              asChild
            >
              <Link href="/register">Claim Your Free Profile</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksForDentists;

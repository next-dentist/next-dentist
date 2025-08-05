import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BadgeCheck,
  Eye,
  FileText,
  MessageSquare,
  RefreshCcw,
  ShieldCheck,
} from 'lucide-react';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Verification Process | NextDentist',
  description:
    'Learn how NextDentist rigorously verifies dental professionals through credential checks, license validation, background reviews, and continuous monitoring to keep patients safe.',
  keywords: [
    'NextDentist verification',
    'dentist credential check',
    'license validation',
    'dentist background review',
    'patient safety',
  ],
};

interface Step {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const steps: Step[] = [
  {
    title: 'Credential Submission',
    description:
      'Dentists provide degrees, government ID, active licenses, and proof of current practice or clinic affiliation.',
    icon: FileText,
  },
  {
    title: 'License Verification',
    description:
      'We confirm license status directly with dental boards and check for any disciplinary actions or malpractice claims.',
    icon: BadgeCheck,
  },
  {
    title: 'Background & Practice Check',
    description:
      'Our team reviews professional history, public records, and clinic hygiene standards to ensure ethical practice.',
    icon: ShieldCheck,
  },
  {
    title: 'Profile Review & Approval',
    description:
      'Each profile undergoes manual review for accuracy, clear service descriptions, and professional imagery before going live.',
    icon: Eye,
  },
  {
    title: 'Continuous Monitoring',
    description:
      'We re‑verify licenses annually, audit new feedback, and act swiftly on any reports of misconduct or inaccuracy.',
    icon: RefreshCcw,
  },
  {
    title: 'Patient Feedback Integration',
    description:
      'Patterns of poor or unresolved feedback trigger additional checks or re‑evaluation of the provider’s status.',
    icon: MessageSquare,
  },
];

const VerificationProcessPage: React.FC = (props) => {
  return (
    <div className="bg-background text-foreground container mx-auto flex min-h-screen flex-col">
      {/* Hero */}
      <section className="from-primary/10 to-background bg-gradient-to-b px-4 py-24 text-center">
        <h1 className="mb-4 text-4xl font-bold md:text-5xl">
          Verification Process at NextDentist
        </h1>
        <p className="mx-auto max-w-2xl text-lg md:text-xl">
          Patient trust begins with provider credibility. Here’s how we verify
          every dental professional on our platform.
        </p>
      </section>

      {/* Steps Grid */}
      <section className="container grid grid-cols-1 gap-8 py-16 md:grid-cols-2 lg:grid-cols-3">
        {steps.map(({ title, description, icon: Icon }) => (
          <Card
            key={title}
            className="bg-white/90 shadow-sm backdrop-blur transition-shadow hover:shadow-md supports-[backdrop-filter]:bg-white/60"
          >
            <CardHeader className="flex items-center gap-4">
              <Icon className="text-primary h-8 w-8" />
              <CardTitle className="text-xl leading-tight font-semibold">
                {title}
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

      {/* CTA */}
      <section className="bg-muted/20 px-4 py-24 text-center">
        <h2 className="mb-4 text-3xl font-bold md:text-4xl">
          Transparency You Can Trust
        </h2>
        <p className="mx-auto mb-8 max-w-3xl text-lg md:text-xl">
          Inspired by Dr. Megha Vyas and overseen by Project Manager Mr. Palak
          Bhatt, our verification keeps patients confident and providers
          accountable.
        </p>
        <Button size="lg">Apply to List Your Clinic</Button>
      </section>
    </div>
  );
};

export default VerificationProcessPage;

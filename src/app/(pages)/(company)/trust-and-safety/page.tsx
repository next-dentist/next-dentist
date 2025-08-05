import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BadgeCheck,
  Lock,
  MessageCircle,
  Quote,
  RefreshCcw,
  ShieldCheck,
} from 'lucide-react';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Trust & Safety | NextDentist',
  description:
    "Learn about NextDentist's commitment to trust and safety, including verified professionals, advanced data protection, transparent patient feedback, and responsive support.",
  keywords: [
    'NextDentist trust',
    'dental safety',
    'verified dentists',
    'data privacy dental',
    'patient feedback',
    'secure dental platform',
    'NextDentist security',
    'HIPAA compliant dental',
    'GDPR dental',
  ],
};

interface Section {
  title: string;
  points: string[];
  icon: React.ComponentType<{ className?: string }>;
}

const sections: Section[] = [
  {
    title: 'Verified Professionals You Can Rely On',
    points: [
      'Confirmation of licenses and certifications with relevant boards',
      'Validation of educational qualifications & professional affiliations',
      'Ongoing compliance reviews with local regulations',
      'Continuous monitoring of feedback & clinical performance',
    ],
    icon: BadgeCheck,
  },
  {
    title: 'Advanced Data Protection & Privacy',
    points: [
      'End‑to‑end encrypted messaging',
      'Secure servers with robust access controls',
      'HIPAA & GDPR compliant data handling',
      'Transparent privacy policies & regular security audits',
    ],
    icon: Lock,
  },
  {
    title: 'Transparent Patient Feedback & Review System',
    points: [
      'Honest, constructive reviews from real patients',
      'Direct reporting tools for concerns or suspicious activity',
      'Community‑driven rating system recognizing excellence',
      'Swift investigation of flagged issues by our team',
    ],
    icon: MessageCircle,
  },
  {
    title: 'Proactive Monitoring & Responsive Support',
    points: [
      'Active monitoring for fraudulent or non‑compliant listings',
      'Dedicated assistance for any safety‑related inquiries',
      'Timely, transparent communication during resolution',
    ],
    icon: ShieldCheck,
  },
  {
    title: 'Continuous Improvement & Community Accountability',
    points: [
      'Regular updates to trust & safety protocols',
      'User feedback integrated into system evolution',
      'Education on best practices for safe digital interactions',
    ],
    icon: RefreshCcw,
  },
];

const TrustSafetyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
      {/* Hero */}
      <section className="px-6 py-24 text-center md:px-12 lg:px-24">
        <h1 className="mb-6 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl dark:text-white">
          Trust & Safety at <span className="text-primary">NextDentist</span>
        </h1>
        <p className="mx-auto max-w-3xl text-lg text-slate-600 md:text-xl dark:text-slate-300">
          Your peace of mind is at the heart of everything we do. Discover how
          we create a secure, transparent, and professional environment for
          patients and dental professionals worldwide.
        </p>
      </section>

      {/* Sections */}
      <section className="grid grid-cols-1 gap-8 px-6 py-12 md:grid-cols-2 md:px-12 lg:grid-cols-3 lg:px-24">
        {sections.map(section => (
          <Card
            key={section.title}
            className="border-0 bg-white shadow-md dark:bg-slate-900"
          >
            <CardHeader className="flex flex-row items-center gap-4">
              <section.icon className="text-primary h-8 w-8" />
              <CardTitle>{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc space-y-2 pl-6 text-sm text-slate-600 dark:text-slate-400">
                {section.points.map(point => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Leadership Quote */}
      <section className="bg-primary/5 dark:bg-primary/10 px-6 py-12 text-center md:px-12 lg:px-24">
        <div className="mx-auto max-w-3xl">
          <Quote className="text-primary mx-auto mb-4 h-10 w-10" />
          <p className="text-xl font-medium text-slate-800 italic md:text-2xl dark:text-slate-200">
            “Building trust isn't optional—it's foundational. Your safety is our
            responsibility.”
          </p>
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            — <span className="font-semibold">Dr. Megha Vyas</span>, Director &
            Oral & Maxillofacial Surgery Specialist
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="flex flex-col items-center gap-6 px-6 py-16 text-center md:px-12 lg:px-24">
        <h2 className="text-3xl font-semibold text-slate-900 md:text-4xl dark:text-white">
          Ready to experience trusted dental care?
        </h2>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button size="lg">Explore Verified Dentists</Button>
          <Button variant="outline" size="lg">
            Contact Trust & Safety Team
          </Button>
        </div>
      </section>
    </div>
  );
};

export default TrustSafetyPage;

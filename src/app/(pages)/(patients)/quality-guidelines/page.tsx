import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BadgeCheck,
  FlaskConical,
  Globe,
  HeartHandshake,
  Info,
  MessageSquare,
  ShieldAlert,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Quality & Safety Guidelines | NextDentist',
  description:
    'Learn about the rigorous quality guidelines at NextDentist. We ensure all listed dentists are verified, maintain high standards of care, and are committed to patient safety.',
  keywords: [
    'dental quality guidelines',
    'patient safety',
    'verified dentists',
    'dental standards',
    'trusted dentists',
    'dental clinic quality',
  ],
};

interface Guideline {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const guidelines: Guideline[] = [
  {
    title: 'Patient‑Centric Care',
    description:
      'All listed dental professionals must prioritize patient well‑being, comfort, and safety. Compassionate communication, ethical treatment, and transparent care are essential.',
    icon: HeartHandshake,
  },
  {
    title: 'Verified Credentials',
    description:
      'Every dentist on our platform provides verified degrees, certifications, and licenses. Regular updates ensure a continuously qualified network.',
    icon: BadgeCheck,
  },
  {
    title: 'Clean, Safe & Modern Facilities',
    description:
      'Clinics must uphold stringent hygiene, maintain well‑equipped spaces, and visibly follow infection‑control protocols in line with local regulations.',
    icon: ShieldCheck,
  },
  {
    title: 'Up‑to‑Date Practices',
    description:
      'We encourage ongoing education and the adoption of modern techniques and technologies for evidence‑based, continuously improving care.',
    icon: FlaskConical,
  },
  {
    title: 'Transparent Information',
    description:
      'Clinic profiles present accurate services, pricing ranges, languages, and hours so patients can make informed decisions with confidence.',
    icon: Info,
  },
  {
    title: 'Responsiveness & Professionalism',
    description:
      'Timely replies to appointments, inquiries, and reviews demonstrate the professionalism we uphold across the platform.',
    icon: MessageSquare,
  },
  {
    title: 'Inclusive & Accessible Care',
    description:
      'We champion equitable treatment regardless of background or ability. Clinics should offer cultural sensitivity and accommodations for special needs.',
    icon: Globe,
  },
  {
    title: 'Community Feedback Standards',
    description:
      'Honest patient reviews maintain high standards. Professionals respond constructively to praise and concerns alike.',
    icon: Star,
  },
  {
    title: 'Compliance & Monitoring',
    description:
      'Our team routinely monitors listings for adherence. Violations may lead to warnings, temporary suspensions, or removal.',
    icon: ShieldAlert,
  },
];

const QualityGuidelinesPage: React.FC = props => {
  return (
    <div className="bg-background text-foreground container mx-auto flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="from-primary/10 to-background bg-gradient-to-b px-4 py-24 text-center">
        <h1 className="mb-4 text-4xl font-bold md:text-5xl">
          NextDentist Quality Guidelines
        </h1>
        <p className="mx-auto max-w-2xl text-lg md:text-xl">
          Connecting patients with trusted, high‑quality dental care
          professionals around the world.
        </p>
      </section>

      {/* Guidelines Grid */}
      <section className="container grid grid-cols-1 gap-8 py-16 md:grid-cols-2 lg:grid-cols-3">
        {guidelines.map(({ title, description, icon: Icon }) => (
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

      {/* CTA Section */}
      <section className="bg-muted/20 px-4 py-24 text-center">
        <h2 className="mb-4 text-3xl font-bold md:text-4xl">
          Commitment to Continuous Improvement
        </h2>
        <p className="mx-auto mb-8 max-w-3xl text-lg md:text-xl">
          Inspired by Dr. Megha Vyas, Oral & Maxillofacial Surgery Specialist,
          and guided by Project Manager Mr. Palak Bhatt, we evolve to meet the
          needs of patients and dental professionals alike.
        </p>
        <Button size="lg">List Your Clinic</Button>
      </section>
    </div>
  );
};

export default QualityGuidelinesPage;

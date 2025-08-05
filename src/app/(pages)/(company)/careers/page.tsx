import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ClipboardList,
  Code,
  Headphones,
  HeartPulse,
  Rocket,
  Search,
  Users,
} from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

export const metadata: Metadata = {
  title: 'Careers at NextDentist | Join Our Team',
  description:
    'Explore exciting career opportunities at NextDentist. Join a mission‑driven team transforming global dental care through technology and innovation.',
  keywords: [
    'NextDentist careers',
    'dental tech jobs',
    'healthcare startup jobs',
    'SEO specialist jobs',
    'software engineer dental',
    'product manager healthcare',
  ],
};

interface Role {
  title: string;
  location: string;
  type: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  link: string;
}

const roles: Role[] = [
  {
    title: 'Full‑Stack Developer (Next.js)',
    location: 'Remote / Vadodara, IN',
    type: 'Full‑Time',
    description:
      'Build performant web experiences that connect patients with dentists worldwide. Experience with Next.js, Prisma, and TailwindCSS preferred.',
    icon: Code,
    link: 'mailto:connect@nextdentist.com?subject=Application%20for%20Full‑Stack%20Developer%20(Next.js)',
  },
  {
    title: 'SEO Specialist – Healthcare',
    location: 'Remote',
    type: 'Contract',
    description:
      'Drive organic growth through innovative search strategies tailored to dental practices across global markets.',
    icon: Search,
    link: 'mailto:connect@nextdentist.com?subject=Application%20for%20SEO%20Specialist%20–%20Healthcare',
  },
  {
    title: 'Product Manager',
    location: 'Hybrid / Ahmedabad, IN',
    type: 'Full‑Time',
    description:
      'Own roadmap execution, align cross‑functional teams, and champion user‑centric features that elevate patient experience.',
    icon: ClipboardList,
    link: 'mailto:connect@nextdentist.com?subject=Application%20for%20Product%20Manager',
  },
  {
    title: 'Customer Success Lead',
    location: 'Remote',
    type: 'Full‑Time',
    description:
      'Guide clinics to success on NextDentist, ensuring adoption, satisfaction, and long‑term relationships.',
    icon: Headphones,
    link: 'mailto:connect@nextdentist.com?subject=Application%20for%20Customer%20Success%20Lead',
  },
];

interface Value {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  link: string;
}

const values: Value[] = [
  {
    title: 'Mission‑Driven Impact',
    description:
      'Improve access to quality dental care for millions by bridging technology and healthcare.',
    icon: Rocket,
    link: 'mailto:connect@nextdentist.com?subject=Application%20for%20Mission‑Driven%20Impact',
  },
  {
    title: 'Collaborative Culture',
    description:
      'Work alongside passionate innovators who value transparency, humility, and growth.',
    icon: Users,
    link: 'mailto:connect@nextdentist.com?subject=Application%20for%20Collaborative%20Culture',
  },
  {
    title: 'Well‑Being & Growth',
    description:
      'Comprehensive benefits, flexible schedules, and generous learning budgets keep you healthy and evolving.',
    icon: HeartPulse,
    link: 'mailto:connect@nextdentist.com?subject=Application%20for%20Well‑Being%20&%20Growth',
  },
];

const CareersPage: React.FC = props => {
  return (
    <div className="bg-background text-foreground container mx-auto flex min-h-screen flex-col">
      {/* Hero */}
      <section className="from-primary/10 to-background bg-gradient-to-b px-4 py-24 text-center">
        <h1 className="mb-4 text-4xl font-bold md:text-5xl">Grow With Us</h1>
        <p className="mx-auto max-w-2xl text-lg md:text-xl">
          Join a global team transforming how patients discover quality dental
          care.
        </p>
        <Button size="lg" className="mt-8" asChild>
          <a href="#open-roles">Explore Open Roles</a>
        </Button>
      </section>

      {/* Open Roles */}
      <section
        id="open-roles"
        className="container grid grid-cols-1 gap-8 py-16 md:grid-cols-2 lg:grid-cols-3"
      >
        {roles.map(
          ({ title, location, type, description, icon: Icon, link }) => (
            <Card
              key={title}
              className="bg-white/90 shadow-sm backdrop-blur transition-shadow hover:shadow-md supports-[backdrop-filter]:bg-white/60"
            >
              <CardHeader className="flex items-start gap-4">
                <Icon className="text-primary h-8 w-8" />
                <div>
                  <CardTitle className="text-xl leading-tight font-semibold">
                    {title}
                  </CardTitle>
                  <p className="text-muted-foreground text-sm">
                    {location} · {type}
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {description}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 w-full"
                  asChild
                >
                  <Link href={link} target="_blank">
                    Apply Now
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )
        )}
      </section>

      {/* Why Work With Us */}
      <section className="bg-muted/20 px-4 py-24 text-center">
        <h2 className="mb-4 text-3xl font-bold md:text-4xl">
          Why NextDentist?
        </h2>
        <p className="mx-auto mb-12 max-w-3xl text-lg md:text-xl">
          We believe great ideas thrive in an environment that celebrates
          curiosity, empathy, and continuous improvement.
        </p>
        <div className="container grid grid-cols-1 gap-8 md:grid-cols-3">
          {values.map(({ title, description, icon: Icon, link }) => (
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
                <Link
                  href={link}
                  className="text-muted-foreground text-sm leading-relaxed"
                >
                  {description}
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CareersPage;

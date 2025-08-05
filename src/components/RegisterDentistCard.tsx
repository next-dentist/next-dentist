'use client';

import { Button } from '@/components/ui/button';
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { MapPin, Plus, Stethoscope, Users } from 'lucide-react';
import Link from 'next/link';

interface RegisterDentistCardProps {
  city?: string;
}

const RegisterDentistCard: React.FC<RegisterDentistCardProps> = ({ city }) => {
  return (
    <div className="border-primary/20 from-primary/5 to-secondary/10 w-full rounded-4xl border-2 border-dashed bg-gradient-to-br py-6 shadow-sm">
      <CardHeader className="text-center">
        <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <Stethoscope className="text-primary h-8 w-8" />
        </div>
        <CardTitle className="text-foreground text-xl font-bold">
          No Dentists Found in {city || 'This Area'}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Be the first dentist to serve patients in this location!
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="bg-secondary/20 flex h-8 w-8 items-center justify-center rounded-full">
              <MapPin className="text-secondary h-4 w-4" />
            </div>
            <span className="text-foreground text-sm">
              Expand your practice to underserved areas
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="bg-tertiary/20 flex h-8 w-8 items-center justify-center rounded-full">
              <Users className="text-tertiary h-4 w-4" />
            </div>
            <span className="text-foreground text-sm">
              Connect with patients looking for dental care
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="bg-accent/20 flex h-8 w-8 items-center justify-center rounded-full">
              <Plus className="text-accent-foreground h-4 w-4" />
            </div>
            <span className="text-foreground text-sm">
              Join our growing network of dental professionals
            </span>
          </div>
        </div>

        <div className="border-border bg-card rounded-lg border p-3">
          <h4 className="text-card-foreground mb-1 font-semibold">
            Why Join Our Network?
          </h4>
          <ul className="text-muted-foreground space-y-1 text-sm">
            <li>• Increased patient visibility</li>
            <li>• Online appointment booking system</li>
            <li>• Professional profile showcase</li>
            <li>• No upfront costs</li>
          </ul>
        </div>

        <div className="flex flex-col gap-2">
          <Button asChild className="bg-primary hover:bg-primary/90 w-full">
            <Link href="/dentists/add">Register as a Dentist</Link>
          </Button>

          <Button variant="outline" asChild className="w-full">
            <Link href="/contact">Learn More</Link>
          </Button>
        </div>

        <div className="text-center">
          <p className="text-muted-foreground text-xs">
            Already registered?{' '}
            <Link
              href="/dentist/login"
              className="text-primary hover:underline"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </CardContent>
    </div>
  );
};

export default RegisterDentistCard;

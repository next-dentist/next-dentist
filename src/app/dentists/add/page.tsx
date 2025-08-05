'use client';

import AddDentistForm from '@/components/AddDentistForm';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ArrowRight,
  Calendar,
  CheckCircle,
  Clock,
  Shield,
  Star,
  Stethoscope,
  TrendingUp,
  Users,
} from 'lucide-react';
import Link from 'next/link';

export default function AddDentist() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Join Our Network of Trusted Dentists
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Expand your practice and connect with patients in your area
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left side - Form */}
          <div className="lg:col-span-2">
            <AddDentistForm />
          </div>

          {/* Right side - Info Panel */}
          <div className="space-y-6">
            {/* Why Join Card */}
            <Card className="">
              <CardHeader>
                <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                  <Stethoscope className="text-primary h-6 w-6" />
                </div>
                <CardTitle className="text-center text-lg font-bold">
                  Why Join Our Network?
                </CardTitle>
                <CardDescription className="text-center">
                  Grow your practice with our comprehensive platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                      <Users className="text-primary h-4 w-4" />
                    </div>
                    <span className="text-sm text-gray-700">
                      Connect with 10,000+ active patients
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                      <Calendar className="text-primary h-4 w-4" />
                    </div>
                    <span className="text-sm text-gray-700">
                      Online appointment booking system
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                      <TrendingUp className="text-primary h-4 w-4" />
                    </div>
                    <span className="text-sm text-gray-700">
                      Increase practice revenue by 30%
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                      <Star className="text-primary h-4 w-4" />
                    </div>
                    <span className="text-sm text-gray-700">
                      Professional profile & reviews
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Platform Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Shield className="text-primary mr-2 h-5 w-5" />
                  Platform Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">Verified Profiles</p>
                      <p className="text-xs text-gray-500">
                        Build trust with verified credentials
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">Smart Scheduling</p>
                      <p className="text-xs text-gray-500">
                        AI-powered appointment optimization
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">Analytics Dashboard</p>
                      <p className="text-xs text-gray-500">
                        Track performance and patient insights
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">Marketing Tools</p>
                      <p className="text-xs text-gray-500">
                        Automated patient communication
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="gradient-bg">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">2,500+</div>
                    <div className="text-sm opacity-90">Active Dentists</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">50K+</div>
                    <div className="text-sm opacity-90">Appointments</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">4.8⭐</div>
                    <div className="text-sm opacity-90">Avg Rating</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">24/7</div>
                    <div className="text-sm opacity-90">Support</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Getting Started Steps */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Clock className="text-primary mr-2 h-5 w-5" />
                  Getting Started
                </CardTitle>
                <CardDescription>
                  Complete setup in 3 simple steps
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white">
                      1
                    </div>
                    <span className="text-sm">Fill out registration form</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white">
                      2
                    </div>
                    <span className="text-sm">Verify your credentials</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white">
                      3
                    </div>
                    <span className="text-sm">
                      Start receiving appointments
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Support */}
            <Card className="border-primary/20 border-2 border-dashed">
              <CardContent className="p-6 text-center">
                <h4 className="mb-2 font-semibold">Need Help?</h4>
                <p className="mb-4 text-sm text-gray-600">
                  Our team is here to support you every step of the way
                </p>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/contact" className="flex items-center">
                    Contact Support
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

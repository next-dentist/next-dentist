'use client';

import {
  BarChart3,
  Calendar,
  Check,
  Cloud,
  Crown,
  Globe,
  Shield,
  Smartphone,
  Star,
  Users,
} from 'lucide-react';
import React from 'react';

const PricingTables: React.FC = () => {
  const plans = [
    {
      name: 'Starter',
      subtitle: 'Perfect for small practices',
      icon: <Users className="h-8 w-8" />,
      yearlyPrice: 49,
      popular: false,
      gradient: 'from-[#92b5b9]/10 to-[#356574]/10',
      features: [
        { text: '1 Dentist', included: true },
        { text: 'Basic appointment booking', included: true },
        { text: 'Email notifications', included: true },
        { text: 'Whatsapp notifications', included: true },
        { text: 'Basic reports', included: true },
        { text: 'Email support', included: true },
      ],
    },
    {
      name: 'Advance',
      subtitle: 'Best for growing practices',
      icon: <Star className="h-8 w-8" />,
      yearlyPrice: 99,
      popular: true,
      gradient: 'from-[#df9d7c]/10 to-[#356574]/10',
      features: [
        { text: 'Up to 5 dentists', included: true },
        { text: 'Advanced appointment system', included: true },
        { text: 'Email notifications', included: true },
        { text: 'Whatsapp notifications', included: true },
        { text: 'Basic reports', included: true },
        { text: 'Email support', included: true },
      ],
    },
    {
      name: 'Pro',
      subtitle: 'For large dental enterprises',
      icon: <Crown className="h-8 w-8" />,
      yearlyPrice: 199,
      popular: false,
      gradient: 'from-[#356574]/10 to-[#df9d7c]/10',
      features: [
        { text: 'Unlimited dentists', included: true },
        { text: 'Email notifications', included: true },
        { text: 'Whatsapp notifications', included: true },
        { text: 'Basic reports', included: true },
        { text: 'Email support', included: true },
        { text: 'Whatsapp support', included: true },
      ],
    },
  ];

  const additionalFeatures = [
    {
      icon: <Calendar className="h-5 w-5" />,
      text: 'Smart scheduling & reminders',
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      text: 'Revenue tracking & analytics',
    },
    { icon: <Shield className="h-5 w-5" />, text: 'HIPAA compliant security' },
    { icon: <Smartphone className="h-5 w-5" />, text: 'Mobile-first design' },
    { icon: <Cloud className="h-5 w-5" />, text: 'Automatic cloud backup' },
    { icon: <Globe className="h-5 w-5" />, text: 'Multi-location support' },
  ];

  return (
    <div className="bg-background py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-16 text-center">
          <h1 className="text-primary mb-4 text-5xl font-bold">
            Choose Your Plan
          </h1>
          <p className="text-muted-foreground mx-auto mb-8 max-w-3xl text-xl">
            Streamline your dental practice with our comprehensive management
            system. Choose the plan that fits your practice size and needs.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="mb-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`border-border bg-card relative rounded-4xl border p-8 transition-all duration-300 hover:shadow-xl ${
                plan.popular
                  ? 'ring-secondary scale-105 ring-2'
                  : 'hover:scale-102'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform">
                  <div className="bg-secondary text-secondary-foreground rounded-full px-6 py-2 text-sm font-semibold">
                    Most Popular
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-8 text-center">
                <div
                  className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${plan.gradient}`}
                >
                  <div className="text-primary">{plan.icon}</div>
                </div>
                <h3 className="text-primary mb-2 text-2xl font-bold">
                  {plan.name}
                </h3>
                <p className="text-muted-foreground mb-6">{plan.subtitle}</p>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline justify-center">
                    <span className="text-primary text-4xl font-bold">
                      ${plan.yearlyPrice}
                    </span>
                    <span className="text-muted-foreground ml-2">/year</span>
                  </div>
                  <p className="text-muted-foreground mt-2 text-sm">
                    ${Math.round(plan.yearlyPrice / 12)}/month billed annually
                  </p>
                </div>

                {/* CTA Button */}
                <button
                  className={`w-full rounded-full px-6 py-4 font-semibold transition-all duration-300 ${
                    plan.popular
                      ? 'bg-secondary text-secondary-foreground hover:bg-secondary/90 hover:scale-105'
                      : 'border-primary text-primary hover:bg-primary hover:text-primary-foreground border-2'
                  }`}
                >
                  Get Started
                </button>
              </div>

              {/* Features List */}
              <div className="space-y-4">
                <h4 className="text-primary mb-4 font-semibold">
                  Everything included:
                </h4>
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center gap-3">
                    <div
                      className={`flex-shrink-0 ${
                        feature.included ? 'text-secondary' : 'text-muted/30'
                      }`}
                    >
                      <Check className="h-5 w-5" />
                    </div>
                    <span
                      className={`text-sm ${
                        feature.included
                          ? 'text-foreground'
                          : 'text-muted-foreground/60 line-through'
                      }`}
                    >
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Features Section */}
        <div className="border-border bg-card rounded-4xl border p-8 text-center">
          <h3 className="text-primary mb-6 text-2xl font-bold">
            Why Choose Our Platform?
          </h3>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
            {additionalFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="text-primary flex-shrink-0">{feature.icon}</div>
                <span className="text-foreground text-sm font-medium">
                  {feature.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ or Contact Section */}
        <div className="mt-16 text-center">
          <h3 className="mb-4 text-2xl font-bold text-[#356574]">
            Need a Custom Plan?
          </h3>
          <p className="mx-auto mb-6 max-w-2xl text-[#92b5b9]">
            Contact our sales team for enterprise solutions, custom
            integrations, or if you have specific requirements for your dental
            practice.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="rounded-full bg-[#356574] px-8 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-[#356574]/90">
              Contact Sales
            </button>
            <button className="rounded-full border-2 border-[#356574] px-8 py-3 font-semibold text-[#356574] transition-all duration-300 hover:bg-[#356574] hover:text-white">
              Schedule Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingTables;

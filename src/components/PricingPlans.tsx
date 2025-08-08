import SEOAnalysisForm from '@/components/SEOAnalysisForm';
import { BarChart3, Building, Check, Rocket } from 'lucide-react';
import { useState } from 'react';

const pricingPlans = [
  {
    title: 'Essential',
    icon: Rocket,
    price: '13,299',
    oldPrice: '15,999',
    saveAmount: '2,700',
    description: 'Perfect for new dental practices looking to establish online presence.',
    features: [
      'Website SEO Audit & Optimization',
      'Google My Business Setup & Optimization',
      'Local SEO for 1 Location',
      'Basic Keyword Research (25 keywords)',
      'On-Page SEO (5 pages)',
      'Monthly Progress Reports',
      'Social Media Profile Setup',
      'Citation Building (10 directories)',
    ],
    keyBenefits: [
      'Improved local search visibility',
      'Professional online presence',
      'Basic analytics tracking',
    ],
    popular: false,
  },
  {
    title: 'Professional',
    icon: BarChart3,
    price: '27,299',
    oldPrice: '32,999',
    saveAmount: '5,700',
    description: 'Comprehensive SEO solution for established practices seeking growth.',
    features: [
      'Everything in Essential Plan',
      'Advanced Keyword Research (50 keywords)',
      'Content Marketing (4 blog posts/month)',
      'Local SEO for up to 3 Locations',
      'On-Page SEO (15 pages)',
      'Competitor Analysis',
      'Google Ads Setup & Management',
      'Review Management System',
      'Advanced Analytics & Conversion Tracking',
      'Social Media Management (2 platforms)',
      'Citation Building (25 directories)',
      'Schema Markup Implementation',
    ],
    keyBenefits: [
      'Increased patient appointments',
      'Higher search engine rankings',
      'Professional content creation',
    ],
    popular: true,
  },
  {
    title: 'Enterprise',
    icon: Building,
    price: '49,399',
    oldPrice: '59,999',
    saveAmount: '10,600',
    description: 'Premium solution for multi-location practices and dental chains.',
    features: [
      'Everything in Professional Plan',
      'Premium Keyword Research (100+ keywords)',
      'Content Marketing (8 blog posts/month)',
      'Local SEO for Unlimited Locations',
      'On-Page SEO (Unlimited pages)',
      'Advanced Competitor Intelligence',
      'Multi-Platform Ads Management',
      'Reputation Management Suite',
      'Custom Landing Pages',
      'Advanced Conversion Optimization',
      'Full Social Media Management (5 platforms)',
      'Premium Citation Building (50+ directories)',
      'Technical SEO Audits',
      'Priority Support & Consultation',
    ],
    keyBenefits: [
      'Maximum ROI and growth',
      'Multi-location dominance',
      'Dedicated account manager',
    ],
    popular: false,
  },
];

export default function PricingPlans() {
  const [expanded, setExpanded] = useState([false, false, false]);

  const toggleExpand = (idx: number) => {
    setExpanded((prev) => prev.map((v, i) => (i === idx ? !v : v)));
  };

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Choose Your Growth Plan</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Transparent pricing with no hidden fees. Select the perfect SEO package to accelerate your dental practice's success.
          </p>
        </div>
        <div className="grid lg:grid-cols-3 gap-8 items-stretch">
          {pricingPlans.map((plan, idx) => (
            <div
              key={plan.title}
              className={`relative flex flex-col rounded-3xl border-2 p-8 transition-all duration-500 hover:scale-105 ${
                plan.popular
                  ? 'border-primary shadow-2xl shadow-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5'
                  : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                  <div className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-1 text-sm font-bold rounded-full shadow-lg">
                    Most Popular
                  </div>
                </div>
              )}
                             <div className="text-center">
                 <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-6">
                   <plan.icon className="w-8 h-8 text-white" />
                 </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{plan.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">{plan.description}</p>
                <div className="mb-8">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-6xl font-black text-gray-900 dark:text-white">₹{plan.price}</span>
                    <span className="text-xl text-gray-500 dark:text-gray-400">/mo</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <span className="text-lg line-through text-gray-400 dark:text-gray-500">₹{plan.oldPrice}</span>
                    <span className="text-sm bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-3 py-1 rounded-full font-semibold">
                      Save ₹{plan.saveAmount}
                    </span>
                  </div>
                </div>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                {(expanded[idx] ? plan.features : plan.features.slice(0, 5)).map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
                {plan.features.length > 5 && (
                  <li className="flex items-center gap-3">
                    <button
                      className="text-primary font-semibold underline hover:text-secondary transition-colors"
                      onClick={() => toggleExpand(idx)}
                      type="button"
                    >
                      {expanded[idx] ? 'Show Less' : `Show More (${plan.features.length - 5} more)`}
                    </button>
                  </li>
                )}
              </ul>
              <div className="mb-6">
                <div className="font-semibold text-gray-900 dark:text-white mb-2">Key Benefits:</div>
                <ul className="space-y-2">
                  {plan.keyBenefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-2">
                      <span className="text-yellow-500">⚡</span>
                      <span className="text-gray-700 dark:text-gray-200">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
                             <SEOAnalysisForm
                 buttonText="Get Started Now"
                 buttonClassName={`w-full mt-auto group inline-flex items-center justify-center rounded-xl px-8 py-4 text-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl ${
                   plan.popular
                     ? 'bg-gradient-to-r from-primary to-secondary text-white hover:scale-105'
                     : 'bg-gray-100 dark:bg-gray-800 text-primary hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-105'
                 }`}
                 dialogDescription={`Get started with the ${plan.title} plan. Our team will contact you to discuss your specific needs and create a customized SEO strategy for your dental practice.`}
               />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
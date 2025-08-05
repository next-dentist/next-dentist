'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { Globe, Mail, Stethoscope, User } from 'lucide-react';

const faqContent = {
  patients: [
    {
      question: 'What is NextDentist?',
      answer:
        'NextDentist is an all-in-one platform that helps you find, compare, and book appointments with verified dental professionals worldwide.',
    },
    {
      question: 'Is it free to use NextDentist?',
      answer:
        'Yes, using NextDentist to search for clinics, read reviews, and book appointments is completely free for patients.',
    },
    {
      question: 'How do I find a dentist near me?',
      answer:
        'Simply enter your location and the type of dental service you need in the search bar. You can filter results by specialty, language, availability, insurance, and more.',
    },
    {
      question: 'How are dentists verified?',
      answer:
        'We use a rigorous verification process, including credential checks, license validation, and regular compliance reviews. Read our full Verification Process section for more details.',
    },
    {
      question: 'Can I book appointments online?',
      answer:
        "Absolutely. Choose your preferred time slot, and you'll receive instant confirmation and reminders through your NextDentist account.",
    },
    {
      question: 'What if I need to cancel or reschedule?',
      answer:
        "You can cancel or reschedule appointments directly from your dashboard, subject to the clinic's cancellation policy.",
    },
    {
      question: 'How are my personal details protected?',
      answer:
        'We use encrypted data storage, secure communication, and full compliance with privacy laws (HIPAA, GDPR) to protect your information.',
    },
    {
      question: 'Can I leave a review?',
      answer:
        'Yes! After your visit, we encourage you to leave honest feedback. Your review helps other patients and supports high-quality care.',
    },
  ],
  professionals: [
    {
      question: 'How can I join NextDentist?',
      answer:
        'Click on the "Join as a Dentist" button, complete the profile form, and submit your credentials for verification.',
    },
    {
      question: 'What documents are required for verification?',
      answer:
        "You'll need to provide your dental license, government ID, degrees/certifications, and practice affiliation details.",
    },
    {
      question: 'How long does verification take?',
      answer:
        "Typically, our team completes verification within 3–5 business days. We'll notify you once your profile is approved.",
    },
    {
      question: 'Is there a fee to list my clinic?',
      answer:
        'Basic listings are free. We also offer premium plans with added visibility, patient lead tools, and analytics. Contact our team for pricing.',
    },
    {
      question: 'How do I manage appointments and patient communication?',
      answer:
        "You'll have access to a professional dashboard to manage schedules, update availability, respond to patient inquiries, and track reviews.",
    },
    {
      question: 'Can I update my profile after joining?',
      answer:
        'Yes, you can update services, pricing, hours, and contact info at any time from your dashboard.',
    },
    {
      question: 'How does the review system work?',
      answer:
        'Patients can rate and review after visits. Constructive feedback helps improve service, and we encourage respectful engagement with reviews.',
    },
    {
      question: 'What if I face an issue with a listing or patient?',
      answer:
        'Our Trust & Safety team is here to help. You can report issues through your account or contact our support team directly.',
    },
  ],
  general: [
    {
      question: 'What countries does NextDentist serve?',
      answer:
        'We support listings and bookings in multiple countries and are continually expanding. Use the platform to check availability in your region.',
    },
    {
      question: 'How do I contact NextDentist support?',
      answer:
        'Email us at connect@nextdentist.com, or use the chat support feature available on our website and mobile app.',
    },
    {
      question: 'Is NextDentist affiliated with dental boards or associations?',
      answer:
        'While we verify credentials with dental boards, we operate independently. Our goal is to provide a trusted, unbiased platform for both patients and providers.',
    },
    {
      question: 'Can clinics list multiple dentists?',
      answer:
        'Yes. Clinics can add multiple verified practitioners under a single listing and manage them via a unified dashboard.',
    },
  ],
};

export function FAQContent() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center"
      >
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900">
          Frequently Asked Questions
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600">
          Welcome to the NextDentist FAQ page! Here you'll find answers to the
          most commonly asked questions by patients and dental professionals.
        </p>
        <Separator className="mx-auto mt-6 h-1 w-24 bg-blue-500" />
      </motion.div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-1">
        {/* For Patients */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="shadow-lg">
            <CardHeader className="flex items-center space-x-3 rounded-t-lg border-b border-blue-100 bg-blue-50 p-6">
              <User className="h-6 w-6 text-blue-600" />
              <CardTitle className="text-xl font-bold text-blue-800">
                For Patients
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <Accordion type="single" collapsible className="w-full">
                {faqContent.patients.map((item, index) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger className="text-left font-semibold hover:no-underline">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="leading-relaxed text-gray-700">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </motion.div>

        {/* For Dental Professionals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="shadow-lg">
            <CardHeader className="flex items-center space-x-3 rounded-t-lg border-b border-green-100 bg-green-50 p-6">
              <Stethoscope className="h-6 w-6 text-green-600" />
              <CardTitle className="text-xl font-bold text-green-800">
                For Dental Professionals
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <Accordion type="single" collapsible className="w-full">
                {faqContent.professionals.map((item, index) => (
                  <AccordionItem
                    value={`professional-item-${index}`}
                    key={index}
                  >
                    <AccordionTrigger className="text-left font-semibold hover:no-underline">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="leading-relaxed text-gray-700">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </motion.div>

        {/* General Questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="shadow-lg">
            <CardHeader className="flex items-center space-x-3 rounded-t-lg border-b border-purple-100 bg-purple-50 p-6">
              <Globe className="h-6 w-6 text-purple-600" />
              <CardTitle className="text-xl font-bold text-purple-800">
                General Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <Accordion type="single" collapsible className="w-full">
                {faqContent.general.map((item, index) => (
                  <AccordionItem value={`general-item-${index}`} key={index}>
                    <AccordionTrigger className="text-left font-semibold hover:no-underline">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="leading-relaxed text-gray-700">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-12 rounded-lg bg-blue-50 p-6 text-center shadow-inner"
      >
        <h2 className="mb-3 text-2xl font-bold text-gray-800">
          Still have questions?
        </h2>
        <p className="text-md mb-4 text-gray-700">
          Reach out to us any time—we're here to help you smile with confidence.
        </p>
        <a
          href="mailto:connect@nextdentist.com"
          className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
        >
          <Mail className="mr-2 h-5 w-5" />
          Contact Support
        </a>
      </motion.div>
    </>
  );
}

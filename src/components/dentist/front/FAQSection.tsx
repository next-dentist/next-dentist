'use client';

import { CheckCircle, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { DentistWithRelations, FaqItem } from './types';

interface FAQSectionProps {
  dentist: DentistWithRelations;
  title?: string;
  subtitle?: string;
  className?: string;
}

export const FAQSection: React.FC<FAQSectionProps> = ({
  dentist,
  title = 'Frequently Asked Questions',
  subtitle = 'Common questions about our dental services and procedures',
  className = '',
}) => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Extract FAQs from dentist data
  const dentistFaqs = (
    dentist?.faq && Array.isArray(dentist.faq) ? dentist.faq : []
  ) as FaqItem[];

  // Transform FAQs for accordion display
  const faqsForAccordion = dentistFaqs.map((faq, index) => ({
    id: index.toString(),
    question: faq.question,
    answer: faq.answer,
  }));

  // Handle FAQ toggle
  const handleFaqToggle = (index: number | null) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  // Don't render if no FAQs available
  if (faqsForAccordion.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header Section */}
      <div className="text-center">
        <h2 className="mb-4 text-4xl font-bold text-[#356574]">{title}</h2>
        <p className="mx-auto max-w-3xl text-xl text-[#92b5b9]">{subtitle}</p>
      </div>

      {/* FAQs */}
      <div className="mx-auto max-w-4xl">
        <div className="space-y-4">
          <h3 className="mb-6 flex items-center justify-center text-2xl font-bold text-[#356574]">
            <CheckCircle className="mr-3 h-6 w-6 text-[#df9d7c]" />
            Questions About {dentist?.name || 'Our Services'}
          </h3>

          <div className="space-y-4">
            {faqsForAccordion.map((item, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-xl border border-[#92b5b9]/20 bg-white shadow-sm transition-all duration-300 hover:shadow-md"
              >
                <button
                  onClick={() => handleFaqToggle(index)}
                  className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-[#fffbf8]"
                >
                  <h4 className="pr-4 text-lg font-semibold text-[#356574]">
                    {item.question}
                  </h4>
                  <ChevronDown
                    className={`h-5 w-5 flex-shrink-0 text-[#df9d7c] transition-transform duration-300 ${
                      expandedFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    expandedFaq === index
                      ? 'max-h-96 opacity-100'
                      : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 pb-6">
                    <div className="mb-4 h-px w-full bg-[#92b5b9]/20"></div>
                    <p className="leading-relaxed whitespace-pre-wrap text-[#92b5b9]">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-8 rounded-xl bg-gradient-to-r from-[#df9d7c]/10 to-[#356574]/10 p-6 text-center">
          <h4 className="mb-2 text-xl font-semibold text-[#356574]">
            Still Have Questions?
          </h4>
          <p className="mb-4 text-[#92b5b9]">
            Can't find the answer you're looking for? Please don't hesitate to
            reach out to us.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {dentist?.phone && (
              <button
                onClick={() => (window.location.href = `tel:${dentist.phone}`)}
                className="rounded-full bg-[#356574] px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-[#356574]/90"
              >
                Call Us: {dentist.phone}
              </button>
            )}
            {dentist?.email && (
              <button
                onClick={() =>
                  (window.location.href = `mailto:${dentist.email}`)
                }
                className="rounded-full border-2 border-[#356574] px-6 py-3 font-semibold text-[#356574] transition-all duration-300 hover:bg-[#356574] hover:text-white"
              >
                Email Us
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

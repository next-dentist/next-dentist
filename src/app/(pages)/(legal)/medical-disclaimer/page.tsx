import React from 'react';

const MedicalDisclaimer: React.FC = () => {
  return (
    <main className="min-h-screen bg-[#f4f8f8]">
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 md:py-14">
        <h1 className="mb-6 text-3xl font-bold text-[#356574] sm:text-4xl md:text-5xl">
          Medical Disclaimer
        </h1>
        <article className="space-y-6 text-base leading-relaxed text-gray-700 sm:text-lg">
          <p>
            The content on NextDentist, including text, graphics, images, and
            information, is for general informational purposes only. It should
            not be used as a substitute for professional dental advice,
            diagnosis, or treatment.
          </p>
          <p>
            Always seek the advice of your dentist or other qualified health
            provider with any questions you may have regarding a dental
            condition. Never disregard professional advice or delay in seeking
            it because of something you have read on our platform.
          </p>
          <p>
            If you think you may have a dental emergency, call your dentist,
            doctor, or emergency services immediately. Reliance on any
            information provided by NextDentist is solely at your own risk.
          </p>
          <p>
            NextDentist does not recommend or endorse any specific tests,
            dentists, products, or procedures referenced on the site.
            Advertisements, promotions, or external links do not constitute
            endorsement.
          </p>
          <p>
            For further clarification, please email
            <a
              href="mailto:legal@nextdentist.com"
              className="font-medium text-[#356574]"
            >
              {' '}
              legal@nextdentist.com
            </a>
            .
          </p>
        </article>
      </section>
    </main>
  );
};

export default MedicalDisclaimer;

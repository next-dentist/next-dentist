import React from 'react';

const CookiePolicy: React.FC = () => {
  return (
    <main className="min-h-screen bg-[#f4f8f8]">
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 md:py-14">
        <h1 className="mb-6 text-3xl font-bold text-[#356574] sm:text-4xl md:text-5xl">
          Cookie Policy
        </h1>
        <article className="space-y-6 text-base leading-relaxed text-gray-700 sm:text-lg">
          <p>
            NextDentist uses cookies and similar technologies ("cookies") to
            improve functionality, personalize content, analyze traffic, and
            deliver relevant advertisements.
          </p>
          <h2 className="text-2xl font-semibold text-gray-900">
            What Are Cookies?
          </h2>
          <p>
            Cookies are small text files stored on your device when you visit a
            website. They help recognize your device and remember information
            about your visit.
          </p>
          <h2 className="text-2xl font-semibold text-gray-900">
            Types of Cookies We Use
          </h2>
          <ul className="list-inside list-disc space-y-2">
            <li>
              <strong>Essential Cookies:</strong> Enable core site functionality
              such as security and network management.
            </li>
            <li>
              <strong>Performance Cookies:</strong> Collect anonymous data on
              how users interact with our site.
            </li>
            <li>
              <strong>Functional Cookies:</strong> Remember preferences like
              language or location.
            </li>
            <li>
              <strong>Advertising Cookies:</strong> Deliver targeted ads and
              measure ad campaign performance.
            </li>
          </ul>
          <h2 className="text-2xl font-semibold text-gray-900">
            Managing Your Preferences
          </h2>
          <p>
            You can adjust or withdraw your consent at any time via the cookie
            banner or by modifying your browser settings. Disabling cookies may
            affect site functionality.
          </p>
          <p>
            For more details, contact us at
            <a
              href="mailto:privacypolicy@nextdentist.com"
              className="font-medium text-[#356574]"
            >
              {' '}
              privacypolicy@nextdentist.com
            </a>
            .
          </p>
        </article>
      </section>
    </main>
  );
};

export default CookiePolicy;

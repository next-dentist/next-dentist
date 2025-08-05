'use client';
import ConnectCard from '@/components/ConnectCard';
import React from 'react';

const AccessibilityStatement: React.FC = props => {
  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-4 text-3xl font-bold">Accessibility Statement</h1>

      <p className="mb-4">
        At NextDentist, we are committed to ensuring digital accessibility for
        all users, including individuals with disabilities. We continually
        improve the user experience for everyone and apply relevant
        accessibility standards.
      </p>

      <h2 className="mt-6 mb-2 text-xl font-semibold">
        Accessibility Standards
      </h2>
      <p className="mb-4">
        We aim to comply with Web Content Accessibility Guidelines (WCAG) 2.1
        Level AA and regularly audit our site to maintain alignment with these
        standards.
      </p>

      <h2 className="mt-6 mb-2 text-xl font-semibold">Ongoing Improvements</h2>
      <p className="mb-4">
        Our team is continuously working to ensure that all content and features
        on NextDentist.com are accessible to all users. We welcome feedback and
        work diligently to address any accessibility barriers.
      </p>

      <h2 className="mt-6 mb-2 text-xl font-semibold">Contact Us</h2>
      <p className="mb-4">
        If you experience any difficulty accessing content on NextDentist.com,
        please contact us so we can assist you and improve our site:
      </p>

      <ConnectCard />

      <p className="mb-4">
        Your feedback is valuable and helps us enhance the experience for all
        visitors.
      </p>
    </div>
  );
};

export default AccessibilityStatement;

import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Terms of Service | NextDentist',
  description:
    'Review the Terms of Service for using NextDentist, including account requirements, user responsibilities, intellectual property rights, and limitations of liability.',
  keywords: [
    'NextDentist terms of service',
    'dental platform TOS',
    'user agreement',
    'dental listings policy',
    'healthcare website terms',
  ],
};

const TermsOfServicePage: React.FC = props => {
  return (
    <div className="container mx-auto max-w-4xl p-6 text-sm leading-relaxed">
      <h1 className="mb-4 text-3xl font-bold">Terms of Service</h1>
      <p className="mb-4 italic">Effective Date: June 5, 2025</p>
      <p className="mb-4">
        Welcome to <strong>NextDentist.com</strong> ("NextDentist," "we," "our,"
        or "us"). These Terms of Service ("Terms") govern your access to and use
        of our website (
        <a
          href="https://www.nextdentist.com"
          className="text-primary underline"
        >
          https://www.nextdentist.com
        </a>
        ), mobile applications, and related services (collectively, the
        "Services").
      </p>
      <p className="mb-4">
        By accessing or using our Services, you agree to these Terms. If you do
        not agree, do not use the Services.
      </p>

      {/* 1. Use of Services */}
      <h2 className="mt-6 mb-2 text-2xl font-semibold">1. Use of Services</h2>
      <p className="mb-4">
        You must be at least 18 years old to use our Services. You agree to use
        the Services for lawful purposes and in accordance with these Terms.
      </p>

      {/* 2. Account Registration */}
      <h2 className="mt-6 mb-2 text-2xl font-semibold">
        2. Account Registration
      </h2>
      <p className="mb-4">
        To access certain features, you must create an account. You agree to
        provide accurate, current, and complete information. You are responsible
        for maintaining the confidentiality of your login credentials and for
        all activities under your account.
      </p>

      {/* 3. Dentist Listings and User Content */}
      <h2 className="mt-6 mb-2 text-2xl font-semibold">
        3. Dentist Listings and User Content
      </h2>
      <p className="mb-4">
        You may submit or publish content (e.g., profile information, reviews).
        You grant NextDentist a non‑exclusive, royalty‑free, worldwide license
        to use, display, and distribute your content in connection with the
        Services.
      </p>
      <p className="mb-4">
        You are solely responsible for your content. We reserve the right to
        remove any content that violates these Terms or applicable law.
      </p>

      {/* 4. Prohibited Activities */}
      <h2 className="mt-6 mb-2 text-2xl font-semibold">
        4. Prohibited Activities
      </h2>
      <p className="mb-2">You agree not to:</p>
      <ul className="mb-4 list-inside list-disc space-y-1">
        <li>Use the Services for any fraudulent or unlawful purpose</li>
        <li>Impersonate any person or entity</li>
        <li>Upload or distribute harmful, offensive, or misleading content</li>
        <li>Interfere with the proper operation of the Services</li>
        <li>
          Copy, scrape, or aggregate data from the Services without permission
        </li>
      </ul>

      {/* 5. Intellectual Property */}
      <h2 className="mt-6 mb-2 text-2xl font-semibold">
        5. Intellectual Property
      </h2>
      <p className="mb-4">
        All content on the Services, including text, graphics, logos, and
        software, is owned by NextDentist or its licensors and is protected by
        intellectual property laws. You may not use this content without our
        express written permission.
      </p>

      {/* 6. Third‑Party Links and Content */}
      <h2 className="mt-6 mb-2 text-2xl font-semibold">
        6. Third‑Party Links and Content
      </h2>
      <p className="mb-4">
        Our Services may include links to third‑party websites. We are not
        responsible for the content, policies, or practices of those sites.
      </p>

      {/* 7. Disclaimers */}
      <h2 className="mt-6 mb-2 text-2xl font-semibold">7. Disclaimers</h2>
      <p className="mb-4">
        The Services are provided “as is” and “as available” without warranties
        of any kind. We do not guarantee the accuracy, completeness, or
        reliability of any information, including dental listings and reviews.
      </p>

      {/* 8. Limitation of Liability */}
      <h2 className="mt-6 mb-2 text-2xl font-semibold">
        8. Limitation of Liability
      </h2>
      <p className="mb-4">
        To the fullest extent permitted by law, NextDentist is not liable for
        any indirect, incidental, or consequential damages arising out of or in
        connection with your use of the Services.
      </p>

      {/* 9. Indemnification */}
      <h2 className="mt-6 mb-2 text-2xl font-semibold">9. Indemnification</h2>
      <p className="mb-4">
        You agree to indemnify and hold harmless NextDentist and its affiliates
        from any claims, damages, or losses arising from your use of the
        Services or violation of these Terms.
      </p>

      {/* 10. Termination */}
      <h2 className="mt-6 mb-2 text-2xl font-semibold">10. Termination</h2>
      <p className="mb-4">
        We may suspend or terminate your access to the Services at any time for
        any reason, including violation of these Terms.
      </p>

      {/* 11. Governing Law */}
      <h2 className="mt-6 mb-2 text-2xl font-semibold">11. Governing Law</h2>
      <p className="mb-4">
        These Terms are governed by the laws of the State of Gujarat,India
        without regard to its conflict of law principles.
      </p>

      {/* 12. Changes to Terms */}
      <h2 className="mt-6 mb-2 text-2xl font-semibold">12. Changes to Terms</h2>
      <p className="mb-4">
        We may update these Terms at any time. Changes will be posted on this
        page with the updated effective date. Continued use of the Services
        constitutes acceptance of the new Terms.
      </p>

      {/* 13. Contact Us */}
      <h2 className="mt-6 mb-2 text-2xl font-semibold">13. Contact Us</h2>
      <p className="mb-1">
        If you have any questions about these Terms, please contact us at:
      </p>
      <address className="mb-4 not-italic">
        <div>NextDentist Legal Team</div>
        <div>
          Email:{' '}
          <a
            href="mailto:legal@nextdentist.com"
            className="text-primary underline"
          >
            legal@nextdentist.com
          </a>
        </div>
        <div>
          Address: 203, Bricklane 1964, Mangal Pandey&nbsp;Rd, near L&amp;T
          Circle, Karelibagh, Vadodara, Gujarat&nbsp;390018
        </div>
      </address>
    </div>
  );
};

export default TermsOfServicePage;

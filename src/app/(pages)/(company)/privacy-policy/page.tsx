import React from 'react';

const PrivacyPolicy: React.FC = props => {
  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-4 text-3xl font-bold">Privacy Policy</h1>
      <p className="mb-4">Effective Date: June 5, 2025</p>
      <p>
        Welcome to NextDentist.com ("NextDentist," "we," "our," or "us"). This
        Privacy Policy explains how we collect, use, disclose, and protect your
        information when you visit or use our website
        (https://www.nextdentist.com), mobile applications, or any other
        services provided by us (collectively, the "Services").
      </p>
      <p>
        By using our Services, you agree to the terms of this Privacy Policy. If
        you do not agree, please do not use our Services.
      </p>

      <h2 className="mt-6 mb-2 text-2xl font-semibold">
        1. Information We Collect
      </h2>
      <p>We collect the following types of information:</p>
      <ul className="mb-4 list-inside list-disc">
        <li>
          <strong>Personal Information:</strong> Name, email address, phone
          number, practice address, professional credentials, insurance details,
          and other information provided by dentists or patients.
        </li>
        <li>
          <strong>Account Information:</strong> Username, password, profile
          information, communication preferences.
        </li>
        <li>
          <strong>Usage Data:</strong> IP address, device information, browser
          type, operating system, access times, pages viewed, and the referring
          URL.
        </li>
        <li>
          <strong>Cookies and Tracking Technologies:</strong> We use cookies,
          pixels, and other tracking technologies to enhance user experience,
          analyze site traffic, and serve personalized content.
        </li>
      </ul>

      <h2 className="mt-6 mb-2 text-2xl font-semibold">
        2. How We Use Your Information
      </h2>
      <p>We use the collected information to:</p>
      <ul className="mb-4 list-inside list-disc">
        <li>Provide, maintain, and improve our Services</li>
        <li>Connect patients with dental professionals</li>
        <li>Personalize user experiences</li>
        <li>Communicate with users and respond to inquiries</li>
        <li>
          Send promotional and marketing communications (where permitted by law)
        </li>
        <li>Comply with legal obligations</li>
      </ul>

      <h2 className="mt-6 mb-2 text-2xl font-semibold">
        3. Sharing Your Information
      </h2>
      <p>We may share your information with:</p>
      <ul className="mb-4 list-inside list-disc">
        <li>
          <strong>Dental Professionals and Practices:</strong> To facilitate
          connections with patients.
        </li>
        <li>
          <strong>Service Providers:</strong> Third parties who perform services
          on our behalf (e.g., hosting, analytics, payment processing).
        </li>
        <li>
          <strong>Legal and Regulatory Authorities:</strong> When required by
          law or to protect our rights.
        </li>
        <li>
          <strong>Business Transfers:</strong> In case of a merger, sale, or
          acquisition.
        </li>
      </ul>

      <h2 className="mt-6 mb-2 text-2xl font-semibold">4. Data Security</h2>
      <p>
        We implement appropriate technical and organizational measures to
        safeguard your personal data against unauthorized access, disclosure,
        alteration, or destruction.
      </p>

      <h2 className="mt-6 mb-2 text-2xl font-semibold">
        5. Your Privacy Rights
      </h2>
      <p>Depending on your jurisdiction, you may have the right to:</p>
      <ul className="mb-4 list-inside list-disc">
        <li>Access, correct, or delete your personal data</li>
        <li>Object to or restrict processing</li>
        <li>Withdraw consent</li>
        <li>Lodge a complaint with a data protection authority</li>
      </ul>
      <p>
        To exercise your rights, contact us at:{' '}
        <a href="mailto:privacy@nextdentist.com" className="text-blue-600">
          privacy@nextdentist.com
        </a>
      </p>

      <h2 className="mt-6 mb-2 text-2xl font-semibold">6. Data Retention</h2>
      <p>
        We retain your personal information only as long as necessary to fulfill
        the purposes for which it was collected, or as required by law.
      </p>

      <h2 className="mt-6 mb-2 text-2xl font-semibold">
        7. Children’s Privacy
      </h2>
      <p>
        NextDentist does not knowingly collect personal information from
        children under 13. If we become aware of such collection, we will delete
        the data promptly.
      </p>

      <h2 className="mt-6 mb-2 text-2xl font-semibold">8. Third-Party Links</h2>
      <p>
        Our Services may contain links to third-party websites. We are not
        responsible for the privacy practices or content of these sites.
      </p>

      <h2 className="mt-6 mb-2 text-2xl font-semibold">
        9. International Users
      </h2>
      <p>
        If you are accessing our Services from outside the India, your
        information may be transferred to and processed in the India or other
        jurisdictions with different data protection laws.
      </p>

      <h2 className="mt-6 mb-2 text-2xl font-semibold">
        10. Changes to This Policy
      </h2>
      <p>
        We may update this Privacy Policy periodically. Changes will be posted
        on this page with the updated effective date.
      </p>

      <h2 className="mt-6 mb-2 text-2xl font-semibold">11. Contact Us</h2>
      <p>
        For questions or concerns about this Privacy Policy, please contact:
      </p>
      <p>NextDentist Privacy Team</p>
      <p>
        Email:{' '}
        <a href="mailto:privacy@nextdentist.com" className="text-blue-600">
          privacy@nextdentist.com
        </a>
      </p>
      <p>
        Address: 203, Bricklane 1964, Mangal Pandey Rd, near L&T Circle,
        Karelibagh, Vadodara, Gujarat 390018
      </p>
    </div>
  );
};

export default PrivacyPolicy;

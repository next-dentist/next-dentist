'use client';

export default function GDPRCCPACompliance() {
  return (
    <div className="min-h-screen bg-[#f4f8f8]">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 md:py-14">
        <h1 className="mb-6 text-3xl font-bold text-[#356574] sm:text-4xl md:text-5xl">
          GDPR &amp; CCPA Compliance Notice
        </h1>
        <div className="space-y-6 text-base leading-relaxed text-gray-700 sm:text-lg">
          <p>
            NextDentist is committed to upholding the highest standards of data
            privacy as mandated by the European Union's General Data Protection
            Regulation (GDPR) and the California Consumer Privacy Act (CCPA).
          </p>
          <h2 className="text-2xl font-semibold text-gray-900">
            Your Rights at a Glance
          </h2>
          <ul className="list-inside list-disc space-y-2">
            <li>
              <strong>Right to Access:</strong> Request a copy of the personal
              data we hold about you.
            </li>
            <li>
              <strong>Right to Rectification:</strong> Correct inaccurate or
              incomplete data.
            </li>
            <li>
              <strong>Right to Erasure:</strong> Request deletion of your
              personal data ("Right to be Forgotten").
            </li>
            <li>
              <strong>Right to Opt Out:</strong> Opt‑out of data sale or certain
              processing activities.
            </li>
            <li>
              <strong>Right to Data Portability:</strong> Receive your data in a
              structured, machine‑readable format.
            </li>
            <li>
              <strong>Right to Non‑Discrimination:</strong> Receive equal
              service and price even if you exercise your privacy rights.
            </li>
          </ul>
          <h2 className="text-2xl font-semibold text-gray-900">
            How to Exercise Your Rights
          </h2>
          <p>
            Email our Privacy Team at{' '}
            <a
              href="mailto:privacy@nextdentist.com"
              className="font-medium text-[#356574]"
            >
              privacy@nextdentist.com
            </a>
            , or submit a request through your account dashboard. We will
            respond within 30 days as required by law.
          </p>
        </div>
      </div>
    </div>
  );
}

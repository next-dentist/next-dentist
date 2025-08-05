import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | NextDentist',
  description:
    "Understand NextDentist's Privacy Policy regarding data collection, usage, and protection. Your privacy is our priority.",
  keywords: [
    'NextDentist privacy policy',
    'data protection',
    'user data',
    'privacy statement',
    'data security',
    'personal information',
    'terms of service',
  ],
};

export default function PrivacyPolicyLayout({
      children,
    }) {
  return <div className="bg-background">{children}</div>;
}

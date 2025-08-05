import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Director's Desk | NextDentist",
  description:
    'Read a message from the Director of NextDentist, Dr. Megha Vyas, on our vision, mission, and commitment to transforming dental care accessibility.',
  keywords: [
    'NextDentist director',
    'Dr. Megha Vyas',
    'dental care vision',
    'NextDentist mission',
    'dental platform leadership',
    'innovation in dentistry',
  ],
};

export default function DirectorDeskLayout({ children }) {
  return <div className="bg-background">{children}</div>;
}

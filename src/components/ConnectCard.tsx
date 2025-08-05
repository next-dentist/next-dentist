import { siteConfig } from '@/config';
import Link from 'next/link';
import React from 'react';

const ConnectCard: React.FC = () => {
  return (
    <ul className="mb-4 list-inside list-disc">
      <Link href={`mailto:${siteConfig.email}`}>
        <li>Email: {siteConfig.email}</li>
      </Link>
      <Link href={`tel:${siteConfig.phone}`}>
        <li>Phone: {siteConfig.phone}</li>
      </Link>
      <Link href={`https://maps.app.goo.gl/dMVy1tSb5c83FoPi6`}>
        <li>Address: {siteConfig.address}</li>
      </Link>
      {/* website link */}
      <Link href={siteConfig.url}>
        <li>Website: {siteConfig.url}</li>
      </Link>
    </ul>
  );
};

export default ConnectCard;

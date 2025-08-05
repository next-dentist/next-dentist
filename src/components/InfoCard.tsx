/* InfoCard.tsx ------------------------------------------------------------ */
import type { LucideProps } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

/**
 * Props
 * --------------------------------------------------------------------- */
export type InfoCardProps = {
  /** Any lucide-react icon component, e.g. `Phone` or `Mail`              */
  icon: React.ComponentType<LucideProps>;
  /** Main line of text (bold / prominent)                                 */
  title: string;
  /** Secondary line of text (smaller / muted)                             */
  subtitle: string;
  /** Link to the info card */
  href?: string;
};

/**
 * A pill-shaped contact card with an icon, title and subtitle.
 */
const InfoCard: React.FC<InfoCardProps> = ({
  icon: Icon,
  title,
  subtitle,
  href,
}) => {
  return (
    <div className="flex gap-4 rounded-4xl bg-white/70 px-8 py-8 backdrop-blur-sm">
      {href ? (
        <Link href={href} className="flex gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70">
            <Icon
              className="text-primary/30 h-8 w-8 shrink-0"
              strokeWidth={1.8}
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-teal-700">{title}</span>
            <span className="text-sm text-gray-700">{subtitle}</span>
          </div>
        </Link>
      ) : (
        <div className="flex gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70">
            <Icon
              className="text-primary/30 h-8 w-8 shrink-0"
              strokeWidth={1.8}
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-teal-700">{title}</span>
            <span className="text-sm text-gray-700">{subtitle}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfoCard;

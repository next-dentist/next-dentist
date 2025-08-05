// components/icons/StarIcon.tsx
import React from 'react';

export interface StarIconProps extends React.SVGProps<SVGSVGElement> {
  /**
   * If true, the star is filled; otherwise it’s just an outline.
   * Defaults to `false`.
   */
  filled?: boolean;
}

/**
 * A reusable star icon.
 *
 * Usage:
 *   <StarIcon className="h-6 w-6 text-yellow-500" />          // outline
 *   <StarIcon filled className="h-6 w-6 text-yellow-500" />    // filled
 */
const StarIcon: React.FC<StarIconProps> = ({ filled = false, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* the star shape */}
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export default StarIcon;

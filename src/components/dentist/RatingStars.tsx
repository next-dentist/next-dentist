'use client';
import clsx from 'clsx';
import { Star } from 'lucide-react';

export default function RatingStars({
  value,
  size = 16,
}: {
  value: number;
  size?: number;
}) {
  const full = Math.round(value);
  return (
    <span className="inline-flex">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={size}
          className={clsx(
            i <= full ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
          )}
        />
      ))}
    </span>
  );
}

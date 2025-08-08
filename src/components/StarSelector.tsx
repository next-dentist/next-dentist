'use client';
import clsx from 'clsx';
import { Star } from 'lucide-react';
import { useState } from 'react';

export default function StarSelector({
  value,
  onChange,
  size = 24,
}: {
  value: number;
  onChange: (v: number) => void;
  size?: number;
}) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={size}
          className={clsx(
            'cursor-pointer transition',
            (hover || value) >= i
              ? 'fill-[var(--color-primary)] text-[var(--color-primary)]'
              : 'text-[var(--color-primary)]'
          )}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(i)}
        />
      ))}
    </div>
  );
}

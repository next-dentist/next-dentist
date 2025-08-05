'use client';

import clsx from 'clsx';
import { CheckCircle, Clock4, XCircle } from 'lucide-react'; // optional icons

type Slot = { from: string; to: string };
type Day = {
  Name: string;
  Hours: Slot[];
  Closed: boolean;
};
type HoursMap = Record<string, Day>;

export default function WorkingHoursCard({ hours }: { hours: HoursMap }) {
  const todayIndex = new Date().getDay(); // 0-Sun … 6-Sat
  const dayKeys = Object.keys(hours); // to keep original order

  return (
    <section className="mx-auto rounded-4xl bg-white">
      <header className="flex items-center gap-2 border-b px-6 py-4">
        <Clock4 className="text-[var(--color-primary)]" size={20} />
        <h2 className="text-lg font-semibold">Working Hours</h2>
      </header>

      {/* table-ish list */}
      <ul className="divide-y">
        {dayKeys.map((k, idx) => {
          const d = hours[k];
          const isToday = idx === todayIndex;

          return (
            <li
              key={k}
              className={clsx(
                'flex flex-col px-6 py-3 sm:flex-row sm:items-center sm:justify-between',
                isToday && 'bg-[var(--color-primary)]/10'
              )}
            >
              {/* Day name */}
              <span
                className={clsx(
                  'w-24 font-medium',
                  isToday ? 'text-[var(--color-primary)]' : 'text-gray-700'
                )}
              >
                {d.Name}
              </span>

              {/* Hours / closed badge */}
              {d.Closed ? (
                <span className="flex items-center gap-2 text-sm text-gray-500">
                  <XCircle
                    size={16}
                    className="text-[var(--color-destructive)]"
                  />
                  Closed
                </span>
              ) : (
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-gray-800">
                  {d.Hours.map((h, i) => (
                    <span
                      key={i}
                      className="rounded bg-gray-100 px-2 py-0.5 font-mono"
                    >
                      {h.from} — {h.to}
                    </span>
                  ))}
                  {isToday && (
                    <CheckCircle
                      size={14}
                      className="text-[var(--color-primary)]"
                    />
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

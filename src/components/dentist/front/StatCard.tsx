'use client';

import { StatCardProps } from './types';

interface StatCardComponentProps extends StatCardProps {
  isVisible?: boolean;
}

export const StatCard: React.FC<StatCardComponentProps> = ({
  icon: Icon,
  value,
  label,
  color = 'text-primary',
  isVisible = true,
}) => (
  <div
    className={`transform rounded-4xl bg-white/10 p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl ${isVisible ? 'animate-in slide-in-from-bottom-4' : ''}`}
  >
    <div className="flex items-center space-x-4">
      <Icon className={`h-6 w-6 ${color}`} />
      <div>
        <div className="text-2xl font-bold text-[#356574]">{value}</div>
        <div className="text-sm text-[#92b5b9]">{label}</div>
      </div>
    </div>
  </div>
);

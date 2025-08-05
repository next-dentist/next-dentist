import { Loader2 } from 'lucide-react';
import React from 'react';

type LoadingSpinnerProps = {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  fullScreen = false,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  if (fullScreen) {
    return (
      <div className="bg-background/50 fixed inset-0 z-50 flex items-center justify-center">
        <Loader2 className={`${sizeClasses[size]} text-primary animate-spin`} />
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-[100px] w-full items-center justify-center">
      <Loader2 className={`${sizeClasses[size]} text-primary animate-spin`} />
    </div>
  );
};

export default LoadingSpinner;

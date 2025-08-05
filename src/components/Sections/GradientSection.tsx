'use client';

import React from 'react';

interface GradientSectionProps {
  children: React.ReactNode;
  className?: string;
}

const GradientSection: React.FC<GradientSectionProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={`from-tertiary/10 to-secondary/10 bg-gradient-to-br px-4 py-10 ${className}`}
    >
      {children}
    </div>
  );
};

export default GradientSection;

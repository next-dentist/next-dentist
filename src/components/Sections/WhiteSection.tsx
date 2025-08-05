'use client';

import React from 'react';

interface WhiteSectionProps {
  children: React.ReactNode;
  className?: string;
}

const WhiteSection: React.FC<WhiteSectionProps> = ({ children, className }) => {
  return (
    <div
      className={`rounded-4xl bg-white/50 ${className} flex w-full justify-center md:p-10`}
    >
      {children}
    </div>
  );
};

export default WhiteSection;

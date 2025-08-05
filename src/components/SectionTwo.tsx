"use client";

interface SectionTwoProps {
  className?: string;
  children: React.ReactNode;
}

export const SectionTwo = ({ children, className }: SectionTwoProps) => {
  return (
    <div className={`mx-auto flex flex-col px-4 ${className}`}>
      <div className="container mx-auto flex flex-col px-4 ">{children}</div>
    </div>
  );
};

'use client';

interface SectionThreeProps {
  className?: string;
  children: React.ReactNode;
}

export const SectionThree = ({ children, className }: SectionThreeProps) => {
  return (
    <div className={`mx-auto flex flex-col px-4 ${className}`}>
      <div className="container mx-auto flex flex-col gap-4 md:flex-row md:px-4 md:py-3">
        {children}
      </div>
    </div>
  );
};

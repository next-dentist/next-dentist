"use client";

interface SectionFourProps {
  className?: string;
  children: React.ReactNode;
}

export default function SectionFour({ children, className }: SectionFourProps) {
  return (
    <div className={` mx-auto flex flex-col px-4 py-10 ${className}`}>
      <div className="container mx-auto flex flex-col px-4 py-3 ">
        {children}
      </div>
    </div>
  );
}

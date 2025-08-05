"use client";

interface FooterColumnProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const FooterColumn = ({
  title,
  children,
  className,
}: FooterColumnProps) => {
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <h2 className="text-2xl font-bold">{title}</h2>
      {children}
    </div>
  );
};

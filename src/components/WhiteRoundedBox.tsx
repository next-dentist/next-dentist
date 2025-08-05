'use client';

interface WhiteRoundedBoxProps {
  className?: string;
  children: React.ReactNode;
}

export const WhiteRoundedBox = ({
  className,
  children,
}: WhiteRoundedBoxProps) => {
  return (
    <div
      className={`rounded-4xl bg-white px-4 py-4 md:px-8 md:py-12 ${className}`}
    >
      {children}
    </div>
  );
};

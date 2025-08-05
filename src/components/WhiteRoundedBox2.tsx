"use client";

interface WhiteRoundedBox2Props {
  className?: string;
  children: React.ReactNode;
}

export const WhiteRoundedBox2 = ({
  className,
  children,
}: WhiteRoundedBox2Props) => {
  return (
    <div className={`rounded-lg bg-white p-4 ${className}`}>{children}</div>
  );
};

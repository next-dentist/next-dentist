"use client";

interface WhiteTransperentBoxProps {
  children: React.ReactNode;
  className?: string;
}

export const WhiteTransperentBox = ({
  children,
  className,
}: WhiteTransperentBoxProps) => {
  return (
    <div
      className={`rounded-2xl backdrop-blur-md bg-white/50 py-10 px-4 basis-1/4 items-center justify-center ${className}`}
    >
      {children}
    </div>
  );
};

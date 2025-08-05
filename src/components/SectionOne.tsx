'use client';

interface SectionOneProps {
  className?: string;
  children: React.ReactNode;
}

export const SectionOne = ({ children, className }: SectionOneProps) => {
  const bgstyle = {
    backgroundImage: "url('/images/slider/art.png')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundBlendMode: 'overlay',
  };

  return (
    <div
      className={`mx-auto flex flex-col px-4 py-10 ${className}`}
      style={bgstyle}
    >
      <div className="container mx-auto flex flex-col px-4 py-3">
        {children}
      </div>
    </div>
  );
};

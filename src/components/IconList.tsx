"use client";

interface IconListProps {
  icon: React.ReactNode;
  title: string;
  sufixIcon?: React.ReactNode;
}

export const IconList = ({ icon, title, sufixIcon }: IconListProps) => {
  return (
    <div className="flex gap-4 items-center">
      <div className="flex flex-row gap-4">{icon}</div>

      <span className="text-lg text-slate-600">{title}</span>
      {sufixIcon && <div className="flex flex-row gap-2">{sufixIcon}</div>}
    </div>
  );
};

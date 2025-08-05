'use client';
import { MoveUpRight } from 'lucide-react';
import Link from 'next/link';

{
  /* <div className="flex flex-col gap-4  rounded-2xl justify-end items-end px-4">
          <div className="flex flex-col gap-1 bg-white/50 backdrop-blur-sm w-1/3 rounded-2xl justify-center items-center p-2">
            <span className="text-sm text-gray-500 flex items-end justify-end p-2 w-full">
              <MoveUpRight color="white" />
            </span>
            <span className="text-2xl font-bold text-secondary-foreground">
              2000+
            </span>
            <span className="text-sm text-secondary-foreground">
              Dentists Joined
            </span>
          </div>
        </div> */
}

interface TopRightBlurButtonProps {
  title?: string;
  count?: string;
  description?: string;
  href?: string;
  position?: string;
  icon?: boolean;
}

const TopRightBlurButton = ({
  title,
  count,
  description,
  href,
  position,
  icon,
}: TopRightBlurButtonProps) => {
  return (
    <Link
      href={href || '#'}
      className={`flex flex-col rounded-2xl items-${position} justify-center`}
    >
      <div className="hover:bg-secondary/50 flex w-auto flex-col items-center justify-center rounded-2xl bg-white/50 p-4 backdrop-blur-sm transition-all duration-300">
        <span className="text-muted-foreground flex w-full items-end justify-end text-sm">
          {icon && (
            <MoveUpRight className="text-primary-foreground" size={10} />
          )}
        </span>
        <span className="text-secondary-foreground font-bold">{count}</span>
        <span className="text-secondary-foreground w-full items-center justify-center text-center text-sm">
          {description}
        </span>
      </div>
    </Link>
  );
};

export default TopRightBlurButton;

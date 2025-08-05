'use client';

import * as Icons from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface IconBoxProps {
  id: string;
  icon: string;
  title: string;
  content: string;
  link?: string;
  linkText?: string;
}

const IconBox: React.FC<IconBoxProps> = ({
  id,
  icon,
  title,
  content,
  link,
  linkText,
}) => {
  // Dynamically get icon component from lucide-react
  const IconComponent = icon ? (Icons as any)[icon] : null;

  return (
    <div
      key={id}
      className="bg-secondary/10 flex flex-col items-center justify-start gap-2 rounded-4xl px-4 py-6"
    >
      {IconComponent ? (
        <IconComponent color="#3A6D7E" strokeWidth={1.4} size={40} />
      ) : (
        <div className="h-12 w-12 rounded-full bg-gray-200" />
      )}
      <h4 className="text-md text-primary text-center font-bold">{title}</h4>
      <p className="text-center text-sm">{content}</p>
      {link && linkText && (
        <Link href={link} className="text-center text-sm">
          {linkText}
        </Link>
      )}
    </div>
  );
};

export default IconBox;

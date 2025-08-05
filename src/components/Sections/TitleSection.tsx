'use client ';

import Image from 'next/image';
import React from 'react';
interface TitleSectionProps {
  title?: string;
  image: string;
}

const TitleSection: React.FC<TitleSectionProps> = ({ title, image }) => {
  // Only render image if it exists and is not empty
  const hasValidImage = image && image.trim() !== '';

  return (
    // create rounded bg image and text on top rounded
    <div className="relative z-1 h-96">
      {hasValidImage ? (
        <Image
          src={image}
          alt={title ?? ''}
          fill
          className="rounded-4xl object-cover"
        />
      ) : (
        // Fallback background when no image is provided
        <Image
          src={'/images/smile-designing.webp'}
          alt={title ?? ''}
          fill
          className="rounded-4xl object-cover"
        />
      )}
      {/* title center vertical and horizontal */}
      {title && (
        <div className="absolute flex h-full w-full flex-col items-center justify-center rounded-4xl bg-white/50">
          <div className="flex flex-col items-center justify-center rounded-4xl bg-white/60 px-10 py-4 backdrop-blur-xl">
            <h1 className="text-white">{title}</h1>
          </div>
        </div>
      )}
    </div>
  );
};

export default TitleSection;

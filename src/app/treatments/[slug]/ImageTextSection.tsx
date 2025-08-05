"use client";
import { Section } from "@prisma/client";
import Image from "next/image";
import React from "react";
interface ImageTextSectionProps {
  section: Section;
}

const ImageTextSection: React.FC<ImageTextSectionProps> = ({ section }) => {
  return (
    <div key={section.id} className={`flex flex-col gap-4`} id={section.id}>
      <h2 className="text-2xl">{section.title}</h2>
      <div className="flex flex-col gap-4">
        {/* if has image */}
        {section.image && (
          <Image
            src={section.image || ""}
            alt={section.title}
            width={1000}
            height={1000}
            className="w-full h-full object-cover rounded-4xl"
          />
        )}
        <div className="basis-1/2">
          <div
            className="text-lg content"
            dangerouslySetInnerHTML={{ __html: section.content }}
          />
        </div>
      </div>
    </div>
  );
};

export default ImageTextSection;

import React from "react";

interface ImageSectionProps {
  bgImage?: string;
  className?: string;
  children: React.ReactNode;
}

const ImageSection: React.FC<ImageSectionProps> = ({
  bgImage,
  className,
  children,
}) => {
  // Create the style object conditionally if bgImage is provideddownloadedImage-6.jpg
  const backgroundStyle = bgImage ? { backgroundImage: `url(${bgImage})` } : {};

  return (
    <div
      className={`
              bg-cover
              bg-center
              w-full overflow-hidden ${className || ""}
              rounded-4xl
              min-h-[250px] 
              p-4
      `}
      style={backgroundStyle}
    >
      {children}
    </div>
  );
};

export default ImageSection;

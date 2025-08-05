// components/ImageGallery.jsx
import { Images } from '@prisma/client';
import { ArrowLeftIcon, ArrowRightIcon, XIcon } from 'lucide-react';
import Image from 'next/image';
import { KeyboardEvent, useState } from 'react';
import { Button } from './ui/button';

interface ImageGalleryProps {
  images: Images[];
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (index: number) => {
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const goToPrevious = () => {
    setCurrentIndex(prevIndex =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex(prevIndex =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      goToPrevious();
    } else if (e.key === 'ArrowRight') {
      goToNext();
    } else if (e.key === 'Escape') {
      closeModal();
    }
  };

  return (
    <div className="w-full">
      {/* Thumbnail Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative aspect-square cursor-pointer overflow-hidden rounded-lg transition-opacity hover:opacity-90"
            onClick={() => openModal(index)}
          >
            <Image
              src={image.url}
              alt={image.alt || `Gallery image ${index + 1}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="bg-background/80 fixed inset-0 z-50 flex items-center justify-center"
          onClick={closeModal}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div
            className="relative w-full max-w-4xl p-4"
            onClick={e => e.stopPropagation()}
          >
            {/* Close button */}
            <Button
              className="bg-background/50 text-foreground hover:bg-background/70 absolute top-2 right-2 z-10 cursor-pointer rounded-full p-2"
              onClick={closeModal}
              variant="ghost"
              size="icon"
            >
              <XIcon size={50} />
            </Button>

            {/* Previous button */}
            <Button
              className="bg-background/50 text-foreground hover:bg-background/70 absolute top-1/2 left-4 z-10 -translate-y-1/2 transform cursor-pointer rounded-full p-2"
              onClick={goToPrevious}
              variant="ghost"
              size="icon"
            >
              <ArrowLeftIcon size={50} onClick={goToPrevious} />
            </Button>

            {/* Next button */}
            <Button
              className="bg-background/50 text-foreground hover:bg-background/70 absolute top-1/2 right-4 z-10 -translate-y-1/2 transform cursor-pointer rounded-full p-2"
              onClick={goToNext}
              variant="ghost"
              size="icon"
            >
              <ArrowRightIcon size={50} />
            </Button>

            {/* Current Image */}
            <div className="relative aspect-video w-full">
              <Image
                src={images[currentIndex].url}
                alt={
                  images[currentIndex].alt ||
                  `Gallery image ${currentIndex + 1}`
                }
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Image counter */}
            <div className="bg-background/50 text-foreground absolute bottom-6 left-1/2 -translate-x-1/2 transform rounded-full px-4 py-2">
              {currentIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;

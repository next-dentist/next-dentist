import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import DentistImageGallery from "./DentiistImageGallery";

export default function ImageGalleryPage() {
  return (
    <Suspense fallback={<Skeleton className="w-full h-[300px]" />}>
      <DentistImageGallery />
    </Suspense>
  );
}

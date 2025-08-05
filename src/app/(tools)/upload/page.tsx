"use client";

import ImageUploader from "@/components/ImageUploader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function UploadForm() {
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const handleImageUploaded = (imageUrl: string) => {
    setUploadedImageUrl(imageUrl);
  };

  const handleRemoveImage = () => {
    setUploadedImageUrl(null);
  };

  return (
    <div className="container mx-auto py-8 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Upload Profile Avatar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {!uploadedImageUrl ? (
              <ImageUploader
                onImageUploaded={handleImageUploaded}
                aspectRatio={1}
              />
            ) : (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-center text-green-600">
                  Upload Successful!
                </h3>
                <div className="relative group">
                  <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden">
                    <Image
                      src={uploadedImageUrl}
                      alt="Uploaded avatar"
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-full w-32 h-32 mx-auto">
                    <button
                      onClick={() => setUploadedImageUrl(null)}
                      className="p-2 text-white hover:text-blue-400 transition-colors"
                      title="Change image"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleRemoveImage}
                      className="p-2 text-white hover:text-red-400 transition-colors"
                      title="Remove image"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

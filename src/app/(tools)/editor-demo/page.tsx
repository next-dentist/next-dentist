'use client';

import MediaManager from '@/components/MediaManager';

export default function EditorDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            Enhanced Media Manager Demo
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Experience the enhanced media manager with pagination, search,
            filtering, and multiple view modes. Perfect for content management
            systems.
          </p>
        </div>
        <MediaManager
          onSelect={url => {
            console.log('Selected media:', url);
            alert(`Selected: ${Array.isArray(url) ? url.join(', ') : url}`);
          }}
          multiple={true}
        />
      </div>
    </div>
  );
}

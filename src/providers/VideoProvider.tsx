'use client';

import React, { createContext, useCallback, useContext, useState } from 'react';

interface VideoContextType {
  currentVideoId: string | null;
  setCurrentVideoId: (id: string | null) => void;
  isVideoPlaying: (id: string) => boolean;
  stopAllVideos: () => void;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export function VideoProvider({ children }: { children: React.ReactNode }) {
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);

  const isVideoPlaying = useCallback(
    (id: string) => {
      return currentVideoId === id;
    },
    [currentVideoId]
  );

  const stopAllVideos = useCallback(() => {
    setCurrentVideoId(null);
  }, []);

  return (
    <VideoContext.Provider
      value={{
        currentVideoId,
        setCurrentVideoId,
        isVideoPlaying,
        stopAllVideos,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
}

export function useVideo() {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error('useVideo must be used within a VideoProvider');
  }
  return context;
}

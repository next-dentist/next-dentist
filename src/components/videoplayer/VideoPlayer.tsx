'use client';

import { useVideo } from '@/providers/VideoProvider';
import {
  fetchVideoMetadata,
  getBestYouTubeThumbnail,
  parseVideoUrl,
} from '@/utils/videoUtils';
import { Clock, Play } from 'lucide-react';
import { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import VideoDialog from './VideoDialog';

interface VideoPlayerProps {
  url: string;
  title?: string;
  id?: string;
}

interface VideoMetadata {
  title: string;
  thumbnail: string;
  platform: string;
  videoId: string | null;
  duration?: number;
  author_name?: string;
}

export default function VideoPlayer({
  url,
  title: providedTitle,
  id,
}: VideoPlayerProps) {
  const [mounted, setMounted] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(true);
  const [thumbnailError, setThumbnailError] = useState(false);
  const [thumbnailRetryCount, setThumbnailRetryCount] = useState(0);
  const videoId = id || url; // Use id if provided, otherwise fallback to url
  const { isVideoPlaying } = useVideo();

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    async function loadVideoMetadata() {
      setIsLoadingMetadata(true);
      try {
        const videoMetadata = await fetchVideoMetadata(url);

        // For YouTube videos, try to get the best available thumbnail
        if (videoMetadata.platform === 'youtube' && videoMetadata.videoId) {
          const bestThumbnail = await getBestYouTubeThumbnail(
            videoMetadata.videoId
          );
          videoMetadata.thumbnail = bestThumbnail;
        }

        setMetadata(videoMetadata);
      } catch (error) {
        console.warn('Failed to load video metadata:', error);
        // Fallback metadata
        const { platform, videoId: parsedVideoId } = parseVideoUrl(url);
        setMetadata({
          title: providedTitle || 'Video',
          thumbnail: '',
          platform,
          videoId: parsedVideoId,
        });
      } finally {
        setIsLoadingMetadata(false);
      }
    }

    loadVideoMetadata();
  }, [url, providedTitle]);

  const handleThumbnailClick = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleThumbnailError = () => {
    if (
      metadata?.platform === 'youtube' &&
      metadata?.videoId &&
      thumbnailRetryCount === 0
    ) {
      // Try fallback to hqdefault for YouTube
      const fallbackThumbnail = `https://img.youtube.com/vi/${metadata.videoId}/hqdefault.jpg`;
      setMetadata(prev =>
        prev ? { ...prev, thumbnail: fallbackThumbnail } : prev
      );
      setThumbnailRetryCount(1);
    } else {
      setThumbnailError(true);
    }
  };

  const displayTitle = providedTitle || metadata?.title || 'Video';
  const displayThumbnail =
    metadata?.thumbnail && !thumbnailError ? metadata.thumbnail : null;
  const hasAuthor =
    metadata?.author_name && metadata.author_name !== displayTitle;

  return (
    <>
      {/* Video Card Container */}
      <div className="group w-full overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
        {mounted && (
          <>
            {/* Header with Platform Badge and Status */}
            <div className="flex items-center justify-between border-b border-gray-100 p-3">
              <div className="flex items-center space-x-2">
                {metadata?.platform && metadata.platform !== 'other' && (
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 capitalize">
                    {metadata.platform}
                  </span>
                )}
                {metadata?.duration && (
                  <span className="inline-flex items-center space-x-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>
                      {Math.floor(metadata.duration / 60)}:
                      {(metadata.duration % 60).toString().padStart(2, '0')}
                    </span>
                  </span>
                )}
              </div>

              {isVideoPlaying(videoId) && (
                <span className="inline-flex animate-pulse items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                  <span className="mr-1 h-2 w-2 animate-pulse rounded-full bg-red-400"></span>
                  Playing
                </span>
              )}
            </div>

            {/* Video Thumbnail Area - Clean with only play button */}
            <div
              className="relative aspect-video w-full cursor-pointer bg-gray-100"
              onClick={handleThumbnailClick}
            >
              {/* Loading State */}
              {isLoadingMetadata && (
                <div className="absolute inset-0 flex animate-pulse items-center justify-center bg-gray-200">
                  <div className="text-sm font-medium text-gray-500">
                    Loading video...
                  </div>
                </div>
              )}

              {/* Thumbnail Image or Video Preview */}
              {!isLoadingMetadata && (
                <>
                  {displayThumbnail ? (
                    <img
                      src={displayThumbnail}
                      alt={displayTitle}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={handleThumbnailError}
                    />
                  ) : (
                    <div className="h-full w-full bg-black">
                      <ReactPlayer
                        url={url}
                        width="100%"
                        height="100%"
                        playing={false}
                        controls={false}
                        light={true} // This shows a thumbnail
                        config={{
                          youtube: {
                            playerVars: {
                              showinfo: 0,
                              rel: 0,
                              modestbranding: 1,
                              fs: 0,
                            },
                          },
                          vimeo: {
                            playerOptions: {
                              title: false,
                              byline: false,
                              portrait: false,
                              pip: false,
                            },
                          },
                        }}
                      />
                    </div>
                  )}

                  {/* Centered Play Button - Only overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 transition-all duration-300 group-hover:bg-black/20">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-gray-800 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:scale-110 hover:bg-white">
                      <Play className="ml-1 h-8 w-8" fill="currentColor" />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Video Information Section - Outside video area */}
            <div className="space-y-3 p-4">
              {/* Title */}
              {displayTitle !== 'Video' && (
                <h3 className="line-clamp-2 text-lg leading-tight font-semibold text-gray-900">
                  {displayTitle}
                </h3>
              )}

              {/* Author */}
              {hasAuthor && (
                <p className="text-sm text-gray-600">
                  by <span className="font-medium">{metadata.author_name}</span>
                </p>
              )}

              {/* Action Button */}
              <button
                onClick={handleThumbnailClick}
                className="flex w-full cursor-pointer items-center justify-center space-x-2 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition-colors duration-200 hover:bg-blue-700"
              >
                <Play className="h-4 w-4" fill="currentColor" />
                <span>Watch Video</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Video Dialog */}
      <VideoDialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        url={url}
        title={displayTitle}
        videoId={videoId}
      />
    </>
  );
}

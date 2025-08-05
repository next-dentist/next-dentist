'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useVideo } from '@/providers/VideoProvider';
import { Maximize, Pause, Play, Volume2, VolumeX, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import './style.css';

interface VideoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title?: string;
  videoId: string;
}

export default function VideoDialog({
  isOpen,
  onClose,
  url,
  title,
  videoId,
}: VideoDialogProps) {
  const [mounted, setMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const playerRef = useRef<ReactPlayer>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { setCurrentVideoId, stopAllVideos } = useVideo();

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen && isPlaying) {
      setCurrentVideoId(videoId);
    } else if (!isPlaying) {
      setCurrentVideoId(null);
    }
  }, [isOpen, isPlaying, videoId, setCurrentVideoId]);

  useEffect(() => {
    if (isOpen) {
      // Auto-start video when dialog opens
      stopAllVideos(); // Stop all other videos first
      setCurrentVideoId(videoId);
      setIsPlaying(true);
      setProgress(0);
      setIsBuffering(false);
    } else {
      // Reset state when dialog closes
      setIsPlaying(false);
      setProgress(0);
      setIsBuffering(false);
      setCurrentVideoId(null);
    }
  }, [isOpen, videoId, setCurrentVideoId, stopAllVideos]);

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () =>
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handlePlayPause = () => {
    if (!isPlaying) {
      stopAllVideos(); // Stop all other videos
      setCurrentVideoId(videoId);
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgress = (state: { played: number }) => {
    setProgress(state.played);
  };

  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    setProgress(newValue);
    if (playerRef.current) {
      playerRef.current.seekTo(newValue);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen();
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleDialogClose = () => {
    setIsPlaying(false);
    setCurrentVideoId(null);
    onClose();
  };

  const displayTitle = title && title !== 'Video' ? title : 'Video Player';

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="video-dialog overflow-hidden bg-black p-0">
        <DialogHeader className="bg-black p-4 pb-0">
          <DialogTitle className="text-lg font-semibold text-white">
            {displayTitle}
          </DialogTitle>
        </DialogHeader>

        <div ref={containerRef} className="relative bg-black">
          {mounted && (
            <>
              <div className="relative aspect-video w-full">
                <ReactPlayer
                  ref={playerRef}
                  url={url}
                  width="100%"
                  height="100%"
                  playing={isPlaying}
                  volume={isMuted ? 0 : volume}
                  controls={false}
                  config={{
                    youtube: {
                      playerVars: {
                        showinfo: 0,
                        rel: 0,
                        modestbranding: 1,
                        fs: 0,
                        autoplay: 1, // Enable autoplay for YouTube
                      },
                    },
                    vimeo: {
                      playerOptions: {
                        title: false,
                        byline: false,
                        portrait: false,
                        pip: false,
                        autoplay: true, // Enable autoplay for Vimeo
                      },
                    },
                  }}
                  onProgress={handleProgress}
                  onDuration={handleDuration}
                  onEnded={() => setIsPlaying(false)}
                  onBuffer={() => setIsBuffering(true)}
                  onBufferEnd={() => setIsBuffering(false)}
                  onReady={() => setIsBuffering(false)}
                />

                {/* Buffering Indicator */}
                {isBuffering && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="flex items-center space-x-2 text-white">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>Loading...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Custom Controls */}
              <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4">
                {/* Progress Bar */}
                <div className="mb-4">
                  <input
                    type="range"
                    min={0}
                    max={0.999999}
                    step="any"
                    value={progress}
                    onChange={handleSeekChange}
                    className="slider h-1 w-full cursor-pointer appearance-none rounded-lg bg-white/30"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Play/Pause Button */}
                    <button
                      onClick={handlePlayPause}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                    >
                      {isPlaying ? (
                        <Pause className="h-5 w-5" />
                      ) : (
                        <Play className="ml-0.5 h-5 w-5" />
                      )}
                    </button>

                    {/* Volume Control */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={toggleMute}
                        className="text-white transition-colors hover:text-gray-300"
                      >
                        {isMuted || volume === 0 ? (
                          <VolumeX className="h-5 w-5" />
                        ) : (
                          <Volume2 className="h-5 w-5" />
                        )}
                      </button>
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.1}
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="slider h-1 w-20 cursor-pointer appearance-none rounded-lg bg-white/30"
                      />
                    </div>

                    {/* Time Display */}
                    <div className="text-sm font-medium text-white">
                      {formatTime(progress * duration)} / {formatTime(duration)}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Fullscreen Button */}
                    <button
                      onClick={toggleFullscreen}
                      className="text-white transition-colors hover:text-gray-300"
                      title={
                        isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'
                      }
                    >
                      <Maximize className="h-5 w-5" />
                    </button>

                    {/* Close Button */}
                    <button
                      onClick={handleDialogClose}
                      className="text-white transition-colors hover:text-gray-300"
                      title="Close video"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'; // Importing shadcn ui table components
import { useCostVideos } from '@/hooks/cost/useCostVideos';
import { Loader2, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface Props {
  costPageId: string;
}

interface Video {
  id: string;
  video: string;
  videoAlt: string | null;
}

export default function VideoLinkUploader({ costPageId }: Props) {
  const [videoUrl, setVideoUrl] = useState('');
  const [videoAlt, setVideoAlt] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const {
    useFetchCostVideos,
    useAddCostVideo,
    useDeleteCostVideo,
    useUpdateCostVideo,
  } = useCostVideos(costPageId);
  const {
    data: videos,
    isLoading,
    refetch: refetchVideos,
  } = useFetchCostVideos();
  const { mutate: addVideo, isPending: isAdding } = useAddCostVideo();
  const { mutate: deleteVideo, isPending: isDeleting } = useDeleteCostVideo();
  const { mutate: updateVideo, isPending: isUpdating } = useUpdateCostVideo();

  const handleAddVideo = () => {
    if (!videoUrl) return;
    addVideo(
      { video: videoUrl, videoAlt },
      {
        onSuccess: () => {
          setVideoUrl('');
          setVideoAlt('');
          refetchVideos();
        },
      }
    );
  };

  const handleEditVideo = (video: Video) => {
    setSelectedVideo(video);
    setIsDialogOpen(true);
  };

  const handleDeleteVideo = (videoId: string) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      deleteVideo(videoId);
    }
  };

  const handleUpdateVideo = () => {
    if (selectedVideo) {
      updateVideo({ videoId: selectedVideo.id, data: { videoAlt: videoAlt } });
      setIsDialogOpen(false);
      setSelectedVideo(null);
    }
  };

  // Helper function to get video thumbnail URL
  const getVideoThumbnail = (url: string): string | undefined => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.match(
        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
      )?.[1];
      return videoId
        ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
        : undefined;
    }
    if (url.includes('vimeo.com')) {
      const videoId = url.match(/(?:vimeo\.com\/)(\d+)/)?.[1];
      return videoId ? `https://vumbnail.com/${videoId}.jpg` : undefined;
    }
    return undefined;
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Video Links</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Video Form */}
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              value={videoUrl}
              onChange={e => setVideoUrl(e.target.value)}
              placeholder="Enter YouTube or Vimeo URL"
              className="w-full"
            />
            <Input
              value={videoAlt}
              onChange={e => setVideoAlt(e.target.value)}
              placeholder="Video description (optional)"
              className="w-full"
            />
          </div>
          <Button
            onClick={handleAddVideo}
            disabled={isAdding || !videoUrl}
            className="w-full"
          >
            {isAdding ? 'Adding...' : 'Add Video'}
          </Button>
        </div>

        {/* Video List */}
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            <Table className="min-w-full divide-y divide-gray-200">
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Video
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Description
                  </TableHead>
                  <TableHead className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-200 bg-white">
                {videos?.map((video: Video) => (
                  <TableRow key={video.id}>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={getVideoThumbnail(video.video)}
                        alt={video.videoAlt || 'Video thumbnail'}
                        className="h-10 w-10 object-cover"
                      />
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      {video.videoAlt || 'No description'}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditVideo(video)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteVideo(video.id)}
                        disabled={isDeleting}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Edit Video Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Video</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                value={videoAlt}
                onChange={e => setVideoAlt(e.target.value)}
                placeholder="Video description"
                className="w-full"
              />
              <Button
                onClick={handleUpdateVideo}
                disabled={isUpdating}
                className="w-full"
              >
                {isUpdating ? 'Updating...' : 'Update Video'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

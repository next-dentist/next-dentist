interface VideoMetadata {
  title: string;
  thumbnail: string;
  platform: 'youtube' | 'vimeo' | 'dailymotion' | 'other';
  videoId: string | null;
  duration?: number;
  author_name?: string;
}

// Extract video ID and platform from URL
export function parseVideoUrl(url: string): { platform: string; videoId: string | null } {
  // YouTube patterns
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const youtubeMatch = url.match(youtubeRegex);
  if (youtubeMatch) {
    return { platform: 'youtube', videoId: youtubeMatch[1] };
  }

  // Vimeo patterns
  const vimeoRegex = /(?:vimeo\.com\/)(?:.*\/)?(\d+)(?:\?.*)?$/;
  const vimeoMatch = url.match(vimeoRegex);
  if (vimeoMatch) {
    return { platform: 'vimeo', videoId: vimeoMatch[1] };
  }

  // Dailymotion patterns
  const dailymotionRegex = /(?:dailymotion\.com\/(?:video|hub)\/|dai\.ly\/)([^_\s]+)/;
  const dailymotionMatch = url.match(dailymotionRegex);
  if (dailymotionMatch) {
    return { platform: 'dailymotion', videoId: dailymotionMatch[1] };
  }

  return { platform: 'other', videoId: null };
}

// Get thumbnail URL based on platform
export function getVideoThumbnail(url: string): string | null {
  const { platform, videoId } = parseVideoUrl(url);
  
  switch (platform) {
    case 'youtube':
      if (videoId) {
        // Try maxresdefault first, fallback to hqdefault
        return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      }
      break;
    case 'vimeo':
      // Vimeo thumbnails need to be fetched via API, we'll handle this in the component
      return null;
    case 'dailymotion':
      if (videoId) {
        return `https://www.dailymotion.com/thumbnail/video/${videoId}`;
      }
      break;
  }
  
  return null;
}

// Fetch video metadata using our API route
export async function fetchVideoMetadata(url: string): Promise<VideoMetadata> {
  try {
    const response = await fetch(`/api/video-metadata?url=${encodeURIComponent(url)}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch metadata');
    }
    
    const data = await response.json();
    
    return {
      title: data.title || 'Video',
      thumbnail: data.thumbnail || '',
      platform: data.platform as 'youtube' | 'vimeo' | 'dailymotion' | 'other',
      videoId: data.videoId,
      duration: data.duration,
      author_name: data.author_name,
    };
  } catch (error) {
    console.warn('Failed to fetch video metadata:', error);
    
    // Fallback with basic info
    const { platform, videoId } = parseVideoUrl(url);
    return {
      title: 'Video',
      thumbnail: getVideoThumbnail(url) || '',
      platform: platform as 'youtube' | 'vimeo' | 'dailymotion' | 'other',
      videoId,
    };
  }
}

// Check if thumbnail image exists (for YouTube maxres fallback)
export async function checkThumbnailExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

// Get best available YouTube thumbnail
export async function getBestYouTubeThumbnail(videoId: string): Promise<string> {
  const maxresUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const hqUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  
  // Check if maxres exists, otherwise use hqdefault
  const maxresExists = await checkThumbnailExists(maxresUrl);
  return maxresExists ? maxresUrl : hqUrl;
} 
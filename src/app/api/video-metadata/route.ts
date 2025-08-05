import { NextRequest, NextResponse } from 'next/server';

interface VideoMetadata {
  title: string;
  thumbnail: string;
  platform: string;
  videoId: string | null;
  duration?: number;
  author_name?: string;
}

function parseVideoUrl(url: string): { platform: string; videoId: string | null } {
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

function getVideoThumbnail(platform: string, videoId: string | null): string | null {
  switch (platform) {
    case 'youtube':
      if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      }
      break;
    case 'dailymotion':
      if (videoId) {
        return `https://www.dailymotion.com/thumbnail/video/${videoId}`;
      }
      break;
  }
  return null;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      );
    }

    const { platform, videoId } = parseVideoUrl(url);
    
    let oEmbedUrl = '';
    
    switch (platform) {
      case 'youtube':
        oEmbedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
        break;
      case 'vimeo':
        oEmbedUrl = `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}`;
        break;
      case 'dailymotion':
        oEmbedUrl = `https://www.dailymotion.com/services/oembed?url=${encodeURIComponent(url)}&format=json`;
        break;
      default:
        // For other platforms, return basic info
        return NextResponse.json({
          title: 'Video',
          thumbnail: '',
          platform: 'other',
          videoId: null
        });
    }

    const response = await fetch(oEmbedUrl, {
      headers: {
        'User-Agent': 'NextDentist/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch metadata: ${response.status}`);
    }
    
    const data = await response.json();
    
    const metadata: VideoMetadata = {
      title: data.title || 'Video',
      thumbnail: data.thumbnail_url || getVideoThumbnail(platform, videoId) || '',
      platform,
      videoId,
      duration: data.duration,
      author_name: data.author_name,
    };

    return NextResponse.json(metadata);
  } catch (error) {
    console.error('Error fetching video metadata:', error);
    
    // Return fallback data
    const url = new URL(request.url).searchParams.get('url') || '';
    const { platform, videoId } = parseVideoUrl(url);
    
    return NextResponse.json({
      title: 'Video',
      thumbnail: getVideoThumbnail(platform, videoId) || '',
      platform,
      videoId,
    });
  }
} 
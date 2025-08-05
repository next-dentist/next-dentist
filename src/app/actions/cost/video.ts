'use server';

import { db } from '@/db';
import { revalidatePath } from 'next/cache';

export async function addCostVideo(costPageId: string, data: { video: string; videoAlt?: string }) {
  try {
    const video = await db.costVideo.create({
      data: {
        costPageId,
        video: data.video,
        videoAlt: data.videoAlt || null,
      },
    });
    revalidatePath(`/cost/${costPageId}`);
    return { success: true, data: video };
  } catch (error) {
    console.error('Error adding cost video:', error);
    return { success: false, error: 'Failed to add video' };
  }
}

export async function deleteCostVideo(videoId: string) {
  try {
    const video = await db.costVideo.delete({
      where: { id: videoId },
    });
    revalidatePath(`/cost/${video.costPageId}`);
    return { success: true };
  } catch (error) {
    console.error('Error deleting cost video:', error);
    return { success: false, error: 'Failed to delete video' };
  }
}

export async function updateCostVideo(videoId: string, data: { videoAlt?: string }) {
  try {
    const video = await db.costVideo.update({
      where: { id: videoId },
      data: {
        videoAlt: data.videoAlt || null,
      },
    });
    revalidatePath(`/cost/${video.costPageId}`);
    return { success: true, data: video };
  } catch (error) {
    console.error('Error updating cost video:', error);
    return { success: false, error: 'Failed to update video' };
  }
}

export async function getCostVideos(costPageId: string) {
  try {
    const videos = await db.costVideo.findMany({
      where: { costPageId },
    });
    return videos;
  } catch (error) {
    console.error('Error fetching cost videos:', error);
    throw error;
  }
} 
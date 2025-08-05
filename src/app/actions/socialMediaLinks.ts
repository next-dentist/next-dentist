'use server';

import { db } from '@/db';
import { z } from 'zod';

// Define the schema for social media links using zod
const socialLinksSchema = z.object({
  facebook: z.string().optional().refine(
    (url) => !url || (url.startsWith('http') && url.includes('facebook.com')),
    { message: "Invalid URL: Facebook link must contain 'facebook.com'" }
  ),
  instagram: z.string().optional().refine(
    (url) => !url || (url.startsWith('http') && url.includes('instagram.com')),
    { message: "Invalid URL: Instagram link must contain 'instagram.com'" }
  ),
  twitter: z.string().optional().refine(
    (url) => !url || (url.startsWith('http') && url.includes('twitter.com')),
    { message: "Invalid URL: Twitter link must contain 'twitter.com'" }
  ),
  linkedin: z.string().optional().refine(
    (url) => !url || (url.startsWith('http') && url.includes('linkedin.com')),
    { message: "Invalid URL: LinkedIn link must contain 'linkedin.com'" }
  ),
  youtube: z.string().optional().refine(
    (url) => !url || (url.startsWith('http') && url.includes('youtube.com')),
    { message: "Invalid URL: YouTube link must contain 'youtube.com'" }
  ),
  tiktok: z.string().optional().refine(
    (url) => !url || (url.startsWith('http') && url.includes('tiktok.com')),
    { message: "Invalid URL: TikTok link must contain 'tiktok.com'" }
  ),
  pinterest: z.string().optional().refine(
    (url) => !url || (url.startsWith('http') && url.includes('pinterest.com')),
    { message: "Invalid URL: Pinterest link must contain 'pinterest.com'" }
  ),
  snapchat: z.string().optional().refine(
    (url) => !url || (url.startsWith('http') && url.includes('snapchat.com')),
    { message: "Invalid URL: Snapchat link must contain 'snapchat.com'" }
  ),
  twitch: z.string().optional().refine(
    (url) => !url || (url.startsWith('http') && url.includes('twitch.tv')),
    { message: "Invalid URL: Twitch link must contain 'twitch.tv'" }
  ),
  discord: z.string().optional().refine(
    (url) => !url || (url.startsWith('http') && url.includes('discord.com')),
    { message: "Invalid URL: Discord link must contain 'discord.com'" }
  ),
  telegram: z.string().optional().refine(
    (url) => !url || (url.startsWith('http') && url.includes('telegram.org')),
    { message: "Invalid URL: Telegram link must contain 'telegram.org'" }
  ),
  whatsapp: z.string().optional().refine(
    (url) => !url || (url.startsWith('http') && url.includes('whatsapp.com')),
    { message: "Invalid URL: WhatsApp link must contain 'whatsapp.com'" }
  ),
});

// Create a new social media links entry
export const createSocialLinks = async (dentistId: string, links: unknown) => {
  try {
    const validatedLinks = socialLinksSchema.parse(links);
    const updatedDentist = await db.dentist.update({
      where: { id: dentistId },
      data: { socialLinks: validatedLinks },
    });
    return { success: true, data: updatedDentist };
  } catch (error) {
    console.error("Error creating social links:", error);
    return { success: false, error: "Failed to create social links." };
  }
};

// Read social media links for a specific dentist
export const readSocialLinks = async (dentistId: string) => {
  try {
    const dentist = await db.dentist.findUnique({
      where: { id: dentistId },
      select: { socialLinks: true },
    });
    return { success: true, data: dentist?.socialLinks || {} };
  } catch (error) {
    console.error("Error reading social links:", error);
    return { success: false, error: "Failed to read social links." };
  }
};

// Update social media links for a specific dentist
export const updateSocialLinks = async (dentistId: string, links: unknown) => {
  try {
    // Filter out empty strings and null values
    const filteredLinks = Object.fromEntries(
      Object.entries(links as Record<string, string>).filter(([_, value]) => value && value.trim() !== '')
    );

    const validatedLinks = socialLinksSchema.parse(filteredLinks);
    const updatedDentist = await db.dentist.update({
      where: { id: dentistId },
      data: { socialLinks: validatedLinks },
    });
    return { success: true, data: updatedDentist.socialLinks };
  } catch (error) {
    console.error("Error updating social links:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: "Failed to update social links." };
  }
};

// Delete social media links for a specific dentist
export const deleteSocialLinks = async (dentistId: string) => {
  try {
    const updatedDentist = await db.dentist.update({
      where: { id: dentistId },
      data: { socialLinks: {} },
    });
    return { success: true, data: updatedDentist.socialLinks };
  } catch (error) {
    console.error("Error deleting social links:", error);
    return { success: false, error: "Failed to delete social links." };
  }
};

// object type will be json, like this:
// {
//   facebook: 'https://www.facebook.com/yourpage',
//   instagram: 'https://www.instagram.com/yourpage',
//   twitter: 'https://www.twitter.com/yourpage',
//   linkedin: 'https://www.linkedin.com/in/yourpage',
// }

// it will be stored in the socialLinks field in the dentist table

// we will use this action to update the socialLinks field

// complete crud operation for the socialLinks field

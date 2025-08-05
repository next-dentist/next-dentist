import { siteConfig } from "@/config";
import { db } from "@/db";
import crypto from "crypto";
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import os from "os";
import path from "path";

// Function to generate a unique, sanitized filename
function generateUniqueFilename(originalFilename: string): string {
  const extension = path.extname(originalFilename);
  const nameWithoutExt = path
    .basename(originalFilename, extension)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 40);
  const uniqueHash = crypto.randomBytes(8).toString("hex");
  const timestamp = Date.now();
  return `${nameWithoutExt}-${timestamp}-${uniqueHash}${extension}`;
}

// Use dynamic import for basic-ftp to avoid bundle issues
async function uploadToFtp(tempFilePath: string, fileName: string) {
  try {
    const { Client } = await import("basic-ftp");
    const client = new Client();
    client.ftp.verbose = true;

    try {
      await client.access({
        host: process.env.FTP_HOST!,
        user: process.env.FTP_USER!,
        password: process.env.FTP_PASSWORD!,
        secure: false,
        port: parseInt(process.env.FTP_PORT!) || 21,
      });

      // Check if GALLERY_IMAGE_UPLOAD_PATH is defined and valid
      if (
        !siteConfig.GALLERY_IMAGE_UPLOAD_PATH ||
        typeof siteConfig.GALLERY_IMAGE_UPLOAD_PATH !== "string"
      ) {
        throw new Error("Invalid GALLERY_IMAGE_UPLOAD_PATH in siteConfig");
      }

      try {
        await client.ensureDir(`${siteConfig.GALLERY_IMAGE_UPLOAD_PATH}`);
      } catch (mkdirError) {
        console.error("Error creating uploads directory:", mkdirError);
      }

      await client.uploadFrom(
        tempFilePath,
        `${siteConfig.GALLERY_IMAGE_UPLOAD_PATH}/${fileName}`
      );

      const baseUrl =
        process.env.FTP_BASE_URL || `https://${process.env.FTP_HOST}`;
      const formattedBaseUrl = baseUrl.endsWith("/")
        ? baseUrl.slice(0, -1)
        : baseUrl;
      
      // Normalize the path to avoid double slashes
      const uploadPath = siteConfig.GALLERY_IMAGE_UPLOAD_PATH.replace(/^\/+|\/+$/g, '');
      const normalizedPath = uploadPath ? `/${uploadPath}` : '';
      const uploadedFileUrl = `${formattedBaseUrl}${normalizedPath}/${fileName}`;

      return { success: true, url: uploadedFileUrl };
    } finally {
      client.close();
    }
  } catch (ftpError) {
    console.error("FTP Error:", ftpError);
    throw ftpError;
  }
}

export async function POST(request: NextRequest) {
  try {
    const tempDir = os.tmpdir();
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const costPageId = formData.get("costPageId") as string;
    const dentistId = formData.get("dentistId") as string;

    if (!file) {
      console.error("No file received in request");
      return NextResponse.json({ success: false, message: "No file uploaded" });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uniqueFilename = generateUniqueFilename(file.name);
    const tempFilePath = path.join(tempDir, uniqueFilename);
    fs.writeFileSync(tempFilePath, buffer);

    try {
      const result = await uploadToFtp(tempFilePath, uniqueFilename);

      // Always save to media table for MediaPicker
      const mediaEntry = await db.media.create({
        data: {
          filename: file.name,
          url: result.url,
          mimeType: file.type,
          size: file.size,
          createdAt: new Date(),
        },
      });

      // Save to database if costPageId is provided (for cost pages)
      if (costPageId) {
        const newImage = await db.costImages.create({
          data: {
            image: result.url,
            costPageId: costPageId,
            imageAlt: file.name, // You might want to make this editable later
          },
        });

        return NextResponse.json({
          success: true,
          url: result.url,
          filename: uniqueFilename,
          originalFilename: file.name,
          imageId: newImage.id,
          mediaId: mediaEntry.id,
        });
      }

      // Save to Images table if dentistId is provided (for dentist galleries)
      if (dentistId) {
        const newImage = await db.images.create({
          data: {
            url: result.url,
            dentistId: dentistId,
            alt: file.name,
          },
        });

        return NextResponse.json({
          success: true,
          url: result.url,
          filename: uniqueFilename,
          originalFilename: file.name,
          imageId: newImage.id,
          mediaId: mediaEntry.id,
        });
      }

      // Default response for general uploads (no specific context)
      return NextResponse.json({
        success: true,
        url: result.url,
        filename: uniqueFilename,
        originalFilename: file.name,
        mediaId: mediaEntry.id,
        imageId: mediaEntry.id, // Use mediaId as imageId for general uploads
      });
    } catch (ftpError) {
      console.error("FTP Error:", ftpError);
      return NextResponse.json({
        success: false,
        message: "FTP upload failed",
        error: ftpError instanceof Error ? ftpError.message : "Unknown error",
      });
    } finally {
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
    }
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({
      success: false,
      message: "Upload failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    await db.images.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete image",
      },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};

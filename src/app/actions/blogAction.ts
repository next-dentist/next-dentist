"use server";

import { db } from "@/db";
import { BlogStatus } from "@prisma/client";
import { z } from "zod";

// Define response types
interface SuccessResponse<T> {
  success: true;
  data: T;
}

interface ErrorResponse {
  success: false;
  error: string | Record<string, string[]>;
}

type BlogResponse = SuccessResponse<any> | ErrorResponse;

/**
 * Blog form data interface
 */
interface BlogFormData {
  title: string;
  content: string;
  status: BlogStatus;
  authorId: string;
  image?: string;
  imageAlt?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoExtra?: any;
  seoKeyword?: string;
  categoryId?: string;
  slug?: string;
}

/**
 * Zod schema for blog form validation
 */
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  status: z.nativeEnum(BlogStatus),
  authorId: z.string().min(1, "Author is required"),
  image: z.string().url("Must be a valid URL").optional(),
  imageAlt: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoExtra: z.any().optional(),
  seoKeyword: z.string().optional(),
  categoryId: z.string().optional(),
  slug: z.string().optional(),
});

/**
 * Zod schema for blog update validation (all fields optional except id)
 */
const updateSchema = z.object({
  id: z.string().min(1, "Blog ID is required"),
  title: z.string().optional(),
  content: z.string().optional(),
  status: z.nativeEnum(BlogStatus).optional(),
  authorId: z.string().optional(),
  image: z.string().url("Must be a valid URL").optional(),
  imageAlt: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoExtra: z.any().optional(),
  seoKeyword: z.string().optional(),
  categoryId: z.string().optional(),
  slug: z.string().optional(),
});

/**
 * Fetch all blogs with error handling
 */
export const fetchAllBlogs = async () => {
  try {
    const blogs = await db.blog.findMany();
    return { success: true, data: blogs };
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return { success: false, error: "Failed to fetch blogs." };
  }
};

/**
 * Fetch a single blog by ID
 * @param id string
 */
export const fetchBlogById = async (id: string) => {
  try {
    if (!id) return { success: false, error: "Blog ID is required." };
    const blog = await db.blog.findUnique({ where: { id } });
    if (!blog) return { success: false, error: "Blog not found." };
    return { success: true, data: blog };
  } catch (error) {
    console.error("Error fetching blog:", error);
    return { success: false, error: "Failed to fetch blog." };
  }
};

/**
 * Create a new blog with validation and error handling
 * @param blogData BlogFormData
 */
export const createBlog = async (blogData: BlogFormData): Promise<BlogResponse> => {
  try {
    // Validate input
    const validated = formSchema.safeParse(blogData);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.flatten().fieldErrors,
      };
    }

    // Ensure content is properly handled
    const content = validated.data.content?.trim() || '';
    if (!content) {
      return {
        success: false,
        error: "Content is required",
      };
    }

    // Set slug from title if not provided
    const dataToCreate = {
      ...validated.data,
      content,
    };

    // If slug is not provided, generate it from the title
    if (!dataToCreate.slug || dataToCreate.slug.trim() === '') {
      // Import slugify function from utils
      const { generateSlug } = await import('@/lib/utils');
      dataToCreate.slug = generateSlug(dataToCreate.title);
    }

    const newBlog = await db.blog.create({
      data: dataToCreate,
    });

    return { success: true, data: newBlog };
  } catch (error) {
    console.error("Error creating blog:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to create blog." 
    };
  }
};

/**
 * Update an existing blog by ID
 * @param updateData { id: string, ...fields }
 */
export const updateBlog = async (updateData: {
  id: string;
  title?: string;
  content?: string;
  status?: BlogStatus;
  authorId?: string;
  image?: string;
  imageAlt?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoExtra?: any;
  seoKeyword?: string;
  categoryId?: string;
  slug?: string;
}): Promise<BlogResponse> => {
  try {
    const validated = updateSchema.safeParse(updateData);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.flatten().fieldErrors,
      };
    }

    const { id, ...data } = validated.data;

    // Ensure content is properly handled
    if (data.content !== undefined) {
      data.content = data.content.trim();
      if (!data.content) {
        return {
          success: false,
          error: "Content cannot be empty",
        };
      }
    }

    // Update slug from title if title was changed and slug wasn't explicitly provided
    if (data.title && (!data.slug || data.slug.trim() === '')) {
      // Import slugify function from utils
      const { generateSlug } = await import('@/lib/utils');
      data.slug = generateSlug(data.title);
    }

    const updatedBlog = await db.blog.update({
      where: { id },
      data,
    });

    return { success: true, data: updatedBlog };
  } catch (error: any) {
    console.error("Error updating blog:", error);
    if (error.code === "P2025") {
      return { success: false, error: "Blog not found." };
    }
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to update blog." 
    };
  }
};

/**
 * Delete a blog by ID
 * @param id string
 */
export const deleteBlog = async (id: string) => {
  try {
    if (!id) return { success: false, error: "Blog ID is required." };
    await db.blog.delete({ where: { id } });
    return { success: true, message: "Blog deleted successfully." };
  } catch (error: any) {
    console.error("Error deleting blog:", error);
    if (error.code === "P2025") {
      // Prisma not found error
      return { success: false, error: "Blog not found." };
    }
    return { success: false, error: "Failed to delete blog." };
  }
};


export const getBlogById = async (id: string) => {
  try {
    const blog = await db.blog.findUnique({ where: { id } });
    return { success: true, data: blog };
  } catch (error) {
    console.error("Error fetching blog:", error);
    return { success: false, error: "Failed to fetch blog." };
  }
};


export const getBlogBySlug = async (slug: string) => {
  try {
    const blog = await db.blog.findUnique({ where: { slug } });
    return { success: true, data: blog };
  } catch (error) {
    console.error("Error fetching blog:", error);
    return { success: false, error: "Failed to fetch blog." };
  }
};

// export all published blogs
export const getPublishedBlogs = async () => {
  try {
    const blogs = await db.blog.findMany({ where: { status: BlogStatus.published } });
    return { success: true, data: blogs };
  } catch (error) {
    console.error("Error fetching published blogs:", error);
    return { success: false, error: "Failed to fetch published blogs." };
  }
};











import { AI_INSTRUCTIONS } from "@/config";
import { iconNames } from "@/lib/icons";

export const generateInstructionPrompt = (
  fieldName: string,
  formValues: {
    title?: string;
    type?: string;
  },
  treatmentName?: string | null
): string => {
  switch (fieldName) {
    case "title":
      return `Generate a professional, clear 2-3 words maximum title for a dental treatment instruction about "${
        formValues.title || ""
      }" for treatment "${treatmentName}". Make it concise and patient-friendly. Don't use quotes in the response. If the concept has more than 3 words, condense it to only 2-3 words maximum while preserving the core meaning. ${AI_INSTRUCTIONS.map(
        (instruction) => instruction.description
      )} `;

    case "content":
      return `write short instruction about 12 words of ${
        formValues.title
      } for treatment "${treatmentName}". Use reference for about use of ${
        formValues.title
      }. ${AI_INSTRUCTIONS.map((instruction) => instruction.description)}  `;

    case "icon":
      return `Write an appropriate icon name from the Lucide React library for "${
        formValues.title
      }" . Just provide the icon name (e.g., "Tooth", "CheckCircle", "AlertTriangle"). Choose from the following icons: ${iconNames.join(
        ", "
      )} `;

    case "buttonText":
      return `Generate a short, clear call-to-action button text (2-4 words) for "${formValues.title}" dental instructions.`;

    case "buttonLink":
      return `Suggest a typical URL path for a resource related to "${formValues.title}" dental instructions (just the path, like '/resources/post-extraction-care').`;

    default:
      return `Generate appropriate content for ${fieldName} related to "${
        formValues.title
      }" dental treatment instructions for treatment "${treatmentName}". ${AI_INSTRUCTIONS.map(
        (instruction) => instruction.description
      )} max words 2 `;
  }
};

export const cleanAIResponse = (response: string): string => {
  return response.replace(/^["'](.*)["']$/g, "$1");
};

export const ensureMaxWords = (text: string, maxWords: number): string => {
  const words = text.trim().split(/\s+/);
  if (words.length > maxWords) {
    return words.slice(0, maxWords).join(" ");
  }
  return text;
};

export const generateSectionPrompt = (
  fieldName: string,
  formValues: {
    title?: string;
    content?: string;
  },
  treatmentName?: string | null
): string => {
  switch (fieldName) {
    case "title":
      return `Generate a professional, clear title for a dental treatment section about "${formValues.title}". Make it concise and patient-friendly. Don't use quotes in the response. Max 5 to 10 words, always use positive and Impactful words.`;
    case "content":
      return `Write a professional, informative paragraph about ${
        formValues.title
      } treatment for a dental website ${AI_INSTRUCTIONS.map(
        (instruction) => instruction.description
      )} `;
    default:
      return `Generate appropriate content for ${fieldName} related to "${
        formValues.title
      }" dental treatment instructions for treatment "${treatmentName}". ${AI_INSTRUCTIONS.map(
        (instruction) => instruction.description
      )} `;
  }
};

export const generateBlogContentPrompt = (
  fieldName: string,
  formValues: {
    title?: string;
    content?: string;
    image?: string;
    imageAlt?: string;
    seoTitle?: string;
    seoDescription?: string;
    seoExtra?: string;
    seoKeyword?: string;
  },
  treatmentName?: string | null
): string => {
  switch (fieldName) {
    case "title":
      return `Generate a professional, clear title for a dental treatment blog about "${formValues.title}". Make it concise and patient-friendly. Don't use quotes in the response. Max 5 to 10 words, always use positive and Impactful words.`;
    case "content":
      return `Write a professional, informative paragraph about ${
        formValues.title
      } treatment for a dental website ${AI_INSTRUCTIONS.map(
        (instruction) => instruction.description
      )} `;
    case "image":
      return `Generate a professional, clear image alt text for a dental treatment blog about "${formValues.title}". Make it concise and patient-friendly. Don't use quotes in the response. Max 5 to 10 words, always use positive and Impactful words.`;
    case "imageAlt":
      return `Generate a professional, clear image alt text for a dental treatment blog about "${formValues.title}". Make it concise and patient-friendly. Don't use quotes in the response. Max 5 to 10 words, always use positive and Impactful words.`;
    case "seoTitle":
      return `Generate a professional, clear seo title for a dental treatment blog about "${formValues.title}". Make it concise and patient-friendly. Don't use quotes in the response. Max 5 to 10 words, always use positive and Impactful words.`;
    case "seoDescription":
      return `Generate a professional, clear seo description for a dental treatment blog about "${formValues.title}". Make it concise and patient-friendly. Don't use quotes in the response. Max 5 to 10 words, always use positive and Impactful words.`;
    case "seoExtra":
      return `Generate a professional, clear seo extra for a dental treatment blog about "${formValues.title}". Make it concise and patient-friendly. Don't use quotes in the response. Max 5 to 10 words, always use positive and Impactful words.`;
    case "seoKeyword":
      return `Generate a professional, clear seo keyword for a dental treatment blog about "${formValues.title}". Make it concise and patient-friendly. Don't use quotes in the response. Max 5 to 10 words, always use positive and Impactful words.`;
    default:
      return `Generate appropriate content for ${fieldName} related to "${
        formValues.title
      }" dental treatment instructions for treatment "${treatmentName}". ${AI_INSTRUCTIONS.map(
        (instruction) => instruction.description
      )} `;
  }
};

import * as z from "zod";


export const instructionFormSchema = z.object({
  type: z.string().optional().nullable(),
  title: z
    .string()
    .min(1, "Title is required")
    .max(25, "Title must be 25 characters maximum"),
  content: z.string().min(1, "Content is required"),
  icon: z.string().optional().nullable(),
  buttonText: z.string().optional().nullable(),
  buttonLink: z
    .string()
    .url("Must be a valid URL or empty")
    .optional()
    .nullable()
    .or(z.literal("")),
});

export type InstructionFormValues = z.infer<typeof instructionFormSchema>;

// export sections schema
export const sectionFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  menuText: z.string().optional().nullable(),
  cssId: z.string().optional().nullable(),
  content: z.string().min(1, "Content is required"),
  image: z.string().optional().nullable(),
  video: z.string().optional().nullable(),
  buttonLink: z
    .string()
    .url("Must be a valid URL or empty")
    .optional()
    .nullable()
    .or(z.literal("")),
  buttonText: z.string().optional().nullable(),
});

export type SectionFormValues = z.infer<typeof sectionFormSchema>;


// add treatment schema
export const treatmentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  duration: z.string().min(1, "Duration is required"),
  relatedKeys: z.string().optional().nullable(),
  description: z.string().min(1, "Description is required"),
  image: z.string().optional().nullable(),
  video: z.string().optional().nullable(),
  imageCaption: z.string().optional().nullable(),
  imageCaptionLink: z.string().optional().nullable(),
  imageTopRightDescription: z.string().optional().nullable(),
  imageTopRightLink: z.string().optional().nullable(),
  imageTopRightText: z.string().optional().nullable(),
  imageTopRightLinkText: z.string().optional().nullable(),

});

export type TreatmentFormValues = z.infer<typeof treatmentSchema>;

// add appointment schema
export const appointmentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  message: z.string().optional().nullable(),
});

export type AppointmentFormValues = z.infer<typeof appointmentSchema>;

export const costTableSchema = z.object({
  costTables: z.array(z.object({
    title: z.string().min(1, "Title is required"),
    titleUrl: z.string().optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    content: z.string().min(1, "Content is required"),
    currencyOne: z.string().optional(),
    currencyTwo: z.string().optional(),
    currencyThree: z.string().optional(),
    costOne: z.string().optional(),
    costTwo: z.string().optional(),
    costThree: z.string().optional(),
    tableSetId: z.string().optional(),
  })),
  costPageId: z.string().min(1)
});

export type CostTableFormValues = z.infer<typeof costTableSchema>;

// CostSection schema
export const costSectionSchema = z.object({
  costSections: z.array(z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
  })),
  costPageId: z.string().min(1)
});

export type CostSectionFormValues = z.infer<typeof costSectionSchema>;

// CostFAQ schema
export const costFaqSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  costPageId: z.string().min(1)
});


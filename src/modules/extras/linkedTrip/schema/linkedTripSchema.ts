import { z } from "zod";

export const linkedTripSchema = z.object({
  linkedTripTitle: z
    .string({ required_error: "Title of linked trip is required." })
    .nonempty("Title of linked trip is required.")
    .min(3, "Must have at least 3 characters"),
  startDate: z.date({ required_error: "Start date is required." }),
  endDate: z.date({ required_error: "End date is required." }),
  travelers: z
    .array(
      z.object({
        value: z.number(),
        label: z.string(),
      })
    )
    .optional(),
  attachments: z
    .array(
      z.object({
        id: z.union([z.string(), z.number()]).optional(),
        createdAt: z.string().optional(),
        fileName: z.string(),
        trainId: z.number().optional(),
        addedBy: z.number().optional(),
        file: z.instanceof(File).optional(),
        fileUrl: z.string().url("File URL is invalid"), // URL for preview
        fileType: z.string(), // file MIME type
        fileSize: z.number().min(0, "File size cannot be negative"), // in bytes
      })
    )
    .optional(),
});

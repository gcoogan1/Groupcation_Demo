import { z } from "zod";

export const trainSchema = z.object({
  railwayLine: z.string().min(3, "Train Line is required."),
  class: z.string().min(1, "Class is required."),
  departureStation: z.string().min(2, "Departure train station is required."),
  departureDate: z.date({ required_error: "Departure date is required." }),
  departureTime: z.date({ required_error: "Departure time is required." }),
  arrivalStation: z.string().min(2, "Arrival train station is required."),
  arrivalDate: z.date({ required_error: "Arrival date is required." }),
  arrivalTime: z.date({ required_error: "Arrival time is required." }),
  travelers: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
      })
    )
    .optional(),
  cost: z.string().nullable().optional(),
  attachments: z
    .array(
      z.object({
        id: z.union([z.string(), z.number()]).optional(), // You can use id if provided
        createdAt: z.string().optional(),
        fileName: z.string(),
        trainId: z.number().optional(),
        addedBy: z.number().optional(),
        file: z.instanceof(File).optional(),
        fileUrl: z.string().url("File URL is invalid"), // URL for preview
        fileType: z.string(), // file MIME type
        fileSize: z.number().min(0, "File size cannot be negative"), // in bytes
      })
    ).optional(),
  notes: z.string().min(10, "Must have at least 10 characters.").nullable().optional()
});

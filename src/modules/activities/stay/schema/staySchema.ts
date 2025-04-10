import { z } from "zod";

export const staySchema = z.object({
  placeName: z.string().min(2, "Name of stay is required."),
  placeAddress: z.string().min(2, "Address of stay is required."),
  checkInDate: z.date({ required_error: "Check-in date is required." }),
  checkInTime: z.date({ required_error: "Check-in time is required." }),
  checkOutDate: z.date({ required_error: "Check-out date is required." }),
  checkOutTime: z.date({ required_error: "Check-out time is required." }),
  travelers: z
    .array(
      z.object({
        value: z.number(),
        label: z.string(),
      })
    )
    .optional(),
  cost: z.string().nullable().optional(),
  attachments: z
    .array(
      z.object({
        id: z.union([z.string(), z.number()]).optional(),
        createdAt: z.string().optional(),
        fileName: z.string(),
        trainId: z.number().optional(),
        addedBy: z.number().optional(),
        file: z.instanceof(File).optional(),
        fileUrl: z.string().url("File URL is invalid"),
        fileType: z.string(),
        fileSize: z.number().min(0, "File size cannot be negative"),
      })
    )
    .optional(),
  notes: z
    .string()
    .min(10, "Must have at least 10 characters.")
    .nullable()
    .optional(),
});

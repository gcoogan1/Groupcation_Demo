import { z } from "zod";

export const restaurantSchema = z.object({
  restaurantName: z
    .string({ required_error: "Restaurant name is required." })
    .nonempty("Restaurant name is required.")
    .min(3, "Must have at least 3 characters."),
  restaurantAddress: z
    .string({ required_error: "Restaurant address is required." })
    .nonempty("Restaurant address is required.")
    .min(5, "Must have at least 5 characters."),
  tableType: z
    .string({ required_error: "Table type is required." })
    .nonempty("Table type is required.")
    .min(3, "Must have at least 3 characters."),
  reservationDate: z.date({ required_error: "Reservation date is required." }),
  reservationTime: z.date({ required_error: "Reservation time is required." }),
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
        fileUrl: z.string().url("File URL is invalid"), // URL for preview
        fileType: z.string(), // file MIME type
        fileSize: z.number().min(0, "File size cannot be negative"), // in bytes
      })
    )
    .optional(),
  notes: z
    .string()
    .min(10, "Must have at least 10 characters.")
    .nullable()
    .optional(),
});

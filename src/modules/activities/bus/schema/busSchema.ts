import { z } from "zod";

export const busSchema = z.object({
  busRoute: z.string().min(3, "Bus route is required."),
  busClass: z.string().min(1, "Class is required."),
  departureBusStop: z.string().min(2, "Departure bus stop is required."),
  departureDate: z.date({ required_error: "Departure date is required." }),
  departureTime: z.date({ required_error: "Departure time is required." }),
  arrivalBusStop: z.string().min(2, "Arrival bus stop is required."),
  arrivalDate: z.date({ required_error: "Arrival date is required." }),
  arrivalTime: z.date({ required_error: "Arrival time is required." }),
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

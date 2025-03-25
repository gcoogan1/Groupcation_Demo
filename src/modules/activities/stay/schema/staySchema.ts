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
        value: z.string(),
        label: z.string(),
      })
    )
    .optional(),
  cost: z.string().optional(),
  attachments: z
    .array(z.instanceof(File))
    .max(5, "You can upload a maximum of 5 files")
    .optional(),
  notes: z.string().min(10, "Must have at least 10 characters.").optional(),
});

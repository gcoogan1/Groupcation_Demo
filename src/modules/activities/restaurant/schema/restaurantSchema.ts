import { z } from "zod";

export const restaurantSchema = z.object({
  restaurantName: z.string().min(3, "Restaurant name is required."),
  restaurantAddress: z.string().min(3, "Restaurant address is required."),
  tableType: z.string().min(3, "Must have at least 3 characters."),
  reservationDate: z.date({ required_error: "Reservation date is required." }),
  reservationTime: z.date({ required_error: "Reservation time is required." }),
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

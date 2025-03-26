import { z } from "zod";

export const linkedTripSchema = z.object({
  linkedTripTitle: z.string().min(3, "Title of linked trip is required."),
  startDate: z.date({ required_error: "Start date is required." }),
  endDate: z.date({ required_error: "End date is required." }),
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
    .max(1, "You can only upload one background picture.")
    .optional(),
});

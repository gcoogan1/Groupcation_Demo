import { z } from "zod";

export const boatSchema = z.object({
  boatCruiseLine: z.string().min(3, "Name of boat / cruise line is required."),
  boatCruiseClass: z.string().optional(),
  departureDock: z.string().min(2, "Departure dock is required."),
  departureDate: z.date({ required_error: "Departure date is required." }),
  departureTime: z.date({ required_error: "Departure time is required." }),
  arrivalDock: z.string().min(2, "Arrival dock is required."),
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
  cost: z.string().optional(),
  attachments: z
    .array(z.instanceof(File))
    .max(5, "You can upload a maximum of 5 files")
    .optional(),
  notes: z.string().min(10, "Must have at least 10 characters.").optional(),
});

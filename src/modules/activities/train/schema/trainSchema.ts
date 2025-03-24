import { z } from "zod";

export const trainSchema = z.object({
  railwayLine: z.string().min(3, "Train Line is required."),
  class: z.string().min(2, "Class is required."),
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
})

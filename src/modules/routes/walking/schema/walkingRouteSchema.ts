import { z } from "zod";

export const walkingRouteSchema = z.object({
  walkDuration: z.string().min(3, "Walk duration is required."),
  departureLocation: z.string().min(3, "Departure location is required."),
  departureDate: z.date({ required_error: "A date is required." }),
  departureTime: z.date({ required_error: "A time is required." }),
  arrivalLocation: z.string().min(3, "Arrival location is required."),
  notes: z.string().min(10, "Must have at least 10 characters.").nullable().optional(),
});

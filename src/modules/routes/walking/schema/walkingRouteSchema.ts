import { z } from "zod";

export const walkingRouteSchema = z.object({
  walkDuration: z
    .string({ required_error: "Walk duration is required." })
    .nonempty("Walk duration is required.")
    .min(4, "Must have at least 4 characters."),
  departureLocation: z
    .string({ required_error: "Departure location is required." })
    .nonempty("Departure location is required.")
    .min(4, "Must have at least 4 characters."),
  departureDate: z.date({ required_error: "A date is required." }),
  departureTime: z.date({ required_error: "A time is required." }),
  arrivalLocation: z
    .string({ required_error: "Arrival location is required." })
    .nonempty("Arrival location is required.")
    .min(4, "Must have at least 4 characters."),
  notes: z
    .string()
    .min(10, "Must have at least 10 characters.")
    .nullable()
    .optional(),
});

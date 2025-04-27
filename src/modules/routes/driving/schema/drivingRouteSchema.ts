import { z } from "zod";

export const drivingRouteSchema = z.object({
  driveDuration: z.string().min(3, "Drive duration is required."),
  departureLocation: z.string().min(2, "Departure location is required."),
  departureDate: z.date({ required_error: "Departure date is required." }),
  departureTime: z.date({ required_error: "Departure time is required." }),
  arrivalLocation: z.string().min(2, "Arrival location is required."),
  arrivalDate: z.date({ required_error: "Arrival date is required." }).nullable().optional(),
  notes: z.string().min(10, "Must have at least 10 characters.").nullable().optional(),
});

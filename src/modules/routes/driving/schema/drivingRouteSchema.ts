import { z } from "zod";

export const DrivingRouteSchema = z.object({
  driveDuration: z.string().min(3, "Drive duration is required."),
  notes: z.string().min(10, "Must have at least 10 characters.").optional(),
});

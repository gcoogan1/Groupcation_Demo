import { z } from "zod";

export const WalkingRouteSchema = z.object({
  walkDuration: z.string().min(3, "Walk duration is required."),
  notes: z.string().min(10, "Must have at least 10 characters.").optional(),
});

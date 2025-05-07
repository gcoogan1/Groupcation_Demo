import { z } from "zod";

export const drivingRouteSchema = z
  .object({
    driveDuration: z.string().min(3, "Drive duration is required."),
    departureLocation: z.string().min(2, "Departure location is required."),
    departureDate: z.date({ required_error: "Departure date is required." }),
    departureTime: z.date({ required_error: "Departure time is required." }),
    arrivalLocation: z.string().min(2, "Arrival location is required."),
    arrivalDate: z
      .date({ required_error: "Arrival date is required." })
      .optional(),
    notes: z
      .string()
      .min(10, "Must have at least 10 characters.")
      .nullable()
      .optional(),
  })
  .refine(
    (data) => {
      const departure = data.departureDate;
      const arrival = data.arrivalDate;

      // If either date is missing, skip validation
      if (!departure || !arrival) return true;

      if (!arrival) return true;

      // Zero out the time parts to compare only calendar date
      const depDateOnly = new Date(
        departure.getFullYear(),
        departure.getMonth(),
        departure.getDate()
      );
      const arrDateOnly = new Date(
        arrival.getFullYear(),
        arrival.getMonth(),
        arrival.getDate()
      );

      return arrDateOnly >= depDateOnly;
    },
    {
      path: ["arrivalDate"],
      message: "Arrival date must be the same day or after the departure date.",
    }
  );

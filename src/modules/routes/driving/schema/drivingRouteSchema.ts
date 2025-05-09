import { z } from "zod";

export const drivingRouteSchema = z
  .object({
    driveDuration: z
      .string({ required_error: "Drive duration is required." })
      .nonempty("Drive duration is required.")
      .min(4, "Must have at least 4 characters."),
    departureLocation: z
      .string({ required_error: "Departure location is required." })
      .nonempty("Departure location is required.")
      .min(5, "Must have at least 5 characters."),
    departureDate: z.date({ required_error: "Departure date is required." }),
    departureTime: z.date({ required_error: "Departure time is required." }),
    arrivalLocation: z
      .string({ required_error: "Arrival location is required." })
      .nonempty("Arrival location is required.")
      .min(5, "Must have at least 5 characters."),
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

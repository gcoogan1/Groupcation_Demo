import { z } from "zod";

export const busSchema = z
  .object({
    busRoute: z
      .string({ required_error: "Bus route is required." })
      .nonempty("Bus route is required.")
      .min(2, "Must have at least 2 characters."),
    busClass: z
      .string({ required_error: "Class is required." })
      .nonempty("Class is required.")
      .min(2, "Must have at least 2 characters."),
    departureBusStop: z
      .string({ required_error: "Departure bus stop is required." })
      .nonempty("Departure bus stop is required.")
      .min(3, "Must have at least 3 characters."),
    departureDate: z.date({ required_error: "Departure date is required." }),
    departureTime: z.date({ required_error: "Departure time is required." }),
    arrivalBusStop: z
      .string({ required_error: "Arrival bus stop is required." })
      .nonempty("Arrival bus stop is required.")
      .min(3, "Must have at least 3 characters."),
    arrivalDate: z.date({ required_error: "Arrival date is required." }),
    arrivalTime: z.date({ required_error: "Arrival time is required." }),
    travelers: z
      .array(
        z.object({
          value: z.number(),
          label: z.string(),
        })
      )
      .optional(),
    cost: z.string().nullable().optional(),
    attachments: z
      .array(
        z.object({
          id: z.union([z.string(), z.number()]).optional(),
          createdAt: z.string().optional(),
          fileName: z.string(),
          trainId: z.number().optional(),
          addedBy: z.number().optional(),
          file: z.instanceof(File).optional(),
          fileUrl: z.string().url("File URL is invalid"), // URL for preview
          fileType: z.string(), // file MIME type
          fileSize: z.number().min(0, "File size cannot be negative"), // in bytes
        })
      )
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
  )
  .refine(
    (data) => {
      const { departureDate, arrivalDate, departureTime, arrivalTime } = data;

      if (!departureDate || !arrivalDate || !departureTime || !arrivalTime) {
        return true;
      }

      const sameDay =
        departureDate.getFullYear() === arrivalDate.getFullYear() &&
        departureDate.getMonth() === arrivalDate.getMonth() &&
        departureDate.getDate() === arrivalDate.getDate();

      if (sameDay) {
        return arrivalTime > departureTime;
      }

      return true;
    },
    {
      path: ["arrivalTime"],
      message: "Arrival time must be after departure time.",
    }
  );

import { z } from "zod";

export const flightSchema = z
  .object({
    airline: z
      .string({
        required_error: "Name of airline is required.",
      })
      .nonempty("Name of airline is required.")
      .min(3, "Must have least 3 characters"),
    flightNumber: z
      .string()
      .min(3, "Must have at least 2 characters")
      .optional(),
    flightClass: z.enum(
      ["economy", "premiumEconomy", "business", "firstClass"],
      {
        errorMap: () => ({ message: "Flight class is required." }),
      }
    ),
    flightDuration: z
      .string({
        required_error: "Duration of flight is required.",
      })
      .nonempty("Duration of flight is required.")
      .min(6, "Must have at least 6 characters."),
    departureAirport: z
      .string({ required_error: "Departure airport is required." })
      .nonempty("Departure airport is required.")
      .min(3, "Must have at least 3 characters."),
    departureDate: z.date({ required_error: "Departure date is required." }),
    departureTime: z.date({ required_error: "Departure time is required." }),
    arrivalAirport: z
      .string({ required_error: "Arrival airport is required." })
      .nonempty("Arrival airport is required.")
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
          fileUrl: z.string().url("File URL is invalid"),
          fileType: z.string(),
          fileSize: z.number().min(0, "File size cannot be negative"),
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

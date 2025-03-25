import { z } from "zod";

export const flightSchema = z.object({
  departureAirport: z.string().min(2, "Departure airport is required."),
  departureDate: z.date({ required_error: "Departure date is required." }),
  departureTime: z.date({ required_error: "Departure time is required." }),
  arrivalAirport: z.string().min(2, "Arrival train station is required."),
  arrivalDate: z.date({ required_error: "Arrival date is required." }),
  arrivalTime: z.date({ required_error: "Arrival time is required." }),
  airline: z.string().min(3, "Train Line is required."),
  flightNumber: z.string().min(3, "Must have at least 2 characters").optional(),
  flightClass: z.enum(["economy" , "premiumEconomy" , "business" , "firstClass"], {
    errorMap: () => ({ message: "Class is required." }),
  }),
  travelers: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
      })
    )
    .optional(),
  cost: z.string().optional(),
  attachments: z
    .array(z.instanceof(File))
    .max(5, "You can upload a maximum of 5 files")
    .optional(),
  notes: z.string().min(10, "Must have at least 10 characters.").optional(),
});

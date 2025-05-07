import { z } from "zod";

export const boatSchema = z.object({
  boatCruiseLine: z.string().min(3, "Name of boat / cruise line is required."),
  boatCruiseClass: z.string().min(1, "Class is required."),
  departureDock: z.string().min(2, "Departure dock is required."),
  departureDate: z.date({ required_error: "Departure date is required." }),
  departureTime: z.date({ required_error: "Departure time is required." }),
  arrivalDock: z.string().min(2, "Arrival dock is required."),
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
  ).optional(),
notes: z.string().min(10, "Must have at least 10 characters.").nullable().optional()
}).refine((data) => {
  const departure = data.departureDate;
  const arrival = data.arrivalDate;

  // If either date is missing, skip validation
  if (!departure || !arrival) return true;

  // Zero out the time parts to compare only calendar date
  const depDateOnly = new Date(departure.getFullYear(), departure.getMonth(), departure.getDate());
  const arrDateOnly = new Date(arrival.getFullYear(), arrival.getMonth(), arrival.getDate());

  return arrDateOnly >= depDateOnly;
}, {
  path: ["arrivalDate"],
  message: "Arrival date must be the same day or after the departure date.",
});

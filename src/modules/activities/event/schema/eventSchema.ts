import { z } from "zod";

export const eventSchema = z.object({
  eventName: z.string().min(3, "Name of event is required."),
  eventLocation: z.string().min(1, "Event address is required."),
  startDate: z.date({ required_error: "Start date is required." }),
  startTime: z.date({ required_error: "Start time is required." }),
  endDate: z.date({ required_error: "End date is required." }),
  endTime: z.date({ required_error: "End time is required." }),
  eventOrganizer: z.string().min(3, "Name of event organizer is required."),
  ticketType: z.string().min(3, "Ticket type is required."),
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

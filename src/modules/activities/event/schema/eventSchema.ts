import { z } from "zod";

export const eventSchema = z
  .object({
    eventName: z
      .string({ required_error: "Name of event is required" })
      .nonempty("Name of event is required")
      .min(2, "Must have at least 2 characters."),
    eventLocation: z
      .string({ required_error: "Event address is required." })
      .nonempty("Event address is required." )
      .min(5, "Must have at least 5 characters."),
    startDate: z.date({ required_error: "Start date is required." }),
    startTime: z.date({ required_error: "Start time is required." }),
    endDate: z.date({ required_error: "End date is required." }),
    endTime: z.date({ required_error: "End time is required." }),
    eventOrganizer: z
      .string({ required_error: "Name of event organizer is required." })
      .nonempty("Name of event organizer is required.")
      .min(3, "Must have at least 3 characters."),
    ticketType: z
      .string({ required_error: "Ticket type is required." })
      .nonempty("Ticket type is required.")
      .min(3, "Must have at least 3 characters."),
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
      const startDate = data.startDate;
      const endDate = data.endDate;

      // If either date is missing, skip validation
      if (!startDate || !endDate) return true;

      // Zero out the time parts to compare only calendar date
      const startDateOnly = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate()
      );
      const endDateOnly = new Date(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate()
      );

      return endDateOnly >= startDateOnly;
    },
    {
      path: ["endDate"],
      message: "End date must be the same day or after the start date.",
    }
  )
  .refine(
    (data) => {
      const { startDate, endDate, startTime, endTime } = data;

      if (!startDate || !endDate || !startTime || !endTime) {
        return true;
      }

      const sameDay =
        startDate.getFullYear() === endDate.getFullYear() &&
        startDate.getMonth() === endDate.getMonth() &&
        startDate.getDate() === endDate.getDate();

      if (sameDay) {
        return endTime > startTime;
      }

      return true;
    },
    {
      path: ["endTime"],
      message: "End time must be after start time.",
    }
  );

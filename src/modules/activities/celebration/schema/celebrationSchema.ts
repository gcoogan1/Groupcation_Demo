import { z } from "zod";

export const celebrationSchema = z
  .object({
    celebrationName: z
      .string({ required_error: "Name of celebration is required." })
      .nonempty("Name of celebration is required." )
      .min(3, "Must have at least 3 characters."),
    celebrationLocation: z
      .string({ required_error: "Celebration address is required." })
      .nonempty("Celebration address is required.")
      .min(3, "Must have at least 3 characters."),
    startDate: z.date({ required_error: "Start date is required." }),
    startTime: z.date({ required_error: "Start time is required." }),
    endDate: z.date({ required_error: "End date is required." }),
    endTime: z.date({ required_error: "End time is required." }),
    celebrationType: z
      .string({ required_error: "Celebration type is required." })
      .nonempty("Celebration type is required.")
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

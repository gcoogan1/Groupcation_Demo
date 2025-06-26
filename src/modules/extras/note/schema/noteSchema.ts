import { z } from "zod";

export const NoteSchema = z.object({
  noteTitle: z
    .string({ required_error: "Title is required." })
    .nonempty("Title is required.")
    .min(5, "Must have at least 5 characters."),
  startDate: z.date({ required_error: "Date is required." }),
  startTime: z.date({ required_error: "Time is required." }),
  noteContent: z
    .string({ required_error: "Content is required." })
    .nonempty("Content is required.")
    .min(10, "Must be at least 10 characters long."),
  travelers: z
    .array(
      z.object({
        value: z.number(),
        label: z.string(),
      })
    )
    .optional(),
});

import { z } from "zod";

export const NoteSchema = z.object({
  noteTitle: z.string().min(5, "Title is required."),
  startDate: z.date({ required_error: "A date for the note is required." }),
  startTime: z.date({ required_error: "A time for the note is required." }),
  noteContent: z.string().min(10, "Content is required and must be at least 10 characters long."),
});

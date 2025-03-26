import { z } from "zod";

export const NoteSchema = z.object({
  noteTitle: z.string().min(5, "Title is required."),
  noteContent: z.string().min(10, "Content is required and must be at least 10 characters long."),
});

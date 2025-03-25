import { z } from "zod";

export const rentalSchema = z.object({
  rentalAgency: z.string().min(3, "Rental agency name is required."),
  carType: z.string().min(3, "Car type is required."),
  pickUpLocation: z.string().min(2, "Pick-up location is required."),
  pickUpDate: z.date({ required_error: "Pick-up date is required." }),
  pickUpTime: z.date({ required_error: "Pick-up time is required." }),
  dropOffLocation: z.string().min(2, "Must have at least 5 characters.").optional(),
  dropOffDate: z.date({ required_error: "Drop-off date is required." }),
  dropOffTime: z.date({ required_error: "Drop-off time is required." }),
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

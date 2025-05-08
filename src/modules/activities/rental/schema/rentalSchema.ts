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
  const pickUpDate = data.pickUpDate;
  const dropOffDate = data.dropOffDate;

  // If either date is missing, skip validation
  if (!pickUpDate || !dropOffDate) return true;

  // Zero out the time parts to compare only calendar date
  const pickUpOnly = new Date(pickUpDate.getFullYear(), pickUpDate.getMonth(), pickUpDate.getDate());
  const dropOffOnly = new Date(dropOffDate.getFullYear(), dropOffDate.getMonth(), dropOffDate.getDate());


  return dropOffOnly >= pickUpOnly;
}, {
  path: ["dropOffDate"],
  message: "Drop-off date must be the same day or after the pick-up date.",
}).refine(
  (data) => {
    const {
      pickUpDate,
      dropOffDate,
      pickUpTime,
      dropOffTime,
    } = data;

    if (!pickUpDate || !dropOffDate || !pickUpTime || !dropOffTime) {
      return true;
    }

    const sameDay =
      pickUpDate.getFullYear() === dropOffDate.getFullYear() &&
      pickUpDate.getMonth() === dropOffDate.getMonth() &&
      pickUpDate.getDate() === dropOffDate.getDate();

    if (sameDay) {
      return dropOffTime > pickUpTime;
    }

    return true;
  },
  {
    path: ["dropOffTime"],
    message:
      "Drop-off time must be after pick-up time.",
  }
);

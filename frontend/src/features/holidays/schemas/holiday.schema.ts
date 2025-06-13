import { z } from "zod";

// Schéma Zod pour la validation
export const holidaySchema = z.object({
  holidayName: z.string().min(1, "Le jour férié est requis"),
  holidayDescription: z.string().optional(),
  holidayDate: z.coerce
    .date()
    .refine((date) => date instanceof Date && !isNaN(date.getTime()), {
      message: "La date du jour férié est requise et doit être valide",
    }),
});

export type HolidayFormData = z.infer<typeof holidaySchema>;

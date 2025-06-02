import { z } from "zod";

// Schéma Zod pour la validation
export const holidaySchema = z.object({
  holidayName: z.string().min(1, "Le jour férié est requis"),
  holidayDescription: z.string().optional(),
  holidayDate: z
    .date({ message: "La date du jour férié est requise" })
    .refine((date) => date > new Date(), {
      message: "La date du jour férié doit être dans le futur",
    }),
});

export type HolidayFormData = z.infer<typeof holidaySchema>;

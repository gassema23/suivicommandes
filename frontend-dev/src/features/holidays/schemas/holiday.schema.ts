import { z } from "zod";

// Schéma Zod pour la validation
export const holidaySchema = z.object({
  holidayName: z.string().min(1, "Le jour férié est requis"),
  holidayDescription: z.string().optional(),
  holidayDate: z.date({
    required_error: "La date du jour férié est requise",
    invalid_type_error: "La date du jour férié n'est pas valide",
  }),
});

export type HolidayFormData = z.infer<typeof holidaySchema>;

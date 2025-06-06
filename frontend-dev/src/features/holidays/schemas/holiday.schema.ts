import { z } from "zod";

// Schéma Zod pour la validation
export const holidaySchema = z.object({
  holidayName: z.string().min(1, "Le jour férié est requis"),
  holidayDescription: z.string().optional(),
  holidayDate: z
    .union([
      z
        .string()
        .refine(
          (val) => !isNaN(Date.parse(val)),
          "La date du jour férié n'est pas valide"
        ),
      z.date(),
    ])
    .transform((val) => (typeof val === "string" ? new Date(val) : val)),
});

export type HolidayFormData = z.infer<typeof holidaySchema>;

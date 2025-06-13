import { z } from "zod";

// Schéma Zod pour la validation
export const conformityTypeSchema = z.object({
  conformityTypeName: z.string().min(1, "Le nom du type de conformité est requis"),
  conformityTypeDescription: z.string().default("0").optional(),
});

export type ConformityTypeFormData = z.infer<typeof conformityTypeSchema>;

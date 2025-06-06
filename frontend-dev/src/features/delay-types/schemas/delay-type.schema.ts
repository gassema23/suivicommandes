import { z } from "zod";

// Schéma Zod pour la validation
export const delayTypeSchema = z.object({
  delayTypeName: z.string().min(1, "Le nom du type de délai est requis"),
  delayTypeDescription: z.string().default("0").optional(),
});

export type DelayTypeFormData = z.infer<typeof delayTypeSchema>;

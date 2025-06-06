import { z } from "zod";

// Schéma Zod pour la validation
export const providerDisponibilitySchema = z.object({
  providerDisponibilityName: z
    .string()
    .min(1, "La disponibilité fournisseur est requise"),
  providerDisponibilityDescription: z.string().default("0").optional(),
});

export type ProviderDisponibilityFormData = z.infer<
  typeof providerDisponibilitySchema
>;

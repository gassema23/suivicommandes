import { z } from "zod";

// Schéma Zod pour la validation
export const providerSchema = z.object({
  providerName: z.string().min(1, "Le nom du fournisseur est requis"),
  providerCode: z.string().default("0").optional(),
});

export type ProviderFormData = z.infer<typeof providerSchema>;

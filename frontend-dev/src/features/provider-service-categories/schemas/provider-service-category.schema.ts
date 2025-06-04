import { z } from "zod";

// Schéma Zod pour la validation
export const providerServiceCategorySchema = z.object({
  providerId: z.string().min(1, "Le fournisseur est requis"),
  sectorId: z.string().optional(),
  serviceId: z.string().optional(),
  serviceCategoryId: z.string().min(1, "La catégorie de service est requise"),
});

export type ProviderServiceCategoryFormData = z.infer<
  typeof providerServiceCategorySchema
>;

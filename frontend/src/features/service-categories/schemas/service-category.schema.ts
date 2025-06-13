import { z } from "zod";

// Schéma Zod pour la validation
export const serviceCategorySchema = z.object({
  serviceCategoryName: z.string().min(1, "La catégorie du service est requise"),
  serviceId: z.string().min(1, "Le service est requis"),
  sectorId: z.string().optional(),
  isMultiLink: z.boolean().optional(),
  isMultiProvider: z.boolean().optional(),
  isRequiredExpertise: z.boolean().optional(),
  serviceCategoryDescription: z
    .string()
    .max(500, "La description ne peut pas dépasser 500 caractères")
    .optional(),
});

export type ServiceCategoryFormData = z.infer<typeof serviceCategorySchema>;

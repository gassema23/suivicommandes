import { z } from "zod";

// Schéma Zod pour la validation
export const requestTypeServiceCategorySchema = z.object({
  requestTypeId: z.string().min(1, "Le type de demande est requis"),
  sectorId: z.string().optional(),
  serviceId: z.string().optional(),
  serviceCategoryId: z.string().min(1, "La catégorie de service est requise"),
  availabilityDelay: z.number().optional(),
  minimumRequiredDelay: z.number().optional(),
  serviceActivationDelay: z.number().optional(),
});

export type RequestTypeServiceCategoryFormData = z.infer<
  typeof requestTypeServiceCategorySchema
>;

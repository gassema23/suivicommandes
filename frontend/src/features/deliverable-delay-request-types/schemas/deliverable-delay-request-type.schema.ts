import { z } from "zod";

// Schéma Zod pour la validation
export const deliverableDelayRequestTypeSchema = z.object({
  deliverableId: z.string().min(1, "Le type de livrable est requis"),
  sectorId: z.string().optional(),
  serviceId: z.string().optional(),
  serviceCategoryId: z.string().optional(),
  requestTypeServiceCategoryId: z
    .string()
    .min(1, "La catégorie de service par type de demande est requise"),
});

export type DeliverableDelayRequestTypeFormData = z.infer<
  typeof deliverableDelayRequestTypeSchema
>;

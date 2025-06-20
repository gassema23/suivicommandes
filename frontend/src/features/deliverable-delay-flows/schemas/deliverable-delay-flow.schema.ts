import { z } from "zod";

// Schéma Zod pour la validation
export const deliverableDelayFlowSchema = z.object({
  flowId: z.string().min(1, "Le flux de transmission est requis"),
  sectorId: z.string().optional(),
  serviceId: z.string().optional(),
  serviceCategoryId: z.string().optional(),
  requestTypeServiceCategoryId: z.string().optional(),
  deliverableDelayRequestTypeId: z.string().min(1, "Le livrable est requis"),
});

export type DeliverableDelayFlowFormData = z.infer<
  typeof deliverableDelayFlowSchema
>;

import { z } from "zod";

// Schéma Zod pour la validation
export const requisitionTypeSchema = z.object({
  requisitionTypeName: z.string().min(1, "Le nom du type de réquisition est requis"),
  requisitionTypeDescription: z.string().default("0").optional(),
});

export type RequisitionTypeFormData = z.infer<typeof requisitionTypeSchema>;

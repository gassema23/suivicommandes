import { z } from "zod";

// Schéma Zod pour la validation
export const requestTypeDelaySchema = z.object({
  sectorId: z.string().optional(),
  serviceId: z.string().optional(),
  serviceCategoryId: z.string().optional(),
  requestTypeServiceCategoryId: z
    .string()
    .min(1, "Le type de demande est requis."),
  delayTypeId: z.string().min(1, "Le type de délai est requis."),
  delayValue: z
    .number()
    .optional()
    .refine((val) => val === undefined || val >= 0, {
      message: "La valeur du délai doit être positive.",
    }),
});

export type RequestTypeDelayFormData = z.infer<typeof requestTypeDelaySchema>;
import { z } from "zod";

// Schéma Zod pour la validation
export const serviceSchema = z.object({
  serviceName: z.string().min(1, "Le service est requis"),
  sectorId: z.string().min(1, "Le secteur est requis"),
  serviceDescription: z.string().max(500, "La description ne peut pas dépasser 500 caractères").optional(),
});

export type ServiceFormData = z.infer<typeof serviceSchema>;

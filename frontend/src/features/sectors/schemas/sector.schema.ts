import { z } from "zod";

// Schéma Zod pour la validation
export const sectorSchema = z.object({
  sectorName: z.string().min(1, "Le secteur est requis"),
  sectorClientTimeEnd: z.string().optional(),
  sectorProviderTimeEnd: z.string().optional(),
  isAutoCalculate: z.boolean().optional(),
  isConformity: z.boolean().optional(),
  sectorDescription: z.string().max(500, "La description ne peut pas dépasser 500 caractères").optional(),
});

export type SectorFormData = z.infer<typeof sectorSchema>;

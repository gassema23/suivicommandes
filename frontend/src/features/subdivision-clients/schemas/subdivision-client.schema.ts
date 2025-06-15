import { z } from "zod";

// Schéma Zod pour la validation
export const subdivisionClientSchema = z.object({
  subdivisionClientName: z.string().optional(),
  subdivisionClientNumber: z.string().min(1, "La subdivision client est requise"),
  clientId: z.string().min(1, "Le client est requis"),
});

export type SubdivisionClientFormData = z.infer<typeof subdivisionClientSchema>;

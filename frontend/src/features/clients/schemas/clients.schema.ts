import { z } from "zod";

// Schéma Zod pour la validation
export const clientSchema = z.object({
  clientName: z.string().optional(),
  clientNumber: z.string().min(1, "L'identifiant du client est requis"),
});

export type ClientFormData = z.infer<typeof clientSchema>;

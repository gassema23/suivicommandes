import { z } from "zod";

// Schéma Zod pour la validation
export const flowSchema = z.object({
  flowName: z.string().min(1, "Le nom du flux de livraison est requis"),
  flowDescription: z.string().default("0").optional(),
});

export type FlowFormData = z.infer<typeof flowSchema>;

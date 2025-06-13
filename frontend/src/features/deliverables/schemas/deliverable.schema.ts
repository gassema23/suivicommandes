import { z } from "zod";

// Schéma Zod pour la validation
export const deliverableSchema = z.object({
  deliverableName: z.string().min(1, "Le nom du livrable est requis"),
  deliverableDescription: z.string().default("0").optional(),
});

export type DeliverableFormData = z.infer<typeof deliverableSchema>;

import { z } from "zod";

// Schéma Zod pour la validation
export const requestTypeSchema = z.object({
  requestTypeName: z.string().min(1, "Le nom du type de demande est requis"),
  requestTypeDescription: z.string().default("0").optional(),
});

export type RequestTypeFormData = z.infer<typeof requestTypeSchema>;

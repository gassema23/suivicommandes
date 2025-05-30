import { z } from "zod";

// Schéma Zod pour la validation
export const teamSchema = z.object({
  teamName: z.string().min(1, "Le nom est requis"),
  teamDescription: z.string().optional(),
  ownerId: z.string().min(1, "Le propriétaire est requis"),
});

export type TeamFormData = z.infer<typeof teamSchema>;

import { z } from "zod";

export const userSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  roleId: z.string().min(1, "Le rôle est requis"),
  teamId: z.string().min(1, "L'équipe est requise"),
});

export type UserFormData = z.infer<typeof userSchema>;
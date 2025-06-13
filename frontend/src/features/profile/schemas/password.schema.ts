import { z } from "zod";

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Le mot de passe actuel est requis."),
    newPassword: z.string().min(8, "Le nouveau mot de passe doit contenir au moins 8 caractères."),
    confirmPassword: z.string().min(1, "La confirmation du mot de passe est requise."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  });

export type PasswordFormData = z.infer<typeof passwordSchema>;
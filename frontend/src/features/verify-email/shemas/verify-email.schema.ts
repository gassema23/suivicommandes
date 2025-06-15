import { z } from "zod";

export const VerifyEmailSchema = z.object({
  email: z.string().email("Courriel invalide"),
  password: z.string().min(1, "Le mot de passe est requis"),
  confirmPassword: z.string().min(1, "Le mot de passe est requis"),
});

export type VerifyEmailFormData = z.infer<typeof VerifyEmailSchema>;

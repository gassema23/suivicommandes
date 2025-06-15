import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .email("Veuillez entrer une adresse courriel valide.")
    .nonempty("L'adresse courriel est requise."),
  password: z.string().min(1, "Le mot de passe est requis."),
});

export type LoginFormData = z.infer<typeof loginSchema>;

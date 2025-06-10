import { z } from "zod";

export const userInformationSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis."),
  lastName: z.string().min(1, "Le nom de famille est requis."),
  email: z
    .string()
    .min(1, "L'adresse courriel est requise.")
    .email("Veuillez entrer une adresse courriel valide."),
});

export type UserInformationFormData = z.infer<typeof userInformationSchema>;
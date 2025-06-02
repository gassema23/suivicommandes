import { z } from "zod";

export const userInformationSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide"),
});

export type UserInformationFormData = z.infer<typeof userInformationSchema>;
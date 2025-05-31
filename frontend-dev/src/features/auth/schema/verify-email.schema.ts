import { z, ZodType } from "zod";

export interface FormData {
  email: string;
  password: string;
}

export const VerifyEmailSchema: ZodType<FormData> = z.object({
  email: z.string().email("Courriel invalide"),
  password: z.string().min(1, "Le mot de passe est requis"),
  confirmPassword: z.string().min(1, "Le mot de passe est requis"),
});

export type VerifyEmailFormData = z.infer<typeof VerifyEmailSchema>;
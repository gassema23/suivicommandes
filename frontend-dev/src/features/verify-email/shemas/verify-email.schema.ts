import { z } from "zod";

// Schema de validation pour les paramètres
export const verifyEmailParamsSchema = z.object({
  token: z.string().min(1, "Token requis"),
});

export type VerifyEmailParams = z.infer<typeof verifyEmailParamsSchema>;
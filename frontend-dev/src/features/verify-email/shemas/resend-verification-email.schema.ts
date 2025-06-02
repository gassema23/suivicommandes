import { z } from "zod";


export const resendVerificationEmailSchema = z.object({
  email: z.string().min(1, "Adresse courriel requis"),
});

export type ResendVerificationEmail= z.infer<typeof resendVerificationEmailSchema>;
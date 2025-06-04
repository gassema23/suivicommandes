import { z, ZodType } from "zod";

export interface FormData {
  code: string;
}

export const TwoFactorSchema: ZodType<FormData> = z.object({
  code: z
    .string()
    .min(6, "Le code doit contenir exactement 6 caractères")
    .max(6, "Le code doit contenir exactement 6 caractères")
    .regex(/^\d+$/, "Le code doit être numérique"),
});

export type TwoFactorData = z.infer<typeof TwoFactorSchema>;

import type { FieldConfig } from "@/types/field.type";
import type { PasswordFormData } from "../schemas/password.schema";

export const profileSecurityFields: FieldConfig<PasswordFormData>[] = [
  {
    name: "currentPassword",
    label: "Mot de passe actuel",
    component: "password",
    type: "password",
    required: true,
  },
  {
    name: "newPassword",
    label: "Nouveau mot de passe",
    component: "password",
    type: "text",
    required: true,
  },
  {
    name: "confirmPassword",
    label: "Confirmer le mot de passe",
    component: "password",
    type: "password",
    required: true,
  },
];

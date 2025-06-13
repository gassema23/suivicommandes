import type { FieldConfig } from "@/types/field.type";
import type { UserInformationFormData } from "../schemas/user-information.schema";

export const profileInformationFields: FieldConfig<UserInformationFormData>[] = [
  {
    name: "firstName",
    label: "Prénom",
    component: "input",
    type: "text",
    placeholder: "Prénom",
    required: true,
  },
  {
    name: "lastName",
    label: "Nom de famille",
    component: "input",
    type: "text",
    placeholder: "Nom de famille",
    required: true,
  },
  {
    name: "email",
    label: "Adresse courriel",
    component: "input",
    type: "email",
    placeholder: "Adresse courriel",
    required: true,
  },
];

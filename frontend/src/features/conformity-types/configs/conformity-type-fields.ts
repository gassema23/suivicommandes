import type { FieldConfig } from "@/types/field.type";
import type { ConformityTypeFormData } from "../schemas/conformity-type.schema";

export const conformityTypeFields:FieldConfig<ConformityTypeFormData>[] = [
  {
    name: "conformityTypeName",
    label: "Type de conformité",
    component: "input",
    type: "text",
    placeholder: "Type de conformité",
    required: true,
  },
  {
    name: "conformityTypeDescription",
    label: "Description",
    component: "textarea",
    placeholder: "Description du type de conformité",
    rows: 3,
  },
];

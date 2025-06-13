import type { FieldConfig } from "@/types/field.type";
import type { DelayTypeFormData } from "../schemas/delay-type.schema";

export const delayTypeFields:FieldConfig<DelayTypeFormData>[] = [
  {
    name: "delayTypeName",
    label: "Type de délai",
    component: "input",
    type: "text",
    placeholder: "Type de délai",
    required: true,
  },
  {
    name: "delayTypeDescription",
    label: "Description",
    component: "textarea",
    placeholder: "Description du type de délai",
    rows: 3,
  },
];

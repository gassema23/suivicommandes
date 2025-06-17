import type { FieldConfig } from "@/types/field.type";
import type { RequestTypeFormData } from "../schemas/request-type.schema";

export const requestTypeFields: FieldConfig<RequestTypeFormData>[] = [
  {
    name: "requestTypeName",
    label: "Type de demande",
    component: "input",
    type: "text",
    placeholder: "Type de demande",
    required: true,
  },
  {
    name: "requestTypeDescription",
    label: "Description",
    component: "textarea",
    placeholder: "Description du type de demande",
    rows: 3,
  },
];

import type { FieldConfig } from "@/types/field.type";
import type { DeliverableFormData } from "../schemas/deliverable.schema";

export const deliverableFields:FieldConfig<DeliverableFormData>[] = [
  {
    name: "deliverableName",
    label: "Livrable",
    component: "input",
    type: "text",
    placeholder: "Livrable",
    required: true,
  },
  {
    name: "deliverableDescription",
    label: "Description",
    component: "textarea",
    placeholder: "Description du livrable",
    rows: 3,
  },
];

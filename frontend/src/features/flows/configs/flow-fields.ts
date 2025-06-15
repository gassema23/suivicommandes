import type { FieldConfig } from "@/types/field.type";
import type { FlowFormData } from "../schemas/flow.schema";

export const flowFields: FieldConfig<FlowFormData>[] = [
  {
    name: "flowName",
    label: "Flux de transmission",
    component: "input",
    type: "text",
    placeholder: "Flux de transmission",
    required: true,
  },
  {
    name: "flowDescription",
    label: "Description",
    component: "textarea",
    placeholder: "Description du flux de transmission",
    rows: 3,
  },
];

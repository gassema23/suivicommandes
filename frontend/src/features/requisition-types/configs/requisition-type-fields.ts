import type { FieldConfig } from "@/types/field.type";
import type { RequisitionTypeFormData } from "../schemas/requisition-type.schema";

export const requisitionTypeFields: FieldConfig<RequisitionTypeFormData>[] = [
  {
    name: "requisitionTypeName",
    label: "Type de réquisition",
    component: "input",
    type: "text",
    placeholder: "Type de réquisition",
    required: true,
  },
  {
    name: "requisitionTypeDescription",
    label: "Description",
    component: "textarea",
    placeholder: "Description du type de réquisition",
    rows: 3,
  },
];

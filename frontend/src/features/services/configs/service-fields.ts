import type { FieldConfig } from "@/types/field.type";
import type { ServiceFormData } from "../schemas/service.schema";

export const serviceFields: FieldConfig<ServiceFormData>[] = [
  {
    name: "sectorId",
    label: "Secteur",
    component: "select-sector",
    placeholder: "Sélectionner un secteur",
    required: true,
  },
  {
    name: "serviceName",
    label: "Service",
    component: "input",
    type: "text",
    placeholder: "Nom du service",
    required: true,
  },
  {
    name: "serviceDescription",
    label: "Description",
    component: "textarea",
    rows: 3,
    placeholder: "Description du service",
  },
];

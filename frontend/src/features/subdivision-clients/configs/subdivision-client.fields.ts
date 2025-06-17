import type { FieldConfig } from "@/types/field.type";
import type { SubdivisionClientFormData } from "../schemas/subdivision-client.schema";

export const subdivisionClientFields: FieldConfig<SubdivisionClientFormData>[] = [
  {
    name: "clientId",
    label: "Client",
    component: "select-client",
    placeholder: "Sélectionner un client",
    required: true,
  },
  {
    name: "subdivisionClientName",
    label: "Subdivision client",
    component: "input",
    type: "text",
    placeholder: "Nom de la subdivision client",
    required: false,
  },
  {
    name: "subdivisionClientNumber",
    label: "Identifiant de la subdivision client",
    component: "input",
    type: "text",
    placeholder: "Identifiant de la subdivision client",
    required: true,
  },
];

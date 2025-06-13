import type { FieldConfig } from "@/types/field.type";
import type { ClientFormData } from "../schemas/clients.schema";

export const clientFields: FieldConfig<ClientFormData>[] = [
  {
    name: "clientName",
    label: "Client",
    component: "input",
    type: "text",
    placeholder: "Nom du client",
  },
  {
    name: "clientNumber",
    label: "Identifiant du client",
    component: "input",
    type: "text",
    placeholder: "Identifiant client",
    required: true,
  },
];

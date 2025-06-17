import type { FieldConfig } from "@/types/field.type";
import type { ProviderFormData } from "../schemas/provider.schema";

export const providerFields: FieldConfig<ProviderFormData>[] = [
  {
    name: "providerName",
    label: "Fournisseur",
    component: "input",
    type: "text",
    placeholder: "Nom du fournisseur",
    required: true,
  },
  {
    name: "providerCode",
    label: "Identifiant du fournisseur",
    component: "input",
    type: "text",
    placeholder: "Identifiant du fournisseur",
    required: true,
  },
];

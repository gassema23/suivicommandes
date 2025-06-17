import type { FieldConfig } from "@/types/field.type";
import type { ProviderDisponibilityFormData } from "../schemas/provider-disponibility.schema";

export const providerDisponibilityFields: FieldConfig<ProviderDisponibilityFormData>[] =
  [
    {
      name: "providerDisponibilityName",
      label: "Disponibilité fournisseur",
      component: "input",
      type: "text",
      placeholder: "Disponibilité fournisseur",
      required: true,
    },
    {
      name: "providerDisponibilityDescription",
      label: "Description",
      component: "textarea",
      placeholder: "Description de la disponibilité fournisseur",
      rows: 3,
    },
  ];

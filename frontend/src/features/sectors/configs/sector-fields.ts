import type { FieldConfig } from "@/types/field.type";
import type { SectorFormData } from "../schemas/sector.schema";

export const sectorFields: FieldConfig<SectorFormData>[] = [
  {
    name: "sectorName",
    label: "Secteur",
    type: "text",
    placeholder: "Nom du secteur",
    component: "input",
    required: true,
  },
  {
    name: "sectorClientTimeEnd",
    label: "Heure de tombée client",
    type: "time",
    component: "input",
  },
  {
    name: "sectorProviderTimeEnd",
    label: "Heure de tombée fournisseur",
    type: "time",
    component: "input",
  },
  {
    name: "isAutoCalculate",
    label: "Calcul automatique",
    component: "switch",
  },
  {
    name: "isConformity",
    label: "Conformité obligatoire",
    component: "switch",
  },
  {
    name: "sectorDescription",
    label: "Description",
    component: "textarea",
    placeholder: "Description du secteur",
    rows: 3,
  },
];

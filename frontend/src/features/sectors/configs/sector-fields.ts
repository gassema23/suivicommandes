import type { SectorFormData } from "../schemas/sector.schema";

type SectorField = {
  name: keyof SectorFormData;
  label: string;
  type?: string;
  placeholder?: string;
  component: "input" | "textarea" | "switch";
  rows?: number;
  required?: boolean;
};

export const sectorFields: SectorField[] = [
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

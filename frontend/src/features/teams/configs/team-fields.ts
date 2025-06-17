import type { FieldConfig } from "@/types/field.type";
import type { TeamFormData } from "../schemas/team.schema";

export const teamFields: FieldConfig<TeamFormData>[] = [
  {
    name: "ownerId",
    label: "Propriétaire",
    component: "select-team-owner",
    placeholder: "Sélectionner un propriétaire",
  },
  {
    name: "teamName",
    label: "Équipe",
    component: "input",
    type: "text",
    placeholder: "Nom de l'équipe",
  },
  {
    name: "teamDescription",
    label: "Description",
    component: "textarea",
    rows: 3,
    placeholder: "Description de l'équipe",
  },
];

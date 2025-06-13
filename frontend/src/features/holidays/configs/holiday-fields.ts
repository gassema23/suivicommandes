import type { FieldConfig } from "@/types/field.type";
import type { HolidayFormData } from "../schemas/holiday.schema";

export const holidayFields: FieldConfig<HolidayFormData>[] = [
  {
    name: "holidayName",
    label: "Fournisseur",
    component: "input",
    type: "text",
    placeholder: "Jour férié",
    required: true,
  },
  {
    name: "holidayDate",
    label: "Date du jour férié",
    component: "date-picker",
    required: true,
  },
  {
    name: "holidayDescription",
    label: "Description",
    component: "textarea",
    placeholder: "Description du jour férié",
    rows: 3,
  },
];

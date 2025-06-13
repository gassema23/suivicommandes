export type FieldConfig<T extends object> = {
  name: keyof T;
  label: string;
  type?: string;
  placeholder?: string;
  component: "input" | "textarea" | "switch" | "date-picker" | "password";
  rows?: number;
  required?: boolean;
};

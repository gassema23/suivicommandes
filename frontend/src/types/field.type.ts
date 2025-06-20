export type FieldConfig<T extends object> = {
  name: keyof T;
  label: string;
  type?: string;
  placeholder?: string;
  component:
    | "input"
    | "textarea"
    | "switch"
    | "date-picker"
    | "password"
    | "slider"
    | "select-sector"
    | "select-service"
    | "select-service-category"
    | "select-provider"
    | "select-request-type-service-category"
    | "select-delay-type"
    | "select-request-type"
    | "select-client"
    | "select-team-owner"
    | "select-deliverable"
    | "select-deliverable-delay-request-type"
    | "select-flow";
  rows?: number;
  required?: boolean;
  min?: number;
};

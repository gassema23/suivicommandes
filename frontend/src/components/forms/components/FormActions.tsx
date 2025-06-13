import { Button } from "@/components/ui/quebec/Button";
import type { ReactNode } from "react";

interface FormActionsProps {
  isLoading?: boolean;
  onCancel: () => void;
  cancelLabel?: string;
  submitLabel?: string;
  disabled?: boolean;
  children?: ReactNode;
}

export function FormActions({
  isLoading = false,
  onCancel,
  cancelLabel = "Annuler",
  submitLabel = "Enregistrer",
  disabled = false,
  children,
}: FormActionsProps) {
  return (
    <div className="flex gap-4 justify-end">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isLoading || disabled}
      >
        {cancelLabel}
      </Button>
      <Button
        type="submit"
        disabled={isLoading || disabled}
        isLoading={isLoading}
      >
        {isLoading ? "Enregistrement..." : submitLabel}
      </Button>
      {children}
    </div>
  );
}
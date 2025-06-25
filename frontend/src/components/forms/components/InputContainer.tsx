import { Label } from "@/components/ui/shadcn/label";
import React from "react";

type InputContainerProps = {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
} & React.ComponentProps<typeof Label>;

export default function InputContainer({
  label,
  error,
  children,
  required = false,
  ...labelProps
}: InputContainerProps) {
  return (
    <div className="grid grid-cols-12 gap-2 items-center">
      <Label className="col-span-12 xl:col-span-4" {...labelProps}>
        {label}
        {required && <span className="text-destructive font-semibold">*</span>}
      </Label>
      <div className="col-span-12 xl:col-span-8">
        {children}
        {error && <p className="text-destructive text-xs mt-0.5">{error}</p>}
      </div>
    </div>
  );
}

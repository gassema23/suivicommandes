import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Spinner } from "../loader/Spinner";

// Déplace ceci dans un fichier externe (ex: button-variants.ts) si tu veux éviter le warning React Refresh
const buttonVariants = cva("btn", {
  variants: {
    variant: {
      default: "btn-primary",
      destructive: "btn-destructive",
      outline: "btn-outline",
      secondary: "btn-secondary",
      ghost: "btn-ghost",
      link: "text-primary underline-offset-4 hover:underline",
      success: "bg-success text-success-foreground hover:bg-success/90",
      warning: "bg-warning text-warning-foreground hover:bg-warning/90",
    },
    size: {
      default: "h-10 px-4 py-2",
      sm: "h-9 px-3 text-xs",
      lg: "h-11 px-8 text-base",
      icon: "h-10 w-10",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "disabled">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const isDisabled = disabled || isLoading;

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          isLoading && "opacity-70 pointer-events-none"
        )}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {asChild ? (
          <span className="flex items-center">
            {isLoading && <Spinner size="sm" className="mr-2" variant="white" />}
            {children}
          </span>
        ) : (
          <>
            {isLoading && <Spinner size="sm" className="mr-2" variant="white" />}
            {children}
          </>
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button };
// ⚠️ Si tu veux éviter le warning React Refresh, exporte ceci ailleurs :
// export { buttonVariants } depuis un fichier séparé (ex: button-variants.ts)

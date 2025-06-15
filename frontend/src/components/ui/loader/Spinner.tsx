import type React from "react"
import { cn } from "@/lib/utils"

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
  variant?: "default" | "primary" | "secondary" | "white"
}

export function Spinner({ size = "md", variant = "default", className, ...props }: SpinnerProps) {
  return (
    <div
      className={cn(
        "inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent",
        {
          "h-4 w-4": size === "sm",
          "h-6 w-6": size === "md",
          "h-8 w-8": size === "lg",
          "text-muted": variant === "white",
          "text-muted-foreground": variant === "default",
          "text-primary": variant === "primary",
          "text-secondary": variant === "secondary",
        },
        className,
      )}
      role="status"
      aria-label="Chargement"
      {...props}
    >
      <span className="sr-only">Chargement...</span>
    </div>
  )
}
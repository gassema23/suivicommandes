import * as React from "react"
import { cn } from "@/lib/utils"

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "destructive" | "success" | "warning"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div 
      className={cn(
        "badge",
        variant === "default" && "badge-primary",
        variant === "secondary" && "badge-secondary",
        variant === "outline" && "badge-outline",
        variant === "destructive" && "badge-destructive",
        variant === "success" && "badge-success",
        variant === "warning" && "badge-warning",
        className
      )} 
      {...props} 
    />
  )
}

export { Badge }
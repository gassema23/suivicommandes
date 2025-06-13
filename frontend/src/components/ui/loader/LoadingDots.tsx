import { cn } from "@/lib/utils"

interface LoadingDotsProps {
  color?: string
  size?: "sm" | "md" | "lg"
  className?: string
}

export function LoadingDots({ color = "currentColor", size = "md", className }: LoadingDotsProps) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)} role="status" aria-label="Chargement">
      <span
        className={cn("animate-bounce rounded-full", {
          "h-1 w-1": size === "sm",
          "h-2 w-2": size === "md",
          "h-3 w-3": size === "lg",
        })}
        style={{ backgroundColor: color, animationDelay: "0ms" }}
      />
      <span
        className={cn("animate-bounce rounded-full", {
          "h-1 w-1": size === "sm",
          "h-2 w-2": size === "md",
          "h-3 w-3": size === "lg",
        })}
        style={{ backgroundColor: color, animationDelay: "150ms" }}
      />
      <span
        className={cn("animate-bounce rounded-full", {
          "h-1 w-1": size === "sm",
          "h-2 w-2": size === "md",
          "h-3 w-3": size === "lg",
        })}
        style={{ backgroundColor: color, animationDelay: "300ms" }}
      />
      <span className="sr-only">Chargement...</span>
    </span>
  )
}

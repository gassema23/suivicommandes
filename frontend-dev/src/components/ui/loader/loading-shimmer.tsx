import type React from "react"
import { cn } from "@/lib/utils"

interface ShimmerProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number
  height?: string | number
  rounded?: boolean | string
}

export default function Shimmer({ width = "100%", height = "16px", rounded = "md", className, ...props }: ShimmerProps) {
  const roundedClass = typeof rounded === "boolean" ? (rounded ? "rounded-full" : "") : `rounded-${rounded}`

  return (
    <div
      className={cn("relative overflow-hidden bg-muted", roundedClass, className)}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
      }}
      {...props}
    >
      <div
        className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite]"
        style={{
          background: "linear-gradient(90deg, transparent, hsl(var(--muted-foreground) / 0.1), transparent)",
        }}
      />
    </div>
  )
}



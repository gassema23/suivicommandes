import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface LoadingProgressProps {
  className?: string
  duration?: number
  color?: string
  height?: number
}

export function LoadingProgress({
  className,
  duration = 2000,
  color = "hsl(var(--primary))",
  height = 3,
}: LoadingProgressProps) {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(100)

      const hideTimer = setTimeout(() => {
        setVisible(false)
      }, 200)

      return () => clearTimeout(hideTimer)
    }, 200)

    return () => clearTimeout(timer)
  }, [duration])

  if (!visible) return null

  return (
    <div
      className={cn("fixed top-0 left-0 right-0 z-50", className)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
    >
      <div
        className="transition-all ease-out duration-2000"
        style={{
          height: `${height}px`,
          width: `${progress}%`,
          backgroundColor: color,
          transition: `width ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        }}
      />
    </div>
  )
}

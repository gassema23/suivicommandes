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
  duration = 3000,
  color = "hsl(var(--primary))",
  height = 5,
}: LoadingProgressProps) {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    setProgress(0)
    setVisible(true)

    // Lance l'animation vers 100%
    const progressTimer = setTimeout(() => {
      setProgress(100)
    }, 50) // petit délai pour déclencher la transition

    // Cache la barre après la durée d'animation
    const hideTimer = setTimeout(() => {
      setVisible(false)
    }, duration + 200) // 200ms pour laisser la transition finir

    return () => {
      clearTimeout(progressTimer)
      clearTimeout(hideTimer)
    }
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
        className="transition-all ease-out"
        style={{
          height: `${height}px`,
          width: `${progress}%`,
          backgroundColor: color,
          opacity: "65%",
          transition: `width ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        }}
      />
    </div>
  )
}
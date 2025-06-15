"use client";

import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/providers/theme.provider";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={cn(
        "flex w-16 h-8 p-1 rounded-full cursor-pointer transition-all duration-300 bg-muted border border-border",
        className
      )}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      role="button"
      tabIndex={0}
    >
      <div className="flex justify-between items-center w-full">
        <div
          className={cn(
            "flex justify-center items-center w-6 h-6 rounded-full transition-transform duration-300 bg-muted-foreground",
            isDark
              ? "transform translate-x-0"
              : "transform translate-x-8"
          )}
        >
          {isDark ? (
            <Moon className="w-4 h-4" strokeWidth={1.5} />
          ) : (
            <Sun className="w-4 h-4" strokeWidth={1.5} />
          )}
        </div>
        <div
          className={cn(
            "flex justify-center items-center w-6 h-6 rounded-full transition-transform duration-300",
            isDark ? "bg-transparent" : "transform -translate-x-8"
          )}
        >
          {isDark ? (
            <Sun className="w-4 h-4 " strokeWidth={1.5} />
          ) : (
            <Moon className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
          )}
        </div>
      </div>
    </div>
  );
}

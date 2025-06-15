import * as React from "react"
import { ChevronLeft } from 'lucide-react'
import { cn } from "@/lib/utils"
import { QuebecLink } from "./QuebecLink"

export interface BreadcrumbItem {
  label: string
  href: string
  isCurrent?: boolean
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Fil d'Ariane" className={cn("breadcrumb", className)}>
      <ol className="breadcrumb-list">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <li aria-hidden="true" className="breadcrumb-separator">
                <ChevronLeft className="h-4 w-4" />
              </li>
            )}
            <li className="breadcrumb-item">
              {item.isCurrent ? (
                <span className="breadcrumb-page" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <QuebecLink href={item.href} className="breadcrumb-link">
                  {item.label}
                </QuebecLink>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  )
}
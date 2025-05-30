"use client"
import * as React from "react"
import { ExternalLink, FileText } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Link } from '@tanstack/react-router'

export type LinkVariant = "default" | "button" | "nav" | "footer" | "breadcrumb"
export type LinkType = "internal" | "external" | "document"

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  children: React.ReactNode
  variant?: LinkVariant
  linkType?: LinkType
  fileType?: string
  fileSize?: string
  icon?: React.ReactNode
  showExternalIcon?: boolean
  showDocumentIcon?: boolean
  isActive?: boolean
  className?: string
}

/**
 * Composant Link qui respecte les directives du système de design du Québec
 */
export const QuebecLink = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      href,
      children,
      variant = "default",
      linkType,
      fileType,
      fileSize,
      icon,
      showExternalIcon = true,
      showDocumentIcon = true,
      isActive = false,
      className,
      ...props
    },
    ref
  ) => {
    // Détermine automatiquement le type de lien si non spécifié
    const determinedLinkType = React.useMemo(() => {
      if (linkType) return linkType
      
      if (href.startsWith("/") || href.startsWith("#") || href === "") {
        return "internal"
      }
      
      if (
        href.endsWith(".pdf") ||
        href.endsWith(".doc") ||
        href.endsWith(".docx") ||
        href.endsWith(".xls") ||
        href.endsWith(".xlsx") ||
        href.endsWith(".ppt") ||
        href.endsWith(".pptx") ||
        href.endsWith(".zip")
      ) {
        return "document"
      }
      
      return "external"
    }, [href, linkType])
    
    // Détermine le type de fichier si c'est un document
    const determinedFileType = React.useMemo(() => {
      if (fileType) return fileType
      
      if (determinedLinkType === "document") {
        const extension = href.split(".").pop()?.toUpperCase()
        return extension || ""
      }
      
      return ""
    }, [determinedLinkType, fileType, href])
    
    // Construit les classes CSS en fonction de la variante
    const linkClasses = cn(
      // Styles de base pour tous les liens
      "relative inline-flex items-center gap-1 font-medium transition-colors",
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      
      // Variantes de style
      variant === "default" && [
        "text-primary hover:text-primary/80 underline underline-offset-4",
        "dark:text-primary dark:hover:text-primary/80",
      ],
      variant === "button" && [
        "px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 no-underline",
        "dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90",
      ],
      variant === "nav" && [
        "text-foreground hover:text-primary no-underline",
        "dark:text-foreground dark:hover:text-primary",
        isActive && "text-primary font-semibold dark:text-primary",
      ],
      variant === "footer" && [
        "text-muted-foreground hover:text-foreground no-underline",
        "dark:text-muted-foreground dark:hover:text-foreground",
      ],
      variant === "breadcrumb" && [
        "text-muted-foreground hover:text-foreground no-underline text-sm",
        "dark:text-muted-foreground dark:hover:text-foreground",
      ],
      
      className
    )
    
    // Contenu du lien avec icônes et informations supplémentaires
    const linkContent = (
      <>
        {icon && <span className="inline-flex">{icon}</span>}
        <span>{children}</span>
        
        {/* Icône pour les liens externes */}
        {determinedLinkType === "external" && showExternalIcon && (
          <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        )}
        
        {/* Icône pour les documents */}
        {determinedLinkType === "document" && showDocumentIcon && (
          <FileText className="h-4 w-4 shrink-0" aria-hidden="true" />
        )}
        
        {/* Information sur le type et la taille du fichier */}
        {determinedLinkType === "document" && (determinedFileType || fileSize) && (
          <span className="text-xs text-muted-foreground ml-1">
            {determinedFileType && `(${determinedFileType}`}
            {fileSize && determinedFileType && `, ${fileSize}`}
            {fileSize && !determinedFileType && `(${fileSize}`}
            {(determinedFileType || fileSize) && ")"}
          </span>
        )}
      </>
    )
    
    // Attributs communs pour tous les types de liens
    const commonProps = {
      className: linkClasses,
      ref,
      ...props,
    }
    
    // Attributs spécifiques pour les liens externes
    const externalProps =
      determinedLinkType === "external"
        ? {
            target: "_blank",
            rel: "noopener noreferrer",
            "aria-label": `${children} (s'ouvre dans une nouvelle fenêtre)`,
          }
        : {}
    
    // Rendu du lien en fonction de son type
    if (determinedLinkType === "internal" && href.startsWith("/")) {
      return (
        <Link to={href} {...commonProps}>
          {linkContent}
        </Link>
      )
    }
    
    return (
      <Link to={href} {...commonProps} {...externalProps}>
        {linkContent}
      </Link>
    )
  }
)
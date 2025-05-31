"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Link } from "@tanstack/react-router"

type PaginationVariant = "numeric" | "alphabetic" | "condensed"

interface PaginationProps {
  // Propriétés communes
  variant?: PaginationVariant
  className?: string
  baseUrl?: string

  // Pour la variante numérique
  currentPage?: number
  totalPages?: number
  onPageChange?: (page: number) => void
  onLetterChange?: (letter: string) => void

  // Pour la variante alphabétique
  currentLetter?: string

  // Pour la variante condensée
  currentItem?: number
  totalItems?: number
}

export function Pagination({
  variant = "numeric",
  className,
  baseUrl = "",
  currentPage = 1,
  totalPages = 10,
  onPageChange,
  currentLetter,
  currentItem = 1,
  totalItems = 1,
  onLetterChange,
}: PaginationProps) {
  // Gestion des clics sur les pages numériques
  const handlePageClick = (page: number) => {
    if (page !== currentPage && page > 0 && page <= totalPages) {
      onPageChange?.(page)
    }
  }
  // Gestion des clics sur les lettres
  const handleLetterClick = (letter: string) => {
    // Implémentation à compléter selon vos besoins
    if (letter !== currentLetter) {
      onLetterChange?.(letter)
    }
  }

  // Rendu de la pagination numérique
  const renderNumericPagination = () => {
    // Générer les numéros de page à afficher
    const pageNumbers = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      // Toujours afficher la première page
      pageNumbers.push(1)

      // Calculer les pages du milieu
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      // Ajouter ellipsis si nécessaire
      if (start > 2) {
        pageNumbers.push("...")
      }

      // Ajouter les pages du milieu
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i)
      }

      // Ajouter ellipsis si nécessaire
      if (end < totalPages - 1) {
        pageNumbers.push("...")
      }

      // Toujours afficher la dernière page
      pageNumbers.push(totalPages)
    }

    return (
      <div className="flex items-center space-x-4">
        {/* Bouton Précédent */}
        <Link
          to={baseUrl ? `${baseUrl}/${currentPage - 1}` : "#"}
          onClick={(e) => {
            if (!baseUrl) {
              e.preventDefault()
              if (currentPage > 1) handlePageClick(currentPage - 1)
            }
          }}
          className={cn(
            "text-primary/80 hover:text-primary transition-colors",
            currentPage <= 1 && "text-muted-foreground/70 pointer-events-none",
          )}
          aria-label="Page précédente"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>

        {/* Numéros de page */}
        {pageNumbers.map((page, index) => (
          <div key={`page-${index}`}>
            {page === "..." ? (
              <span className="text-gray-600">...</span>
            ) : (
              <Link
                to={baseUrl ? `${baseUrl}/${page}` : "#"}
                onClick={(e) => {
                  if (!baseUrl) {
                    e.preventDefault()
                    if (typeof page === "number") handlePageClick(page)
                  }
                }}
                className={cn(
                  "text-primary/80 hover:text-primary transition-colors",
                  currentPage === page && "font-bold",
                )}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </Link>
            )}
          </div>
        ))}

        {/* Bouton Suivant */}
        <Link
          to={baseUrl ? `${baseUrl}/${currentPage + 1}` : "#"}
          onClick={(e) => {
            if (!baseUrl) {
              e.preventDefault()
              if (currentPage < totalPages) handlePageClick(currentPage + 1)
            }
          }}
          className={cn(
            "text-primary/80 hover:text-primary transition-colors",
            currentPage >= totalPages && "text-muted-foreground/70 pointer-events-none",
          )}
          aria-label="Page suivante"
        >
          <ChevronRight className="h-5 w-5" />
        </Link>
      </div>
    )
  }

  // Rendu de la pagination alphabétique
  const renderAlphabeticPagination = () => {
    const letterRanges = [
      { label: "A-E", active: currentLetter === "A-E" },
      { label: "F-J", active: currentLetter === "F-J" },
      { label: "K-O", active: currentLetter === "K-O" },
      { label: "P-T", active: currentLetter === "P-T" },
      { label: "U-Z", active: currentLetter === "U-Z" },
    ]

    return (
      <div className="flex items-center space-x-4">
        <span className="text-gray-700">Aller à</span>
        {letterRanges.map((range) => (
          <Link
            key={range.label}
            to={baseUrl ? `${baseUrl}/${range.label}` : "#"}
            onClick={(e) => {
              if (!baseUrl) {
                e.preventDefault()
                handleLetterClick(range.label)
              }
            }}
            className={cn(
              "text-primary/80 hover:text-primary transition-colors",
              range.active && "font-bold text-black",
            )}
          >
            {range.label}
          </Link>
        ))}
      </div>
    )
  }

  // Rendu de la pagination condensée
  const renderCondensedPagination = () => {
    return (
      <div className="flex items-center">
        <div className="border border-gray-300 p-2 mr-2 min-w-[60px] text-center">{currentItem}</div>
        <span className="mr-2">sur {totalItems}</span>

        {/* Bouton Précédent */}
        <Link
          to={baseUrl ? `${baseUrl}/${currentItem - 1}` : "#"}
          onClick={(e) => {
            if (!baseUrl) {
              e.preventDefault()
              if (currentItem > 1) onPageChange?.(currentItem - 1)
            }
          }}
          className={cn(
            "text-primary/80 hover:text-primary transition-colors mx-1",
            currentItem <= 1 && "text-muted-foreground/70 pointer-events-none",
          )}
          aria-label="Élément précédent"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>

        {/* Bouton Suivant */}
        <Link
          to={baseUrl ? `${baseUrl}/${currentItem + 1}` : "#"}
          onClick={(e) => {
            if (!baseUrl) {
              e.preventDefault()
              if (currentItem < totalItems) onPageChange?.(currentItem + 1)
            }
          }}
          className={cn(
            "text-primary/80 hover:text-primary transition-colors mx-1",
            currentItem >= totalItems && "text-muted-foreground/70 pointer-events-none",
          )}
          aria-label="Élément suivant"
        >
          <ChevronRight className="h-5 w-5" />
        </Link>
      </div>
    )
  }

  return (
    <nav className={cn("my-6", className)} aria-label="Pagination">
      {variant === "numeric" && renderNumericPagination()}
      {variant === "alphabetic" && renderAlphabeticPagination()}
      {variant === "condensed" && renderCondensedPagination()}
    </nav>
  )
}

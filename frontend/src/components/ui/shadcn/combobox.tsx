import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/quebec/Button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/shadcn/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/shadcn/popover";
import { Skeleton } from "./skeleton";

interface ComboboxProps<T> {
  value: string | undefined;
  onValueChange: (value: string) => void;
  data: T[] | undefined | null;
  isLoading: boolean;
  isError: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  getOptionValue: (item: T) => string;
  getOptionLabel: (item: T) => string;
  emptyMessage?: string;
  searchPlaceholder?: string;
  highlightMatch?: boolean; // Optionnel pour mettre en évidence une option spécifique
}

interface HighlightedTextProps {
  text: string;
  highlight: string;
  className?: string;
}

function HighlightedText({ text, highlight, className }: HighlightedTextProps) {
  if (!highlight.trim()) {
    return <span className={className}>{text}</span>;
  }

  // Échapper les caractères spéciaux pour la regex
  const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escapedHighlight})`, "gi");
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        // ✅ Vérifie si cette partie n'est pas vide ET correspond à la recherche
        if (part && part.toLowerCase().includes(highlight.toLowerCase())) {
          return (
            <mark
              key={index}
              className="bg-yellow-200 text-yellow-900 dark:bg-yellow-800 dark:text-yellow-100 px-0.5"
            >
              {part}
            </mark>
          );
        }
        // ✅ Retourne les parties non correspondantes (y compris les strings vides)
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
}

export function Combobox<T>({
  value,
  onValueChange,
  data,
  isLoading,
  isError,
  placeholder = "Sélectionner une option...",
  disabled = false,
  className,
  getOptionValue,
  getOptionLabel,
  emptyMessage = "Aucun résultat",
  searchPlaceholder = "Rechercher...",
  highlightMatch = true,
}: ComboboxProps<T>) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  // Mémoisation de l'élément sélectionné
  const selectedItem = React.useMemo(() => {
    if (!value || !data) return null;
    return data.find((item) => getOptionValue(item) === value) ?? null;
  }, [value, data, getOptionValue]);

  // Mémoisation du label affiché
  const displayLabel = React.useMemo(() => {
    if (selectedItem) {
      return getOptionLabel(selectedItem);
    }
    return placeholder;
  }, [selectedItem, getOptionLabel, placeholder]);

  // Gestion de la sélection
  const handleSelect = React.useCallback(
    (currentValue: string) => {
      const newValue = currentValue === value ? "" : currentValue;
      onValueChange(newValue);
      setOpen(false);
      setSearchValue("");
    },
    [value, onValueChange]
  );

  // Gestion de l'ouverture du popover
  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      if (!disabled) {
        setOpen(newOpen);
        if (newOpen) {
          // Réinitialiser la valeur de recherche lorsque le popover s'ouvre
          setSearchValue("");
        }
      }
    },
    [disabled]
  );

  const handleSearchChange = React.useCallback((search: string) => {
    setSearchValue(search);
  }, []);

  // États de chargement et d'erreur
  if (isLoading) {
    return <Skeleton className={cn("h-9 w-full", className)} />;
  }

  if (isError) {
    return (
      <div
        className={cn(
          "text-destructive/80 bg-muted/50 border h-9 flex px-3 items-center rounded-md",
          className
        )}
        role="alert"
        aria-live="polite"
      >
        Erreur lors du chargement
      </div>
    );
  }

  // Protection contre les données null/undefined
  const safeData = data ?? [];

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          disabled={disabled || isLoading}
          className={cn("w-full justify-between", className)}
        >
          <span className="truncate">{displayLabel}</span>
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput
            placeholder={searchPlaceholder}
            className="h-9"
            value={searchValue}
            onValueChange={handleSearchChange}
          />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            {safeData.length > 0 && (
              <CommandGroup>
                {safeData.map((item) => {
                  const optionValue = getOptionValue(item);
                  const optionLabel = getOptionLabel(item);
                  const isSelected = value === optionValue;
                  return (
                    <CommandItem
                      key={optionValue}
                      value={optionLabel}
                      onSelect={() => handleSelect(optionValue)}
                      className="cursor-pointer"
                    >
                      <CheckIcon
                        className={cn(
                          "mr-2 h-4 w-4",
                          isSelected ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {highlightMatch ? (
                        <HighlightedText
                          text={optionLabel}
                          highlight={searchValue}
                          className="truncate"
                        />
                      ) : (
                        <span className="truncate">{optionLabel}</span>
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// Export du type pour réutilisation
export type { ComboboxProps };

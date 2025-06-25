import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseLocalDate(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function capitalizeFirstLetter(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message === "Failed to fetch") {
    return "Impossible de contacter le serveur. Vérifiez votre connexion ou vos droits d'accès.";
  }
  if (error instanceof Error) {
    return error.message;
  }
  // HTTP Response object
  if (error instanceof Response) {
    return `Erreur HTTP ${error.status} : ${error.statusText}`;
  }
  // String error
  if (typeof error === "string") {
    return error;
  }
  // Objet avec message
  if (typeof error === "object" && error !== null && "message" in error) {
    return String((error as { message?: unknown }).message);
  }
  return "Erreur inconnue";
}

export function getFieldError<T extends object>(
  errors: Partial<Record<keyof T, { message?: string }>>,
  name: keyof T
): string | undefined {
  return errors[name]?.message;
}

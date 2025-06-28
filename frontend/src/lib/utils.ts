import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import moment from "moment";

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

export const formatDateForBackend = (dateInput: string): string => {
  // Si c'est déjà au bon format YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
    return dateInput;
  }

  // Si c'est un ISO string ou autre format
  const momentDate = moment(dateInput);
  if (momentDate.isValid()) {
    return momentDate.format("YYYY-MM-DD");
  }

  throw new Error(`Format de date invalide: ${dateInput}`);
};

export const formatTimeForBackend = (timeInput: string): string => {
  // Si c'est déjà au bon format HH:mm
  if (/^\d{2}:\d{2}$/.test(timeInput)) {
    return timeInput;
  }

  // Si c'est un autre format
  const momentTime = moment(timeInput, ["HH:mm:ss", "HH:mm"]);
  if (momentTime.isValid()) {
    return momentTime.format("HH:mm");
  }

  throw new Error(`Format d'heure invalide: ${timeInput}`);
};

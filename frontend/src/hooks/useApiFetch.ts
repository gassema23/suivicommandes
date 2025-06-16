let isRefreshing = false;
let refreshPromise: Promise<Response> | null = null;
import { API_ROUTE } from "@/constants/api-route.constant";
import Cookies from "js-cookie";

function needsCsrf(method?: string) {
  return ["POST", "PUT", "PATCH", "DELETE"].includes(
    (method ?? "GET").toUpperCase()
  );
}

export async function apiFetch(
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> {
  let headers = { ...(init?.headers || {}) };
  const method = (init?.method ?? "GET").toUpperCase();
  const csrfToken = Cookies.get("csrfToken");

  if (!csrfToken) {
    throw new Error("CSRF token is missing");
  }
  if (needsCsrf(method)) {
    headers = {
      ...headers,
      "X-CSRF-Token": csrfToken ?? "",
    };
  }

  let response = await fetch(input, {
    ...init,
    method,
    headers,
    credentials: "include",
  });

  if (response.status === 401) {
    // Rafraîchissement déjà en cours ? On attend la promesse
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = fetch(`${API_ROUTE}/auth/refresh`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
      }).finally(() => {
        isRefreshing = false;
      }) as Promise<Response>;
    }
    if (refreshPromise) {
      await refreshPromise;
    }
    response = await fetch(input, {
      ...init,
      method,
      headers,
      credentials: "include",
    });

    // Rejoue la requête initiale après refresh
    if (response.status === 401) {
      // Toujours pas autorisé : redirige vers /login
      window.location.href = "/login";
      throw new Error(
        "Votre session a expiré ou vous n'êtes pas autorisé. Merci de vous reconnecter."
      );
    }
    // Si le refresh a réussi, on retourne la réponse (l'utilisateur reste sur la page courante)
  }

  if (!response.ok) {
    // Message d'erreur explicite pour toute autre erreur HTTP
    let errorMessage = "Une erreur est survenue lors de la requête.";
    try {
      const errorData = await response.json();
      if (errorData?.message) {
        errorMessage = errorData.message;
      }
    } catch {
      // ignore JSON parse error
    }
    throw new Error(errorMessage);
  }

  return response;
}

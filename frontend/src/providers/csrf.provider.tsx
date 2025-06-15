import React, { createContext, useContext, useCallback } from "react";
import { API_ROUTE } from "@/constants/api-route.constant";

const CsrfContext = createContext<{ ensureCsrfToken: () => Promise<string> } | undefined>(undefined);

export function CsrfProvider({ children }: { children: React.ReactNode }) {
  // Récupère et stocke le token CSRF si besoin
  const ensureCsrfToken = useCallback(async () => {
    await fetch(`${API_ROUTE}/auth/csrf-token`, { credentials: "include" });
    const csrfToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrfToken="))
      ?.split("=")[1];
    return csrfToken || "";
  }, []);

  return (
    <CsrfContext.Provider value={{ ensureCsrfToken }}>
      {children}
    </CsrfContext.Provider>
  );
}

// Hook pour utiliser le token CSRF
export function useCsrf() {
  const ctx = useContext(CsrfContext);
  if (!ctx) throw new Error("useCsrf must be used within CsrfProvider");
  return ctx;
}
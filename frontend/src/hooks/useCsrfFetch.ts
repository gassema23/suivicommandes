import { useCsrf } from "@/providers/csrf.provider";

export function useCsrfFetch() {
  const { ensureCsrfToken } = useCsrf();

  return async function csrfFetch<T = unknown>(
    url: string,
    options: Omit<RequestInit, "body"> & { body?: unknown } = {}
  ): Promise<T> {
    const csrfToken = await ensureCsrfToken();
    const isFormData = options.body instanceof FormData;

    const headers = {
      ...(options.headers || {}),
      "x-csrf-token": csrfToken,
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
    };

    // Prépare le body pour fetch
    let fetchBody: BodyInit | undefined;
    if (isFormData) {
      fetchBody = options.body as FormData;
    } else if (options.body !== undefined) {
      fetchBody = JSON.stringify(options.body);
    }

    const res = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
      body: fetchBody,
    });

    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || "Erreur lors de la requête");
    }
    return result;
  };
}

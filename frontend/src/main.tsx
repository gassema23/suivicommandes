import ReactDOM from "react-dom/client";
import "./styles/gloabal.css";
import { RouterProvider } from "@tanstack/react-router";

import { useAuth } from "./providers/auth.provider.tsx";
import React from "react";
import Providers from "./providers/providers.provider.tsx";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/react-query.ts";
import { router } from "./lib/router.ts";

function InnerApp() {
  const auth = useAuth();
  return (
    <RouterProvider
      router={router}
      context={{ auth: { ...auth }, queryClient }}
    />
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Providers>
        <InnerApp />
      </Providers>
    </QueryClientProvider>
  );
}

const rootElement = document.getElementById("root")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

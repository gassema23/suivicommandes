import { routeTree } from "@/routeTree.gen";
import { queryClient } from "@/lib/react-query";

import { createRouter } from "@tanstack/react-router";

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
  context: {
    auth: undefined!,
    queryClient,
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export { router };

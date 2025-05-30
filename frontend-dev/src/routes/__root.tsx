import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import {
  HeadContent,
  Outlet,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import type { AuthContext } from "@/providers/auth-provider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { ErrorPage } from "@/components/layouts/ErrorPage";

type RouterContext = {
  auth: AuthContext;
  queryClient?: QueryClient;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  notFoundComponent: () => <ErrorPage />,
  component: function RootComponent() {
    return (
      <>
        <HeadContent />
        <Outlet />
        {process.env.NODE_ENV === "development" && (
          <>
            <ReactQueryDevtools initialIsOpen={false} />
            <TanStackRouterDevtools
              position="bottom-left"
              initialIsOpen={false}
            />
          </>
        )}
      </>
    );
  },
});

import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import {
  HeadContent,
  Outlet,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { ErrorPage } from "@/components/layouts/ErrorPage";
import type { AuthContext } from "@/hooks/useAuthService";

type RouterContext = {
  auth: AuthContext;
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  notFoundComponent: () => <ErrorPage />,
  component: RootComponent,
});

function RootComponent() {
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
}

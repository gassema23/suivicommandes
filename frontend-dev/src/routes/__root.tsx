import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import {
  HeadContent,
  Outlet,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import type { AuthContext } from "@/providers/auth.provider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { ErrorPage } from "@/components/layouts/ErrorPage";
import { useEffect } from "react";
import { APP_NAME } from "@/config";

type RouterContext = {
  auth: AuthContext;
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  notFoundComponent: () => <ErrorPage />,
  component: function RootComponent() {
    // This effect ensures that the document title includes the app name
    useEffect(() => {
      if (!document.title.includes(APP_NAME)) {
        document.title = `${document.title} | ${APP_NAME}`;
      }
    }, [location.pathname]);

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

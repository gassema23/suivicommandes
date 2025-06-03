import LoadingPage from "@/components/ui/loader/LoadingPage";
import { Breadcrumb } from "@/components/ui/quebec/Breadcrumb";
import { QuebecFooter } from "@/components/ui/quebec/Footer";
import { QuebecHeader } from "@/components/ui/quebec/QuebecHeader";
import ActionButton from "@/components/ui/shadcn/action-button";
import { SidebarProvider } from "@/components/ui/shadcn/sidebar";
import { AppSidebar } from "@/features/navigations/app-sidebar";
import {
  createFileRoute,
  Outlet,
  redirect,
  useMatches,
} from "@tanstack/react-router";

export interface AuthLayoutProps {
  name?: string;
  title?: string;
  description?: string;
  action?: string;
  breadcrumb?: Array<{ label: string; href: string; isCurrent?: boolean }>;
}

type StaticData = {
  staticData: {
    breadcrumb?: Array<{ label: string; href: string; isCurrent?: boolean }>;
    title?: string;
    description?: string;
    action?: string;
  };
};

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: AuthLayout,
  pendingComponent: () => <LoadingPage />,
});

function AuthLayout() {
  const matches = useMatches();
  const currentRoute = matches[matches.length - 1] as StaticData;

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="w-full h-full">
        <QuebecHeader />
        <div className="flex flex-col min-h-screen">
          <main className="flex-1 px-8 py-4 lg:px-12 lg:py-6">
            {currentRoute.staticData?.breadcrumb &&
              currentRoute.staticData?.breadcrumb?.length > 0 && (
                <Breadcrumb
                  items={currentRoute.staticData.breadcrumb}
                  className="pb-2"
                />
              )}
            <div className="flex items-center justify-between mb-4">
              <div>
                {currentRoute.staticData?.title && (
                  <h1 className="section-title">
                    {currentRoute.staticData.title}
                  </h1>
                )}
                {currentRoute.staticData?.description && (
                  <p className="subtitle ">
                    {currentRoute.staticData.description}
                  </p>
                )}
              </div>
              {currentRoute.staticData?.action && (
                <ActionButton to={currentRoute.staticData.action} />
              )}
            </div>
            <Outlet />
          </main>
          <QuebecFooter />
        </div>
      </div>
    </SidebarProvider>
  );
}

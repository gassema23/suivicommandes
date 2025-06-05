import LoadingPage from "@/components/ui/loader/LoadingPage";
import { Breadcrumb } from "@/components/ui/quebec/Breadcrumb";
import { QuebecFooter } from "@/components/ui/quebec/Footer";
import { QuebecHeader } from "@/components/ui/quebec/QuebecHeader";
import ActionButton from "@/components/ui/shadcn/action-button";
import { SidebarProvider } from "@/components/ui/shadcn/sidebar";
import { AppSidebar } from "@/features/common/navigations/app-sidebar";
import { Toaster } from "@/components/ui/shadcn/sonner";
import {
  createFileRoute,
  Outlet,
  redirect,
  useMatches,
} from "@tanstack/react-router";
import { AlertOctagon, AlertTriangle, CheckCircle2, Info, Loader2, X } from "lucide-react";

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
      <Toaster
        position="top-right"
        closeButton
        toastOptions={{
          classNames: {
            toast:
              "!items-start group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg !border-0 !border-l-6 !rounded-none",
            success: "!border-success",
            error: "!border-destructive",
            info: "!border-accent",
            warning: "!border-warning",
            title: "pl-4",
            description: "pl-4",
            closeButton:
              "!text-destructive !group-[.toast]:text-destructive !right-0 !left-auto !top-2.5 !rounded-none !border-none !bg-transparent !p-0 ",
          },
        }}
        icons={{
          success: <CheckCircle2 className="text-success h-6 w-6" />,
          error: <AlertOctagon className="text-destructive h-6 w-6" />,
          info: <Info className="text-accent h-6 w-6" />,
          warning: <AlertTriangle className="text-warning h-6 w-6" />,
          loading: <Loader2 className="text-primary h-6 w-6 animate-spin" />,
          close: <X className="text-destructive h-4 w-4" />,
        }}
      />
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

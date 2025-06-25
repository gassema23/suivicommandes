import LoadingPage from "@/components/ui/loader/LoadingPage";
import FormError from "@/components/ui/shadcn/form-error";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/applications/tracking-order/"
)({
  errorComponent: ({ error }) => <FormError message={error.message} />,
  staticData: {
    title: "Suivi des commandes",
    action:"/applications/tracking-order/create",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      {
        label: "Suivi des commandes",
        href: "/applications/tracking-order",
        isCurrent: true,
      },
    ],
  },
  pendingComponent: () => <LoadingPage />,
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
    </div>
  );
}

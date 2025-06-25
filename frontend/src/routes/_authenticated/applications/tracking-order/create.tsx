import LoadingPage from "@/components/ui/loader/LoadingPage";
import FormError from "@/components/ui/shadcn/form-error";
import FormSectionContainer from "@/features/tacking-orders/components/FormSectionContainer";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/applications/tracking-order/create"
)({
  errorComponent: ({ error }) => <FormError message={error.message} />,
  staticData: {
    title: "Ajouter une commande",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      {
        label: "Suivi des commandes",
        href: "/applications/tracking-order",
      },
      {
        label: "Ajouter une commande",
        href: "/applications/tracking-order/create",
        isCurrent: true,
      },
    ],
  },
  pendingComponent: () => <LoadingPage />,
  component: RouteComponent,
});

function RouteComponent() {
  return <FormSectionContainer />;
}

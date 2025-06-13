import LoadingPage from "@/components/ui/loader/LoadingPage";
import FormError from "@/components/ui/shadcn/form-error";
import RequisitionTypeCreateForm from "@/features/requisition-types/components/RequisitionTypeCreateForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/pilotages/requisition-types/create"
)({
  head: () => ({
    meta: [{ title: "Ajouter un type de réquisition" }],
  }),
  component: RouteComponent,
  errorComponent: ({ error }) => <FormError message={error.message} />,
  staticData: {
    title: "Ajouter un type de réquisition",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      { label: "Types de réquisition", href: "/pilotages/requisition-types" },
      {
        label: "Ajouter un type de réquisition",
        href: "/pilotages/requisition-types/create",
        isCurrent: true,
      },
    ],
  },
  pendingComponent: () => <LoadingPage />,
});

function RouteComponent() {
  return <RequisitionTypeCreateForm />;
}

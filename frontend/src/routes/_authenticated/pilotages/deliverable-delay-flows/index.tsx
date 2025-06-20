import { DataTable } from "@/components/table/DataTable";
import LoadingTable from "@/components/ui/loader/LoadingTable";
import { DeleteModal } from "@/components/ui/quebec/DeleteModal";
import FormError from "@/components/ui/shadcn/form-error";
import { SUCCESS_MESSAGES } from "@/constants/messages.constant";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import { deliverableDelayFlowColumns } from "@/features/deliverable-delay-flows/components/DeliverableDelayFlowColumns";
import { getDeliverableDelayFlows } from "@/features/deliverable-delay-flows/services/get-deliverable-delay-flows.service";
import { createPermissionGuard } from "@/shared/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/shared/authorizations/types/auth.types";
import type { DeliverableDelayFlowResponse } from "@/shared/deliverable-delay-flows/types/deliverable-delay-flow.type";
import {
  queryOptions,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

const deliverableDelayFlowsQueryOptions = (pageNumber: number) =>
  queryOptions<DeliverableDelayFlowResponse>({
    queryKey: QUERY_KEYS.DELIVERABLE_DELAY_FLOW_WITH_PAGE(pageNumber),
    queryFn: () => getDeliverableDelayFlows(pageNumber),
  });

export const Route = createFileRoute(
  "/_authenticated/pilotages/deliverable-delay-flows/"
)({
  beforeLoad: createPermissionGuard([PERMISSIONS.DELIVERABLE_DELAY_FLOWS.READ]),
  head: () => ({
    meta: [{ title: "Délai de livraison des flux" }],
  }),
  validateSearch: (search) => ({
    page: Number(search.page ?? 1),
  }),
  errorComponent: ({ error }) => <FormError message={error.message} />,
  staticData: {
    title: "Délai de livraison des flux",
    action: "/pilotages/deliverable-delay-flows/create",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      {
        label: "Délai de livraison des flux",
        href: "/pilotages/deliverable-delay-flows",
        isCurrent: true,
      },
    ],
  },
  pendingComponent: () => <LoadingTable rows={10} columns={4} />,
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const { page = 1 } = Route.useSearch();
  const pageNumber = Number(page);

  const { data: deliverableDelayFlows } =
    useSuspenseQuery<DeliverableDelayFlowResponse>(
      deliverableDelayFlowsQueryOptions(pageNumber)
    );
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const dataWithDelete = {
    ...deliverableDelayFlows,
    data: (deliverableDelayFlows.data ?? []).map((deliverableDelayFlow) => ({
      ...deliverableDelayFlow,
      onDelete: () => setDeleteId(deliverableDelayFlow.id),
    })),
  };

  return (
    <>
      <DataTable
        data={dataWithDelete}
        columns={deliverableDelayFlowColumns}
        currentPage={pageNumber}
        totalPages={deliverableDelayFlows.meta.totalPages}
        onPageChange={(page) => navigate({ search: { page } })}
      />
      <DeleteModal
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        deletePageName="deliverable-delay-flows"
        deleteId={deleteId}
        onSuccess={() => {
          setDeleteId(null);
          toast.success(
            SUCCESS_MESSAGES.delete("Délai de livraison des flux")
          );
          queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.DELIVERABLE_DELAY_FLOWS,
          });
        }}
      />
    </>
  );
}

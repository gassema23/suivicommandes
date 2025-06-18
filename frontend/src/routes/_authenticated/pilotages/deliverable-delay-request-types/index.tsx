import { DataTable } from "@/components/table/DataTable";
import LoadingTable from "@/components/ui/loader/LoadingTable";
import { DeleteModal } from "@/components/ui/quebec/DeleteModal";
import FormError from "@/components/ui/shadcn/form-error";
import { SUCCESS_MESSAGES } from "@/constants/messages.constant";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import { deliverableDelayRequestTypeColumns } from "@/features/deliverable-delay-request-types/components/DeliverableDelayRequestTypeColumn";
import { getDeliverableDelayRequestTypes } from "@/features/deliverable-delay-request-types/services/get-deliverable-delay-request-types.service";
import { createPermissionGuard } from "@/shared/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/shared/authorizations/types/auth.types";
import type { DeliverableDelayRequestTypeResponse } from "@/shared/deliverable-delay-request-types/types/deliverable-delay-request-type.type";
import {
  queryOptions,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

const deliverablesDelayRequestTypesQueryOptions = (pageNumber: number) =>
  queryOptions<DeliverableDelayRequestTypeResponse>({
    queryKey: QUERY_KEYS.DELIVERABLE_DELAY_RQUEST_TYPES_WITH_PAGE(pageNumber),
    queryFn: () => getDeliverableDelayRequestTypes(pageNumber),
  });

export const Route = createFileRoute(
  "/_authenticated/pilotages/deliverable-delay-request-types/"
)({
  beforeLoad: createPermissionGuard([
    PERMISSIONS.DELIVERABLE_DELAY_REQUEST_TYPES.READ,
  ]),
  head: () => ({
    meta: [{ title: "Type de demande de délai de livraison" }],
  }),
  validateSearch: (search) => ({
    page: Number(search.page ?? 1),
  }),
  errorComponent: ({ error }) => <FormError message={error.message} />,
  staticData: {
    title: "Type de demande de délai de livraison",
    action: "/pilotages/deliverable-delay-request-types/create",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      {
        label: "Type de demande de délai de livraison",
        href: "/pilotages/deliverable-delay-request-types",
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

  const { data: deliverableDelayRequestTypes } =
    useSuspenseQuery<DeliverableDelayRequestTypeResponse>(
      deliverablesDelayRequestTypesQueryOptions(pageNumber)
    );
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const dataWithDelete = {
    ...deliverableDelayRequestTypes,
    data: (deliverableDelayRequestTypes.data ?? []).map(
      (deliverableDelayRequestType) => ({
        ...deliverableDelayRequestType,
        onDelete: () => setDeleteId(deliverableDelayRequestType.id),
      })
    ),
  };

  return (
    <>
      <DataTable
        data={dataWithDelete}
        columns={deliverableDelayRequestTypeColumns}
        currentPage={pageNumber}
        totalPages={deliverableDelayRequestTypes.meta.totalPages}
        onPageChange={(page) => navigate({ search: { page } })}
      />
      <DeleteModal
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        deletePageName="deliverable-delay-request-types"
        deleteId={deleteId}
        onSuccess={() => {
          setDeleteId(null);
          toast.success(
            SUCCESS_MESSAGES.delete("Type de demande de délai de livraison")
          );
          queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.DELIVERABLE_DELAY_RQUEST_TYPES,
          });
        }}
      />
    </>
  );
}

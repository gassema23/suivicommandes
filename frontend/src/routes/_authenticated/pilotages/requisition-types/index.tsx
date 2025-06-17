import { DeleteModal } from "@/components/ui/quebec/DeleteModal";
import FormError from "@/components/ui/shadcn/form-error";
import { createPermissionGuard } from "@/shared/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/shared/authorizations/types/auth.types";
import { SUCCESS_MESSAGES } from "@/constants/messages.constant";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import { DataTable } from "@/components/table/DataTable";
import { requisitionTypeColumns } from "@/features/requisition-types/components/RequisitionTypeColumns";
import { getRequisitionTypes } from "@/features/requisition-types/services/get-requisition-types.service";
import type { RequisitionTypeResponse } from "@/features/requisition-types/types/requisition-type.type";
import {
  queryOptions,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import LoadingTable from "@/components/ui/loader/LoadingTable";

const requisitionTypesQueryOptions = (pageNumber: number) =>
  queryOptions<RequisitionTypeResponse>({
    queryKey: QUERY_KEYS.REQUISITION_TYPES_WITH_PAGE(pageNumber),
    queryFn: () => getRequisitionTypes(pageNumber),
  });

export const Route = createFileRoute(
  "/_authenticated/pilotages/requisition-types/"
)({
  beforeLoad: createPermissionGuard([PERMISSIONS.REQUISITION_TYPES.READ]),
  head: () => ({
    meta: [{ title: "Types de réquisition" }],
  }),
  validateSearch: (search) => ({
    page: Number(search.page ?? 1),
  }),
  errorComponent: ({ error }) => <FormError message={error.message} />,
  staticData: {
    title: "Types de réquisition",
    action: "/pilotages/requisition-types/create",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      {
        label: "Types de réquisition",
        href: "/pilotages/requisition-types",
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

  const { data: requisitionTypes } = useSuspenseQuery<RequisitionTypeResponse>(
    requisitionTypesQueryOptions(pageNumber)
  );
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const dataWithDelete = {
    ...requisitionTypes,
    data: (requisitionTypes.data ?? []).map((requisitionType) => ({
      ...requisitionType,
      onDelete: () => setDeleteId(requisitionType.id),
    })),
  };

  return (
    <>
      <DataTable
        data={dataWithDelete}
        columns={requisitionTypeColumns}
        currentPage={pageNumber}
        totalPages={requisitionTypes.meta.totalPages}
        onPageChange={(page) => navigate({ search: { page } })}
      />
      <DeleteModal
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        deletePageName="requisition-types"
        deleteId={deleteId}
        onSuccess={() => {
          setDeleteId(null);
          toast.success(SUCCESS_MESSAGES.delete("Type de réquisition"));
          queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.REQUISITION_TYPES,
          });
        }}
      />
    </>
  );
}

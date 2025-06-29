import LoadingPage from "@/components/ui/loader/LoadingPage";
import { DeleteModal } from "@/components/ui/quebec/DeleteModal";
import FormError from "@/components/ui/shadcn/form-error";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import { createPermissionGuard } from "@/shared/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/shared/authorizations/types/auth.types";
import { DataTable } from "@/components/table/DataTable";
import { delayTypeColumns } from "@/features/delay-types/components/DelayTypeColumns";
import { getDelayTypes } from "@/features/delay-types/services/get-delay-types.service";
import type { DelayTypeResponse } from "@/shared/delay-types/types/delay-type.type";
import {
  queryOptions,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { SUCCESS_MESSAGES } from "@/constants/messages.constant";

const delayTypesQueryOptions = (pageNumber: number) =>
  queryOptions<DelayTypeResponse>({
    queryKey: QUERY_KEYS.DELAY_TYPES_WITH_PAGE(pageNumber),
    queryFn: () => getDelayTypes(pageNumber),
  });

export const Route = createFileRoute("/_authenticated/pilotages/delay-types/")({
  beforeLoad: createPermissionGuard([PERMISSIONS.DELAY_TYPES.READ]),
  head: () => ({
    meta: [{ title: "Types de délai" }],
  }),
  validateSearch: (search) => ({
    page: Number(search.page ?? 1),
  }),
  loader: (args) => {
    const { context, search } = args as any;
    return context.queryClient.ensureQueryData(
      delayTypesQueryOptions(Number(search?.page ?? "1"))
    );
  },
  errorComponent: ({ error }) => <FormError message={error.message} />,
  staticData: {
    title: "Types de délai",
    action: "/pilotages/delay-types/create",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      {
        label: "Types de délai",
        href: "/pilotages/delay-types",
        isCurrent: true,
      },
    ],
  },
  pendingComponent: () => <LoadingPage />,
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const { page = 1 } = Route.useSearch();
  const pageNumber = Number(page);

  const { data: delayTypes } = useSuspenseQuery<DelayTypeResponse>(
    delayTypesQueryOptions(pageNumber)
  );
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const dataWithDelete = {
    ...delayTypes,
    data: (delayTypes.data ?? []).map((delayType) => ({
      ...delayType,
      onDelete: () => setDeleteId(delayType.id),
    })),
  };

  return (
    <>
      <DataTable
        data={dataWithDelete}
        columns={delayTypeColumns}
        currentPage={pageNumber}
        totalPages={delayTypes.meta.totalPages}
        onPageChange={(page) => navigate({ search: { page } })}
      />
      <DeleteModal
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        deletePageName="delay-types"
        deleteId={deleteId}
        onSuccess={() => {
          setDeleteId(null);
          toast.success(SUCCESS_MESSAGES.delete("Type de délai"));
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DELAY_TYPES });
        }}
      />
    </>
  );
}

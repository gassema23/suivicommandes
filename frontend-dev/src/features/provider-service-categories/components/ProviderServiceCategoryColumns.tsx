import type { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { momentFr } from "@/lib/momentFr";
import DataTableAction from "@/features/common/table/components/DataTableAction";
import { DataTableColumnHeader } from "@/features/common/table/components/DataTableColumnHeader";
import type { ProviderServiceCategory } from "../types/provider-service-category.type";

momentFr();

export const providerServiceCategoryColumns: ColumnDef<ProviderServiceCategory>[] = [
  {
    accessorKey: "sectorId",
    cell: ({ row }) => {
      return row.original.serviceCategory.service.sector.sectorName;
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Secteur"
      />
    ),
    enableSorting: true,
    enableColumnFilter: true,
  },{
    accessorKey: "serviceId",
    cell: ({ row }) => {
      return row.original.serviceCategory.service.serviceName;
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Service"
      />
    ),
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "serviceCategoryId",
    cell: ({ row }) => {
        return row.original.serviceCategory.serviceCategoryName;
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Identifiant du fournisseur"
      />
    ),
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "providerId",
    cell: ({ row }) => {
      return row.original.provider.providerName;
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fournisseur" />
    ),
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "updatedAt",
    header: "Dernière modification",
    enableSorting: true,
    enableColumnFilter: false,
    cell: ({ getValue }) => {
      return moment(getValue<string>()).fromNow();
    },
  },
  {
    id: "id",
    accessorKey: "id",
    header: "",
    enableSorting: true,
    enableColumnFilter: false,
    cell: ({ row }) => {
      return (
        <DataTableAction
          id={row.original.id}
          baseUrl="/pilotages/providers/update/$id"
          onDelete={row.original.onDelete}
          resource="providers"
        />
      );
    },
  },
];

import type { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { momentFr } from "@/lib/momentFr";
import DataTableAction from "@/features/common/table/components/DataTableAction";
import { DataTableColumnHeader } from "@/features/common/table/components/DataTableColumnHeader";
import type { RequestTypeDelay } from "../types/request-type-delay.type";

momentFr();

export const requestTypeDelayColumns: ColumnDef<RequestTypeDelay>[] = [
  {
    accessorKey: "secrorId",
    cell: ({ row }) => {
      return (
        row.original.requestTypeServiceCategory.serviceCategory?.service?.sector
          ?.sectorName || "N/A"
      );
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Secteur" />
    ),
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "serviceId",
    cell: ({ row }) => {
      return (
        row.original.requestTypeServiceCategory.serviceCategory?.service
          ?.serviceName || "N/A"
      );
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Service" />
    ),
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "serviceCategoryId",
    cell: ({ row }) => {
      return (
        row.original.requestTypeServiceCategory.serviceCategory
          ?.serviceCategoryName || "N/A"
      );
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Catégorie de service" />
    ),
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "requestTypeId",
    cell: ({ row }) => {
      return (
        row.original.requestTypeServiceCategory.requestType?.requestTypeName ||
        "N/A"
      );
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type de demande" />
    ),
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "delayTypeId",
    cell: ({ row }) => {
      return row.original.delayType.delayTypeName || "N/A";
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type de délai" />
    ),
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "delayValue",
    cell: ({ row }) => {
      return row.original.delayValue || "N/A";
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Délai en jours" />
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
          baseUrl="/pilotages/request-type-delays/update/$id"
          onDelete={row.original.onDelete}
          resource="request_type_delays"
        />
      );
    },
  },
];

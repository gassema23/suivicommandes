import type { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { momentFr } from "@/lib/momentFr";
import DataTableAction from "@/components/table/components/DataTableAction";
import { DataTableColumnHeader } from "@/components/table/components/DataTableColumnHeader";
import type { DeliverableDelayRequestType } from "@/shared/deliverable-delay-request-types/types/deliverable-delay-request-type.type";

momentFr();

type DeliverableDelayRequestTypeWithDelete = DeliverableDelayRequestType & {
  onDelete: () => void;
};
/**
 * 5c2cc702-fc7c-48b8-bdf4-6635bbd42627
 */

export const deliverableDelayRequestTypeColumns: ColumnDef<DeliverableDelayRequestTypeWithDelete>[] =
  [
    {
      accessorKey: "secrorId",
      cell: ({ row }) => {
        return (
          row.original.requestTypeServiceCategory?.serviceCategory?.service
            ?.sector?.sectorName || "N/A"
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
          row.original.requestTypeServiceCategory?.serviceCategory?.service
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
          row.original.requestTypeServiceCategory?.serviceCategory
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
        console.log(row)
        return (
          row.original.requestTypeServiceCategory?.requestType
            ?.requestTypeName || "N/A"
        );
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Type de demande" />
      ),
      enableSorting: true,
      enableColumnFilter: true,
    },
    {
      accessorKey: "deliverableId",
      cell: ({ row }) => {
        return row.original?.deliverable?.deliverableName || "N/A";
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Livrable" />
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
            baseUrl="/pilotages/deliverable-delay-request-types/update/$id"
            onDelete={row.original.onDelete}
            resource="deliverable_delay_request_types"
          />
        );
      },
    },
  ];

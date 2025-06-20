//deliverableDelayFlowColumns

import type { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { momentFr } from "@/lib/momentFr";
import DataTableAction from "@/components/table/components/DataTableAction";
import { DataTableColumnHeader } from "@/components/table/components/DataTableColumnHeader";
import type { DeliverableDelayFlow } from "@/shared/deliverable-delay-flows/types/deliverable-delay-flow.type";

momentFr();

type DeliverableDelayFlowWithDelete = DeliverableDelayFlow & {
  onDelete: () => void;
};

export const deliverableDelayFlowColumns: ColumnDef<DeliverableDelayFlowWithDelete>[] =
  [
    {
      accessorKey: "secrorId",
      cell: ({ row }) => {
        return (
          row.original.deliverableDelayRequestType.requestTypeServiceCategory
            ?.serviceCategory?.service?.sector?.sectorName || "N/A"
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
          row.original.deliverableDelayRequestType.requestTypeServiceCategory
            ?.serviceCategory?.service?.serviceName || "N/A"
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
          row.original.deliverableDelayRequestType.requestTypeServiceCategory
            ?.serviceCategory?.serviceCategoryName || "N/A"
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
          row.original.deliverableDelayRequestType.requestTypeServiceCategory
            ?.requestType?.requestTypeName || "N/A"
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
        return (
          row.original?.deliverableDelayRequestType.deliverable
            ?.deliverableName || "N/A"
        );
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Livrable" />
      ),
      enableSorting: true,
      enableColumnFilter: true,
    },
    {
      accessorKey: "flowId",
      cell: ({ row }) => {
        return row.original?.flow?.flowName || "N/A";
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Flux" />
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
            baseUrl="/pilotages/deliverable-delay-flows/update/$id"
            onDelete={row.original.onDelete}
            resource="deliverable_delay_flows"
          />
        );
      },
    },
  ];

import type { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { momentFr } from "@/lib/momentFr";
import DataTableAction from "@/components/table/components/DataTableAction";
import { DataTableColumnHeader } from "@/components/table/components/DataTableColumnHeader";
import type { RequestTypeServiceCategory } from "@/shared/request-type-service-categories/types/request-type-service-category.type";

momentFr();

export const requestTypeServiceCategoryColumns: ColumnDef<RequestTypeServiceCategory>[] =
  [
    {
      accessorKey: "secrorId",
      cell: ({ row }) => {
        return (
          row.original.serviceCategory?.service?.sector?.sectorName || "N/A"
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
        return row.original.serviceCategory?.service?.serviceName || "N/A";
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
        return row.original.serviceCategory?.serviceCategoryName || "N/A";
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
        return row.original.requestType?.requestTypeName || "N/A";
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Type de demande" />
      ),
      enableSorting: true,
      enableColumnFilter: true,
    },
    {
      accessorKey: "availabilityDelay",
      cell: ({ row }) => {
        return row.original.availabilityDelay || "N/A";
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Délai de disponibilité" />
      ),
      enableSorting: true,
      enableColumnFilter: true,
    },
    {
      accessorKey: "minimumRequiredDelay",
      cell: ({ row }) => {
        return row.original.minimumRequiredDelay || "N/A";
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Délai minimum requis" />
      ),
      enableSorting: true,
      enableColumnFilter: true,
    },
    {
      accessorKey: "serviceActivationDelay",
      cell: ({ row }) => {
        return row.original.serviceActivationDelay || "N/A";
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Délai d'activation du service" />
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
            baseUrl="/pilotages/request-type-service-categories/update/$id"
            onDelete={row.original.onDelete}
            resource="request_type_service_categories"
          />
        );
      },
    },
  ];

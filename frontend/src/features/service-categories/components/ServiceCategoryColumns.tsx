import type { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { momentFr } from "@/lib/momentFr";
import DataTableAction from "@/components/table/components/DataTableAction";
import { DataTableColumnHeader } from "@/components/table/components/DataTableColumnHeader";
import { CheckCircle, XCircle } from "lucide-react";
import type { ServiceCategory } from "@/shared/service-categories/types/service-category.type";

momentFr();

export const ServiceCategoryColumns: ColumnDef<ServiceCategory>[] = [
  {
    accessorKey: "sectorName",
    cell: ({ row }) => row.original.service.sector.sectorName,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Secteur" />
    ),
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "serviceName",
    cell: ({ row }) => row.original.service.serviceName,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Service" />
    ),
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "serviceCategoryName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Catégorie de service" />
    ),
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "isMultiLink",
    cell: ({ getValue }) => {
      return getValue<boolean>() ? (
        <CheckCircle className="text-success ml-5" />
      ) : (
        <XCircle className="text-destructive ml-5" />
      );
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Multi-liens" />
    ),
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "isMultiProvider",
    cell: ({ getValue }) => {
      return getValue<boolean>() ? (
        <CheckCircle className="text-success ml-5" />
      ) : (
        <XCircle className="text-destructive ml-5" />
      );
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Multi-fournisseurs" />
    ),
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "isRequiredExpertise",
    cell: ({ getValue }) => {
      return getValue<boolean>() ? (
        <CheckCircle className="text-success ml-5" />
      ) : (
        <XCircle className="text-destructive ml-5" />
      );
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Expertise requise" />
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
          baseUrl="/pilotages/service-categories/update/$id"
          onDelete={row.original.onDelete}
          resource="service_categories"
        />
      );
    },
  },
];

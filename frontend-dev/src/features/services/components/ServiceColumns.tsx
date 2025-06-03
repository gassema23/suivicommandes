import type { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { momentFr } from "@/lib/momentFr";
import DataTableAction from "@/features/table/components/DataTableAction";
import { DataTableColumnHeader } from "@/features/table/components/DataTableColumnHeader";
import type { Service } from "../types/service.type";

momentFr();

export const ServiceColumns: ColumnDef<Service>[] = [
  {
    accessorKey: "sectorId",
    cell: ({ row }) => {
      const sector = row.original.sector;
      return sector ? sector.sectorName : "Secteur inconnu";
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Secteur" />
    ),
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "serviceName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Service" />
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
          baseUrl="/pilotages/services/update/$id"
          onDelete={row.original.onDelete}
          resource="services"
        />
      );
    },
  },
];

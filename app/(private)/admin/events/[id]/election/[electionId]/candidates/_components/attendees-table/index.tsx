"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { SearchIcon } from "lucide-react";
import DataTable from "@/components/data-table/data-table";
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel, // Added this back
  useReactTable,
  FilterFn,
} from "@tanstack/react-table";
import SearchInput from "@/components/data-table/table-search-input";
import columns from "./column";
import DataTableBasicPagination2 from "@/components/data-table/data-table-basic-pagination-2";
import { TMemberWithEventElectionId } from "@/types";

type Props = {
  data: TMemberWithEventElectionId[];
  setSelectedMembers: Dispatch<
    SetStateAction<TMemberWithEventElectionId | undefined>
  >;
};

// 1. Custom Filter Logic: Handles commas and multi-word matching across fields
const customNameFilter: FilterFn<TMemberWithEventElectionId> = (
  row,
  columnId,
  value: string,
) => {
  const cleanSearch = value
    .replace(/,/g, " ")
    .replace(/[\u0000-\u001F]/g, "")
    .trim()
    .toLowerCase();

  if (!cleanSearch) return true;

  const keywords = cleanSearch.split(/\s+/).filter(Boolean);
  const { firstName, lastName, middleName, passbookNumber } = row.original;

  const targetString =
    `${firstName} ${lastName} ${middleName} ${passbookNumber}`.toLowerCase();

  // Every keyword typed must be found somewhere in the combined string
  return keywords.every((word) => targetString.includes(word));
};

const EventAttendeesTable = ({ data, setSelectedMembers }: Props) => {
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: customNameFilter, // Apply our custom logic here
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: { pageIndex: 0, pageSize: 20 },
    },
    enableMultiRowSelection: false,
  });

  // Sync selection to parent
  const selectedRows = table.getSelectedRowModel().flatRows;
  useEffect(() => {
    setSelectedMembers(selectedRows[0]?.original);
  }, [selectedRows, setSelectedMembers]);

  return (
    <div className="flex flex-1 flex-col gap-y-2 max-h-[40vh] overflow-auto ">
      <div className="flex flex-wrap items-center justify-between p-3 rounded-xl gap-y-2 ">
        <div className="flex items-center gap-x-4 text-muted-foreground">
          <div className="relative">
            <SearchIcon className="absolute text-muted-foreground w-4 h-auto top-3 left-2" />
            <SearchInput
              setGlobalFilter={(val) => setGlobalFilter(val)}
              globalFilter={globalFilter}
            />
          </div>
        </div>
      </div>
      <DataTable className="flex-1 bg-background/50" table={table} />
      <div>
        <DataTableBasicPagination2 table={table} />
      </div>
    </div>
  );
};

export default EventAttendeesTable;

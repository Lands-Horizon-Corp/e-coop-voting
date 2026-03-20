"use client";

import { useEffect, useState } from "react"; // Added useEffect
import { Settings2 } from "lucide-react";
import { Table, VisibilityState } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface DataTableViewOptionsProps<TData> {
  className?: string;
  table: Table<TData>;
  storageKey: string;
}

export default function DataTableViewOptions<TData>({
  table,
  className,
  storageKey,
}: DataTableViewOptionsProps<TData>) {
  const [open, setOpen] = useState(false);
  const localStorageKey = `${storageKey}-visibility`;
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(localStorageKey);
      if (saved) {
        try {
          const parsedVisibility = JSON.parse(saved) as VisibilityState;
          table.setColumnVisibility(parsedVisibility);
        } catch (error) {
          console.error("Failed to parse table visibility from storage", error);
        }
      }
    }
  }, [table, localStorageKey]);

  const saveVisibility = (updatedVisibility: VisibilityState) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(localStorageKey, JSON.stringify(updatedVisibility));
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          className={cn("flex ml-auto gap-x-2", className)}
        >
          <Settings2 className="w-4 h-4" />
          <span className="hidden md:block">View</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="border-none shadow-2 w-[150px]"
      >
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide(),
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => {
                  column.toggleVisibility(!!value);
                  setTimeout(() => {
                    const currentVisibility = table.getState().columnVisibility;
                    saveVisibility(currentVisibility);
                  }, 0);

                  setOpen(true);
                }}
                onSelect={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                {column.id.replace(/_/g, " ")}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

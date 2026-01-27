import React from "react";

import { Table as TanstackTable, flexRender } from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface DataTableProps<TData> {
    table: TanstackTable<TData>;
    className?: string;
    tableRowClassName? : string;
    isLoading?: boolean;
    isError? : boolean;
    loadingComponent? : React.ReactNode
}

export default function DataTable<TData>({
    table,
    isLoading,
    className,
    tableRowClassName,
    isError=false,
}: DataTableProps<TData>) {
    return (
        <div className={cn("rounded-md px-6 py-4 border-0 bg-background", className)}>
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext()
                                              )}
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => {
                            return (
                                <TableRow
                                    key={row.id}
                                    className={tableRowClassName}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => {
                                        return (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            );
                        })
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={table.getAllColumns().length}
                                className="h-24 text-center"
                            >
                                {isLoading ? <p className="text-center text-xs text-foreground/60 animate-pulse ">loading..</p> : (
                                    <div className={cn("text-foreground/40 text-xs text-center", isError && "text-rose-400")}>
                                        {isError ? "something went wrong" : 
                                        <div>
                                        <p className="text-2xl">🍃</p>
                                        no result found
                                        </div>
                                         }
                                    </div>
                                )}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

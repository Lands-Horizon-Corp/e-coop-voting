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
import { Skeleton } from "../ui/skeleton";

interface DataTableProps<TData> {
    table: TanstackTable<TData>;
    className?: string;
    tableRowClassName? : string;
    isLoading?: boolean;
    isError? : boolean;
    loadingComponent? : React.ReactNode,
    headerLayout? : string,
    tableRef?: React.MutableRefObject<null>
}

const DefaultLoading = () => (<div>
    <div className="flex w-full py-4 mx-auto space-x-4 justify-evenly">
        <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
        </div>
        <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 mx-auto w-[200px]" />
        </div>
        <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 ml-auto w-[200px]" />
        </div>
    </div>
    <p className="text-sm text-foreground/40">
        loading...
    </p>
    </div>)


export default function DataTable<TData>({
    table,
    isLoading,
    className,
    tableRowClassName,
    isError=false,
    loadingComponent = <DefaultLoading />,
    headerLayout,
    tableRef,
}: DataTableProps<TData>) {
    return (
        <div className={cn("rounded-md px-6 py-4 border-0 bg-background", className)}>
            <Table ref={tableRef} >
                <TableHeader className={cn(headerLayout)}>
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
                                {isLoading ? loadingComponent : (
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

"use client";
import React, { useRef, useState } from "react";
import { Plus, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/data-table/data-table";
import DataTablePagination from "@/components/data-table/data-table-pagination";
import DataTableViewOptions from "@/components/data-table/data-table-view-options";
import columns from "./column";
import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import CreateEventModal from "../modals/create-event-modal";
import { useGetAllEvent } from "@/hooks/api-hooks/event-api-hooks";
import { Input } from "@/components/ui/input";
import DataTableBasicPagination2 from "@/components/data-table/data-table-basic-pagination-2";
import { Card } from "@/components/ui/card";
import { user } from "next-auth";
import { Role } from "@prisma/client";

type TParams = {
    params: { id: number };
    user: user;
};

const EventTable = ({ user }: TParams) => {
    const [globalFilter, setGlobalFilter] = useState<string>("");
    const [createEvent, setCreateEvent] = useState(false);
    const onFocusSearch = useRef<HTMLInputElement | null>(null);

    const { data, isFetching, isLoading, isError } = useGetAllEvent();
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            globalFilter,
        },
        initialState: {
            pagination: { pageIndex: 0, pageSize: 20 },
        },
        onGlobalFilterChange: setGlobalFilter,
    });

    return (
        <div className="flex flex-1 flex-col gap-y-5">
            <div className="flex justify-between items-center px-5 lg:px-1">
                <CreateEventModal
                    state={createEvent}
                    user={user}
                    onClose={(state) => setCreateEvent(state)}
                />
                <div className="">
                    <h1 className="font-bold text-[min(22px,3.7vw)]">Events</h1>
                    <p className="text-[min(14px,3.4vw)]">
                        manage events and elections
                    </p>
                </div>
                <Button
                    disabled={user.role === Role.staff}
                    size="sm"
                    className={cn(
                        ` ${user.role === Role.staff ? "invisible" : "visible"} flex rounded-md justify-center items-center md:space-x-2 md:min-w-[7rem]`
                    )}
                    onClick={() => setCreateEvent(true)}
                >
                    Add Event
                    <Plus className="w-4 h-4" />
                </Button>
            </div>
            <Card className="h-full border-0 min-h-[70vh] bg-background dark:bg-secondary/30 ">
                <div className="flex w-full px-5  justify-between pt-5 items-center lg:justify-start space-x-3">
                    <div className="items-center w-full gap-x-4 text-muted-foreground">
                        <div className="relative">
                            <SearchIcon className="absolute w-4 h-auto top-3 left-2" />
                            <Input
                                ref={onFocusSearch}
                                placeholder="Search..."
                                value={globalFilter}
                                onChange={(event) =>
                                    setGlobalFilter(event.target.value)
                                }
                                className=" pl-8 bg-secondary border-0 border-b text-sm md:text-base ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                        </div>
                    </div>
                    <div className="">
                        <DataTableViewOptions className="h-10 " table={table} />
                    </div>
                </div>
                <DataTable
                    headerLayout="bg-secondary"
                    className="flex-1 min-h-[70vh] dark:bg-transparent rounded-2xl"
                    isError={isError}
                    isLoading={isLoading || isFetching}
                    table={table}
                />
                <div className="lg:hidden p-5">
                    <DataTableBasicPagination2 table={table} />
                </div>
                <div className="hidden lg:p-5 lg:block">
                    <DataTablePagination
                        pageSizes={[5, 10, 15]}
                        table={table}
                    />
                </div>
            </Card>
        </div>
    );
};

export default EventTable;

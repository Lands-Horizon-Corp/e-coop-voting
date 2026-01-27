"use client";
import React from "react";
import { format } from "date-fns";

import AttendanceQuorum from "./attendance-quorum";
import { Skeleton } from "@/components/ui/skeleton";
import LoadingSpinner from "@/components/loading-spinner";
import { useGetEventById } from "@/hooks/api-hooks/use-events";
import { CalendarCheck, CalendarDays, MapPin } from "lucide-react";

interface Props {
    eventId: number;
}

const EventDetailBar = ({ eventId }: Props) => {
    const { data: event, isPending } = useGetEventById({ eventId });

    return (
        <div className="p-2 w-full rounded-2xl flex flex-col md:flex-row gap-x-2 gap-y-1 md:justify-between shadow-md bg-background dark:bg-secondary/30">
            <div className="flex flex-row gap-x-4 gap-y-1 text-base flex-wrap 2xl:text-lg">
                <div className="flex space-x-2 items-center ">
                    <div className="p-1">
                        <CalendarCheck className="size-4 md:size-5 lg:size-6 text-primary" />
                    </div>
                    <h1 className="font-bold text-black/80  dark:text-white/80">
                        {!event ? (
                            <Skeleton className="h-8 w-36" />
                        ) : (
                            event.title
                        )}
                    </h1>
                </div>
                <div className="flex space-x-2 items-center ">
                    <div className=" p-1">
                        <MapPin className="text-yellow-500 size-4 md:size-5 lg:size-6 dark:text-yellow-400 " />
                    </div>
                    <h1 className="font-normal text-black/80 dark:text-white/80">
                        {!event ? (
                            <Skeleton className="h-8 w-24" />
                        ) : (
                            event.location
                        )}
                    </h1>
                </div>
                <div className="flex space-x-2 items-center">
                    <div className="p-1">
                        <CalendarDays className="size-4 md:size-5 lg:size-6 text-blue-800 dark:text-blue-500" />
                    </div>
                    <h1 className="font-normal text-black/80 dark:text-white/80">
                        {!event ? (
                            <Skeleton className="h-8 w-24" />
                        ) : (
                            format(event.date, "MMMM dd, yyyy")
                        )}
                    </h1>
                </div>
            </div>
            {!event ? (
                <Skeleton className="h-8 w-24 min-w-[400px] min-h-36" />
            ) : (
                <AttendanceQuorum eventId={event.id} />
            )}
        </div>
    );
};

export default EventDetailBar;

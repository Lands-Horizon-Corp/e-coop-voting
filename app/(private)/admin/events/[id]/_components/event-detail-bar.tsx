"use client";
import React from "react";
import { format } from "date-fns";
import { user } from "next-auth";

import AttendanceQuorum from "./attendance-quorum";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetEventById } from "@/hooks/api-hooks/use-events";
import { CalendarCheck, CalendarDays, MapPin } from "lucide-react";

interface Props {
    eventId: number;
    currentUser: user;
}

const EventDetailBar = ({ eventId, currentUser }: Props) => {
    const { data: event } = useGetEventById({ eventId });

    return (
        <div className="w-full rounded-xl p-4 flex flex-col gap-y-4 gap-x-6 md:flex-row md:items-center md:justify-between shadow-md bg-background dark:bg-secondary/30">
            <div className="flex min-w-0 flex-col gap-y-2">
                {!event ? (
                    <>
                        <Skeleton className="h-7 w-48" />
                        <Skeleton className="h-5 w-64" />
                    </>
                ) : (
                    <>
                        <div className="flex items-center gap-x-3 min-w-0">
                            <CalendarCheck className="size-6 shrink-0 text-primary" />
                            <h1 className="truncate text-xl font-bold lg:text-2xl text-black/80 dark:text-white/80">
                                {event.title}
                            </h1>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-base text-muted-foreground">
                            <span className="flex items-center gap-x-2 min-w-0">
                                <MapPin className="size-5 shrink-0 text-yellow-500 dark:text-yellow-400" />
                                <span className="truncate">{event.location}</span>
                            </span>
                            <span className="flex items-center gap-x-2 text-nowrap">
                                <CalendarDays className="size-5 shrink-0 text-blue-800 dark:text-blue-500" />
                                {format(event.date, "MMM dd, yyyy")}
                            </span>
                        </div>
                    </>
                )}
            </div>
            {!event ? (
                <Skeleton className="h-24 w-full md:w-96" />
            ) : (
                <AttendanceQuorum
                    eventId={event.id}
                    currentUser={currentUser}
                />
            )}
        </div>
    );
};

export default EventDetailBar;

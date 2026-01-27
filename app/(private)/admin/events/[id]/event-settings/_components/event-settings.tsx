"use client";
import React from "react";

import UpdateEventForm from "../../../_components/update-event-form";
import LoadingSpinner from "@/components/loading-spinner";

import { useGetEventById } from "@/hooks/api-hooks/use-events";

interface Props {
    eventId: number;
}

const EventSettings = ({ eventId }: Props) => {
    const { isPending, data: event } = useGetEventById({ eventId });

    if (isPending) return <LoadingSpinner className="mx-auto" />;

    return (
        <div className="w-full h-full p-4">
            <UpdateEventForm eventId={eventId} defaultValues={event} />
        </div>
    );
};

export default EventSettings;

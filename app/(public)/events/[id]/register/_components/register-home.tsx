"use client";
import React from "react";
import { format, isSameDay } from "date-fns";

import Attendance from "./attendance";
import InvalidPrompt from "@/components/invalid-prompt";
import LoadingSpinner from "@/components/loading-spinner";

import { useEvent } from "@/hooks/public-api-hooks/use-events-api";

type Props = { eventId: number };

const RegisterHome = ({ eventId }: Props) => {
    const { event, isLoading } = useEvent(eventId, 5 * 1000);

    if (isLoading) return <LoadingSpinner className="fixed top-1/2 left-1/2" />;
    if (!event) return <InvalidPrompt message="Event Not Found" />;

    const today = new Date();

    const eventDate = new Date(event.date);
    eventDate.setHours(23, 59, 59, 999);

    if (new Date() > eventDate)
        return (
            <InvalidPrompt
                message={`This event has already passed.  ${format(event.date, "MMMM dd, yyyy")}.`}
            />
        );

    if (event.registrationOnEvent === true && !isSameDay(today, event.date))
        return (
            <InvalidPrompt
                message={`Registration will be open in ${format(event.date, "MMMM dd, yyyy")}.`}
            />
        );

    if (!event.isRegistrationOpen)
        return <InvalidPrompt message="Event registration has been closed." />;

    return (
        <div className="flex flex-col py-20 px-5 gap-y-6 min-h-screen w-full items-center">
            <p className="text-2xl lg:text-4xl uppercase text-center">
                {event.title}
            </p>
            <div className="w-5 h-2 bg-orange-400 rounded-full" />
            <div className="py-8 lg:py-10 w-full sm:w-fit">
                <Attendance event={event} eventId={eventId} />
            </div>
        </div>
    );
};

export default RegisterHome;

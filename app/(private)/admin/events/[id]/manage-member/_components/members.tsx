"use client";
import React from "react";
import { user } from "next-auth";

import MemberTable from "./member-table";
import { useGetEventById } from "@/hooks/api-hooks/use-events";
import InvalidPrompt from "@/components/invalid-prompt";
import LoadingSpinner from "@/components/loading-spinner";

interface Props {
    user: user;
    eventId: number;
}

const Members = ({ user, eventId }: Props) => {
    const { data: event, isPending } = useGetEventById({ eventId });

    if (!event && !isPending)
        return <InvalidPrompt message="This event is missing" />;

    if (isPending && !event) return <LoadingSpinner className="mx-auto my-16" />;

    return <MemberTable event={event} user={user} id={eventId} />;
};

export default Members;

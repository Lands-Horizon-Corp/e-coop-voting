"use client";
import React from "react";
import { useEventUpdatePoller } from "@/hooks/use-event-update-poller";

type Props = { eventId: number | string; source: string };

const Test = ({ eventId, source }: Props) => {
    const poller = useEventUpdatePoller({ eventId });

    console.log(source, poller.data);

    return (
        <div>
            {source} - {poller.data?.subUpdatedAt?.toLocaleString() ?? 'no-update'}
        </div>
    );
};

export default Test;

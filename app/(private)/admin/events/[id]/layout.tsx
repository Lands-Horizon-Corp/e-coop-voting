import db from "@/lib/database";
import React, { ReactNode } from "react";

import BackButton from "@/components/back";
import NotFound from "./_components/not-found";
import EventNav from "./_components/event-nav";
import EventHeader from "./_components/event-header";
import { Separator } from "@/components/ui/separator";
import { eventIdSchema } from "@/validation-schema/commons";
import EventDetailBar from "./_components/event-detail-bar";

type Props = {
    children: ReactNode;
    params: { id: number; electionId: number };
};

const EventLayout = async ({ children, params }: Props) => {
    const eventIdValidation = eventIdSchema.safeParse(params.id);

    if (!eventIdValidation.success)
        throw eventIdValidation.error.issues[0].message;

    const event = await db.event.findUnique({
        where: { id: eventIdValidation.data },
        include: { election: true },
    });

    if (!event) return <NotFound />;

    return (
        <div className="font-poppins pt-2 lg:px-7 space-y-2 lg:space-y-4 h-fit overflow-hidden">
            <div className="w-full px-2 lg:p-2 flex items-center justify-between">
                <EventHeader params={params} />
                <BackButton />
            </div>
            <EventDetailBar eventId={event.id} />
            <div className="flex flex-col bg-background rounded-xl min-h-screen shadow-xl dark:bg-secondary/30 py-2  overflow-x-hidden w-full ">
                <div className="px-2 w-full">
                    <EventNav event={event} />
                    <Separator className="hidden md:block"></Separator>
                </div>
                <div>{children}</div>
            </div>
        </div>
    );
};

export default EventLayout;

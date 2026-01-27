import React from "react";
import { isAllowed } from "@/lib/utils";
import { currentUserOrFalse } from "@/lib/auth";

import AttendanceTable from "./_components/attendance-table";

import { eventIdSchema } from "@/validation-schema/commons";

type Props = { params: { id: number } };

const AttendancePage = async ({ params }: Props) => {
    const user = await currentUserOrFalse();

    if (!isAllowed(["root", "admin", "staff"], user))
        throw new Error("You don't have access to this page");

    const eventId = eventIdSchema.parse(params.id);

    return (
        <div className="flex p-4 min-h-screen flex-col w-full">
            <AttendanceTable eventId={eventId} />
        </div>
    );
};

export default AttendancePage;

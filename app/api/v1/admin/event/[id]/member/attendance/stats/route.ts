import { NextRequest, NextResponse } from "next/server";

import db from "@/lib/database";
import { validateId } from "@/lib/server-utils";
import { currentUserOrThrowAuthError } from "@/lib/auth";
import { routeErrorHandler } from "@/errors/route-error-handler";

type TParams = {
    params: { id: number };
};

export const GET = async (req: NextRequest, { params }: TParams) => {
    try {
        await currentUserOrThrowAuthError();
        const eventId = Number(params.id);

        validateId(eventId);

        const getMembersRegistered = await db.eventAttendees.findMany({
            where: {
                AND: { eventId: eventId, registered: true },
            },
        });

        const getMembers = await db.eventAttendees.findMany({
            where: {
                eventId: eventId,
            },
        });

        return NextResponse.json({
            totalAttendees: getMembers.length,
            totalIsRegistered: getMembersRegistered.length,
        });
    } catch (error) {
        return routeErrorHandler(error, req);
    }
};

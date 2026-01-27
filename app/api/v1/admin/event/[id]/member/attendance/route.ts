import db from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

import { routeErrorHandler } from "@/errors/route-error-handler";
import { eventIdSchema } from "@/validation-schema/commons";
import { currentUserOrThrowAuthError } from "@/lib/auth";

type TParams = { params: { id: number } };

export const GET = async (req: NextRequest, { params }: TParams) => {
    try {
        const eventId = eventIdSchema.parse(params.id);
        const currentUser = await currentUserOrThrowAuthError();

        const where =
            currentUser.role !== "staff"
                ? { eventId, registered: true }
                : {
                      eventId,
                      registered: true,
                      registrationAssistId: currentUser.id,
                  };

        const eventAttendees = await db.eventAttendees.findMany({
            where,
            include: {
                registeredBy: {
                    select: {
                        id: true,
                        picture: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        return NextResponse.json(eventAttendees);
    } catch (e) {
        routeErrorHandler(e, req);
    }
};

import { NextRequest, NextResponse } from "next/server";

import db from "@/lib/database";
import { currentUserOrThrowAuthError } from "@/lib/auth";
import { routeErrorHandler } from "@/errors/route-error-handler";
import { memberToggleSurveyedSchema } from "@/validation-schema/member";
import { eventIdParamSchema } from "@/validation-schema/api-params";

type TParams = { params: { id: number; memberId: string } };

export const PATCH = async (req: NextRequest, { params }: TParams) => {
    try {
        await currentUserOrThrowAuthError();
        const { id: eventId } = await eventIdParamSchema.parseAsync(params);

        const data = await memberToggleSurveyedSchema.parseAsync(
            await req.json()
        );

        const updatedMember = await db.eventAttendees.update({
            where: { id: params.memberId },
            include: {
                event: {
                    select: {
                        election: {
                            select: { id: true },
                        },
                    },
                },
            },
            data,
        });

        await db.event.update({
            where: { id: eventId },
            data: { subUpdatedAt: new Date() },
        });

        return NextResponse.json(updatedMember);
    } catch (e) {
        console.log(e);
        return routeErrorHandler(e, req);
    }
};

import db from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import { routeErrorHandler } from "@/errors/route-error-handler";

import { eventIdParamSchema } from "@/validation-schema/api-params";
import { createIncentiveClaimPublic } from "@/validation-schema/incentive";
import { validateClaimAuth } from "./service";

type TParams = { params: { id: number } };

export const POST = async (req: NextRequest, { params }: TParams) => {
    try {
        const { id: eventId } = eventIdParamSchema.parse(params);
        const data = createIncentiveClaimPublic.parse(await req.json());

        const { attendeeId, passbookNumber } = await validateClaimAuth(
            req,
            eventId
        );

        const member = await db.eventAttendees.findUnique({
            where: {
                id: attendeeId,
                eventId_passbookNumber: {
                    eventId,
                    passbookNumber,
                },
            },
        });

        if (!member)
            return NextResponse.json(
                {
                    message:
                        "We could not find you in event member list, please check the passbook number & otp you provide",
                },
                { status: 404 }
            );

        await db.incentiveClaims.create({
            data: {
                ...data,
                claimedOnline: true,
                eventAttendeeId: member.id,
                eventId,
            },
        });

        await db.event.update({
            where: { id: eventId },
            data: { subUpdatedAt: new Date() },
        });

        return NextResponse.json("Claimed!");
    } catch (e) {
        return routeErrorHandler(e, req);
    }
};

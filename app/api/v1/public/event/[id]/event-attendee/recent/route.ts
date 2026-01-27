import db from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

import { TMemberAttendeesMinimalInfo } from "@/types";
import { routeErrorHandler } from "@/errors/route-error-handler";
import { eventIdParamSchema } from "@/validation-schema/api-params";

type TParams = { params: { id: number } };

export const GET = async (req: NextRequest, { params }: TParams) => {
    try {
        const { id: eventId } = await eventIdParamSchema.parseAsync(params);
        const recentPb = req.cookies.get("recent-user")?.value;

        if (!recentPb)
            return NextResponse.json(
                { message: "No recent user" },
                { status: 400 }
            );

        const { searchParams } = new URL(req.url);
        const reason =
            (searchParams.get("reason") as "registration" | "voting") ??
            "registration";

        const event = await db.event.findUnique({
            where: { id: eventId },
            include: { election: true },
        });

        if (!event)
            throw new Error(
                "Event does not exist, that's why we can't search member"
            );

        let includeBday = true;

        if (reason === "registration")
            includeBday = event.requireBirthdayVerification
                ? false
                : includeBday;

        if (reason === "voting")
            includeBday = event.election?.allowBirthdayVerification
                ? false
                : true;

        const member: TMemberAttendeesMinimalInfo | null =
            await db.eventAttendees.findUnique({
                where: {
                    eventId_passbookNumber: {
                        passbookNumber: recentPb,
                        eventId,
                    },
                },
                select: {
                    id: true,
                    firstName: true,
                    middleName: true,
                    lastName: true,
                    contact: true,
                    picture: true,
                    birthday: includeBday,
                    passbookNumber: true,
                    registered: true,
                    voted: true,
                    surveyed: true,
                },
            });

        if (!member)
            return NextResponse.json(
                { message: "No recent user" },
                { status: 404 }
            );

        return NextResponse.json(member);
    } catch (e) {
        return routeErrorHandler(e, req);
    }
};

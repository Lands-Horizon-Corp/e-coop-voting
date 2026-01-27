import db from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

import { TMemberAttendeesMinimalInfo } from "@/types";
import { routeErrorHandler } from "@/errors/route-error-handler";
import { eventIdParamSchema } from "@/validation-schema/api-params";
import { memberAttendeeSearchSchema } from "@/validation-schema/event-registration-voting";

type TParams = { params: { id: number } };

export const POST = async (req: NextRequest, { params }: TParams) => {
    try {
        const { id: eventId } = await eventIdParamSchema.parseAsync(params);

        const { passbookNumber, nameSearch, reason } =
            memberAttendeeSearchSchema.parse(await req.json());

        const event = await db.event.findUnique({
            where: { id: eventId },
            include: { election: true },
        });

        if (!event)
            throw new Error(
                "Event does not exist, that's why we can't search member"
            );

        let result: TMemberAttendeesMinimalInfo[] = [];

        let includeBday = true;

        if (reason === "registration")
            includeBday = event.requireBirthdayVerification
                ? false
                : includeBday;

        if (reason === "voting")
            includeBday = event.election?.allowBirthdayVerification
                ? false
                : true;

        if (passbookNumber && passbookNumber.length >= 1) {
            result = await db.eventAttendees.findMany({
                select: {
                    id: true,
                    firstName: true,
                    passbookNumber: true,
                    middleName: true,
                    lastName: true,
                    contact: true,
                    birthday: includeBday,
                    picture: true,
                    registered: true,
                    voted: true,
                    surveyed: true,
                },
                where: {
                    eventId,
                    passbookNumber,
                },
            });
        } else if (nameSearch && nameSearch.length >= 1) {
            const [lastName, firstName] = nameSearch.split(", ");
            result = await db.eventAttendees.findMany({
                select: {
                    id: true,
                    firstName: true,
                    passbookNumber: true,
                    middleName: true,
                    lastName: true,
                    contact: true,
                    picture: true,
                    birthday: includeBday,
                    registered: true,
                    voted: true,
                    surveyed: true,
                },
                where: {
                    eventId,
                    AND: [
                        {
                            firstName: {
                                contains: firstName,
                                mode: "insensitive",
                            },
                        },
                        { lastName: { equals: lastName, mode: "insensitive" } },
                    ],
                },
            });
        } else {
            return NextResponse.json(
                { message: "passbook or name search was not provided" },
                { status: 400 }
            );
        }

        if (result.length === 0)
            return NextResponse.json(
                { message: "Not found, for verification" },
                { status: 404 }
            );

        return NextResponse.json(result);
    } catch (e) {
        return routeErrorHandler(e, req);
    }
};

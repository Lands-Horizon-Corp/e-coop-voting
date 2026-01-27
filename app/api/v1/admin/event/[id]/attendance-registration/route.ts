import db from "@/lib/database";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { currentUserOrThrowAuthError } from "@/lib/auth";
import { eventIdSchema } from "@/validation-schema/commons";
import { routeErrorHandler } from "@/errors/route-error-handler";
import { adminRegisterMemberSchema } from "@/validation-schema/event";

type TParams = { params: { id: number } };

export const POST = async (req: NextRequest, { params }: TParams) => {
    try {
        const eventId = eventIdSchema.parse(params.id);
        const currentUser = await currentUserOrThrowAuthError();

        const { passbookNumber, operation } =
            await adminRegisterMemberSchema.parseAsync(await req.json());

        await db.$transaction(async (dbCtx) => {
            await dbCtx.eventAttendees.update({
                where: {
                    eventId_passbookNumber: {
                        eventId,
                        passbookNumber,
                    },
                },
                data: {
                    registered: operation === "register" ? true : false,
                    registeredAt: operation === "register" ? new Date() : null,
                    registrationAssistId:
                        operation === "register" ? currentUser.id : null,
                },
            });

            await dbCtx.event.update({
                where: { id: eventId },
                data: { subUpdatedAt: new Date() },
            });
        });

        return NextResponse.json("Attendance Registered");
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError)
            if (e.code === "P2025")
                return NextResponse.json(
                    {
                        message:
                            "The member you are trying to register doesn't exist.",
                    },
                    { status: 400 }
                );
        return routeErrorHandler(e, req);
    }
};

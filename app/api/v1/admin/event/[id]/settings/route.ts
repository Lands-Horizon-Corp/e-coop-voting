import db from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import { currentUserOrThrowAuthError } from "@/lib/auth";

import { routeErrorHandler } from "@/errors/route-error-handler";
import { eventIdParamSchema } from "@/validation-schema/api-params";
import { updateEventSchema } from "@/validation-schema/event";

type TParams = { params: { id: number } };

export const GET = async (req: NextRequest, { params }: TParams) => {
    try {
        await currentUserOrThrowAuthError();

        const { id } = eventIdParamSchema.parse(params);

        const currentEventSettings = await db.event.findUnique({
            where: { id },
            select: {
                registrationOnEvent: true,
                defaultMemberSearchMode: true,
            },
        });

        if (!currentEventSettings)
            return NextResponse.json(
                { message: "Couldn't find current event settings" },
                { status: 404 }
            );

        return NextResponse.json(currentEventSettings);
    } catch (e) {
        return routeErrorHandler(e, req);
    }
};

export const PATCH = async (req: NextRequest, { params }: TParams) => {
    try {
        const { id } = eventIdParamSchema.parse(params);
        await currentUserOrThrowAuthError();
        const newSettings = updateEventSchema.parse(await req.json());

        const updatedSettings = await db.event.update({
            where: { id },
            data: {
                ...newSettings,
                subUpdatedAt: new Date(),
            },
            include: {
                election: true,
            },
        });

        return NextResponse.json(updatedSettings);
    } catch (e) {
        return routeErrorHandler(e, req);
    }
};

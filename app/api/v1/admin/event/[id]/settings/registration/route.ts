import { NextRequest, NextResponse } from "next/server";

import db from "@/lib/database";
import { currentUserOrThrowAuthError } from "@/lib/auth";
import { routeErrorHandler } from "@/errors/route-error-handler";
import { eventIdParamSchema } from "@/validation-schema/api-params";
import { toggleRegistrationStatusSchema } from "@/validation-schema/event-settings";

type TParams = { params: { id: number } };

export const GET = async (req: NextRequest, { params }: TParams) => {
    try {
        const { id } = eventIdParamSchema.parse(params);
        await currentUserOrThrowAuthError();

        const preRegistrationSettings = await db.event.findUnique({
            where: { id },
            select: { registrationOnEvent: true },
        });

        if (!preRegistrationSettings)
            return NextResponse.json(
                { message: "Event was not found" },
                { status: 404 }
            );

        return NextResponse.json(preRegistrationSettings);
    } catch (e) {
        return routeErrorHandler(e, req);
    }
};

export const POST = async (req: NextRequest, { params }: TParams) => {
    try {
        const { id } = eventIdParamSchema.parse(params);
        await currentUserOrThrowAuthError();
        const { isRegistrationOpen } =
            await toggleRegistrationStatusSchema.parseAsync(await req.json());

        const updatedSettings = await db.event.update({
            where: { id },
            data: {
                isRegistrationOpen,
                subUpdatedAt: new Date(),
            },
            select: { registrationOnEvent: true },
        });

        return NextResponse.json(updatedSettings);
    } catch (e) {
        return routeErrorHandler(e, req);
    }
};

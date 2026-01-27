import db from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

import { currentUserOrThrowAuthError } from "@/lib/auth";
import { routeErrorHandler } from "@/errors/route-error-handler";
import {
    eventIdParamSchema,
    incentiveIdAndAssignIdParamSchema,
} from "@/validation-schema/api-params";
import { updateIncentiveAssignedSchema } from "@/validation-schema/incentive";

type TParams = {
    params: {
        incentiveId: number;
        assignId: number;
        id: number;
    };
};

export const PATCH = async (req: NextRequest, { params }: TParams) => {
    try {
        const { assignId, incentiveId } =
            incentiveIdAndAssignIdParamSchema.parse(params);
        const { id: eventId } = await eventIdParamSchema.parseAsync(params);
        const currentUser = await currentUserOrThrowAuthError();

        const updateData = await updateIncentiveAssignedSchema.parseAsync(
            await req.json()
        );

        const updatedAssigned = await db.incentiveAssigned.update({
            where: { id: assignId, incentiveId },
            data: {
                ...updateData,
                updatedBy: currentUser.id,
            },
        });

        await db.event.update({
            where: { id: eventId },
            data: { subUpdatedAt: new Date() },
        });

        return NextResponse.json(updatedAssigned);
    } catch (e) {
        return routeErrorHandler(e, req);
    }
};

export const DELETE = async (req: NextRequest, { params }: TParams) => {
    try {
        const { assignId, incentiveId } =
            incentiveIdAndAssignIdParamSchema.parse(params);
        const { id: eventId } = await eventIdParamSchema.parseAsync(params);

        await currentUserOrThrowAuthError();

        // check if there is assisted, if there is don't allow deletion
        const incentiveAssigned = await db.incentiveAssigned.findUnique({
            where: {
                id: assignId,
                incentiveId,
                claims: {
                    some: { assignedId: assignId },
                },
            },
        });

        if (incentiveAssigned)
            return NextResponse.json(
                {
                    message:
                        "You cannot delete this assist as this user already assisted a member, delete those entry first before deleting",
                },
                { status: 403 }
            );

        await db.incentiveAssigned.delete({
            where: { id: assignId, incentiveId },
        });

        await db.event.update({
            where: { id: eventId },
            data: {
                subUpdatedAt: new Date(),
            },
        });

        return NextResponse.json("Removed assigned incentive");
    } catch (e) {
        return routeErrorHandler(e, req);
    }
};

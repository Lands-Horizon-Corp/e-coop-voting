import { routeErrorHandler } from "@/errors/route-error-handler";
import { currentUserOrThrowAuthError } from "@/lib/auth";
import { validateId } from "@/lib/server-utils";
import { NextRequest, NextResponse } from "next/server";
import { TUpdateEvent } from "@/types";
import { updateEventSchema } from "@/validation-schema/event";
import db from "@/lib/database";
type TParams = { params: { id: number; electionId?: number } };

export const PATCH = async (req: NextRequest, { params }: TParams) => {
    try {
        const id = Number(params.id);
        validateId(id);
        const data: TUpdateEvent = await req.json();
        const user = await currentUserOrThrowAuthError();
        updateEventSchema.parse(data);

        const UpdateEvent = await db.event.update({
            where: { id: id },
            data: {
                title: data.title,
                description: data.description,
                location: data.location,
                date: data.date,
                updatedBy: user.id,
                coverImage: data.coverImage,
                branchId: data.branchId,
                subUpdatedAt : new Date()
            },
        });

        return NextResponse.json(UpdateEvent);
    } catch (e) {
        return routeErrorHandler(e, req);
    }
};

export const DELETE = async (req: NextRequest, { params }: TParams) => {
    try {
        const id = Number(params.id);
        validateId(id);
        const user = await currentUserOrThrowAuthError();
        const isPermanentDelete = false;
        if (isPermanentDelete) {
            const permanentDelete = await db.event.delete({
                where: { id: id },
            });
            return NextResponse.json(permanentDelete);
        }
        const softDelete = await db.event.update({
            where: { id: id },
            data: {
                deleted: true,
                deletedBy: user.id,
                subUpdatedAt : new Date()
            },
        });
        return NextResponse.json(softDelete);
    } catch (e) {
        return routeErrorHandler(e, req);
    }
};

export const GET = async (req: NextRequest, { params }: TParams) => {
    try {
        const eventId = Number(params.id);
        validateId(eventId);
        const event = await db.event.findUnique({
            where: {
                id: eventId,
            },
            include: {
                election: true,
            },
        });
        return NextResponse.json(event);
    } catch (e) {
        return routeErrorHandler(e, req);
    }
};

import db from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

import { currentUserOrThrowAuthError } from "@/lib/auth";
import { routeErrorHandler } from "@/errors/route-error-handler";
import { eventIdParamSchema } from "@/validation-schema/api-params";

type TParams = { params: { id: number } };

export const GET = async (req: NextRequest, { params }: TParams) => {
    try {
        const { id: eventId } = eventIdParamSchema.parse(params);
        const currentUser = await currentUserOrThrowAuthError();

        const where = currentUser.role !== "staff" ? { eventId } :  { eventId, userId : currentUser.id }

        const listOfAssignees = await db.incentiveAssigned.findMany({
            select: {
                id: true,
                eventId: true,
                incentiveId: true,
                assignedQuantity: true,
                userId : true,
                user: {
                    select: {
                        id : true,
                        name: true,
                        picture: true,
                    },
                },
                incentive: {
                    select: {
                        itemName: true,
                        eventId: true,
                    },
                },
                _count: {
                    select: {
                        claims : {
                            where : {
                                releasedAt : { not : null }
                            }
                        } 
                    },
                },
            },
            where 
        });

        return NextResponse.json(listOfAssignees);
    } catch (e) {
        return routeErrorHandler(e, req);
    }
};

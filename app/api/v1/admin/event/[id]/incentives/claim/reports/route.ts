import db from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

import { TIncentiveClaimReportsPerUser } from "@/types";
import { currentUserOrThrowAuthError } from "@/lib/auth";
import { userIdsSchema } from "@/validation-schema/user";
import { routeErrorHandler } from "@/errors/route-error-handler";
import { eventIdParamSchema } from "@/validation-schema/api-params";

type TParams = { params: { id: number } };

// Request like this by providing an ids seach param
// if no ids provided, current user id will be used to get the report
// Example http://localhost:3000/api/v1/admin/event/1/incentives/reports?ids=1,2,3,4

export const GET = async (req: NextRequest, { params }: TParams) => {
    try {
        const { id: eventId } = eventIdParamSchema.parse(params);
        const currentUser = await currentUserOrThrowAuthError();

        const searchParams = new URL(req.url).searchParams;

        let rawUserIds = searchParams.get("ids") ?? `${currentUser.id}`;

        if (rawUserIds.replaceAll(/\s/g, "").length === 0)
            rawUserIds = `${currentUser.id}`;

        let userIds = userIdsSchema.parse(rawUserIds.split(","));

        const incentives = await db.incentives.findMany({
            select: {
                id: true,
                itemName: true,
            },
            where: { eventId },
            orderBy: { id: "asc" },
        });

        if (incentives.length === 0)
            return NextResponse.json([]);

        let reports: TIncentiveClaimReportsPerUser[] = [];

        await Promise.all(
            userIds.map(async (userId) => {
                const user = await db.user.findUnique({
                    select: {
                        id: true,
                        picture: true,
                        name: true,
                        email: true,
                    },
                    where: { id: userId },
                });

                if (!user) return;

                const claims = await db.eventAttendees.findMany({
                    where: {
                        incentiveClaimed: {
                            some: { eventId, assistedById: { equals: userId } },
                        },
                    },
                    select: {
                        id: true,
                        passbookNumber: true,
                        firstName: true,
                        lastName: true,
                        incentiveClaimed: {
                            select: { incentiveId: true },
                            where: { assistedById: { equals: userId } },
                            orderBy: { incentiveId: "asc" },
                        },
                    },
                    orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
                });

                const incentiveAssigned = await db.incentiveAssigned.findMany({
                    select : { 
                        userId : true,
                        incentiveId : true,
                        assignedQuantity : true,
                        _count : {
                            select : {
                               claims : {
                                    where : { eventId }
                                } 
                            }
                        }
                    },
                    where : { eventId, userId : user.id },
                    orderBy: { id: "asc" },
                });

                reports.push({
                    user,
                    incentives,
                    incentiveAssigned,
                    membersAssisted: claims,
                });
            }),
        );

        reports.sort((a, b) => a.user.id - b.user.id);

        return NextResponse.json(reports);
    } catch (e) {
        return routeErrorHandler(e, req);
    }
};

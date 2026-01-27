import db from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

import { currentUserOrThrowAuthError } from "@/lib/auth";
import { routeErrorHandler } from "@/errors/route-error-handler";
import { eventIdSchema } from "@/validation-schema/commons";
import { createIncentiveSchema } from "@/validation-schema/incentive";

type TParams = { params: { id: number } };

export const GET = async (req: NextRequest, { params }: TParams) => {
    try {
        await currentUserOrThrowAuthError();
        const eventId = eventIdSchema.parse(params.id);
        const searchParams = new URL(req.url).searchParams;

        const includeAssignees = searchParams.get("withAssignee") === "true";

        const claimsWithClaimAndAssignedCount = await db.incentives.findMany({
            where: { eventId },
            include: {
                _count: {
                    select: {
                        claimed: {
                            where: {
                                releasedAt: { not: null },
                            },
                        },
                        assigned: true,
                    },
                },
                assigned: includeAssignees
                    ? {
                          include: {
                              user: {
                                  select: {
                                      id: true,
                                      picture: true,
                                      name: true,
                                      email: true,
                                  },
                              },
                          },
                      }
                    : false,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(claimsWithClaimAndAssignedCount);
    } catch (e) {
        return routeErrorHandler(e, req);
    }
};

export const POST = async (req: NextRequest, { params }: TParams) => {
    try {
        const user = await currentUserOrThrowAuthError();
        const eventId = eventIdSchema.parse(params.id);
        let { data } = await req.json();

        const validatedData = createIncentiveSchema.parse(data);

        const newIncentive = await db.incentives.create({
            data: {
                ...validatedData,
                eventId,
                createdBy: user.id,
            },
        });

        await db.event.update({
            where: { id: eventId },
            data: {
                subUpdatedAt: new Date(),
            },
        });

        return NextResponse.json(newIncentive);
    } catch (e) {
        return routeErrorHandler(e, req);
    }
};

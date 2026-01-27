import db from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

import { currentUserOrThrowAuthError } from "@/lib/auth";
import { eventIdSchema } from "@/validation-schema/commons";
import { routeErrorHandler } from "@/errors/route-error-handler";
import { Role } from "@prisma/client";

type TParams = { params: { id: number } };

type TConditionSet = {
    roles: Role[];
    condition: Record<string, any>;
};

export const GET = async (req: NextRequest, { params }: TParams) => {
    try {
        const currentUser = await currentUserOrThrowAuthError();
        const eventId = eventIdSchema.parse(params.id);

        const event = await db.event.findUnique({ where: { id: eventId } })

        if (!event) return NextResponse.json({ message: "Event wasn't found or does not exist" }, { status: 404 });

        const { coopId, branchId } = event;

        const getCondition = (currentRole: Role) => {
            const conditionSet: TConditionSet[] = [
                {
                    roles: [Role.root, Role.coop_root],
                    condition: {
                        OR: [
                            {
                                coopId,
                                branchId,
                            },
                            {
                                role: Role.root,
                            },
                            {
                                role: Role.coop_root,
                                coopId,
                            },
                        ],
                    },
                },
                {
                    roles: [Role.admin],
                    condition: {
                        OR: [
                            {
                                role: Role.root,
                            },
                            {
                                role: Role.coop_root,
                            },
                            {
                                role: { in: [Role.admin, Role.staff] },
                                coopId,
                                branchId,
                            },
                        ],
                    },
                },
            ];

            const filteredCondition = conditionSet.find((condition) =>
                condition.roles.includes(currentRole),
            );

            return filteredCondition
                ? filteredCondition.condition
                : { id: currentUser.id };
        };

        const usersWithAssignedIncentives = await db.user.findMany({
            where: {
                deleted: false,
                ...getCondition(currentUser.role)
            },
            include: {
                assignedIncentive: {
                    where: {
                        eventId,
                    },
                },
            },
        });

        return NextResponse.json(usersWithAssignedIncentives);
    } catch (e) {
        return routeErrorHandler(e, req);
    }
};

import db from "@/lib/database";
import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { currentUserOrThrowAuthError } from "@/lib/auth";
import { USER_SELECTS_WITH_NO_PASSWORD } from "@/services/user";
import { routeErrorHandler } from "@/errors/route-error-handler";
import { eventIdParamSchema } from "@/validation-schema/api-params";

type TConditionSet = {
    roles: Role[];
    condition: Record<string, any>;
};

type TParams = { params: { id: number } };

// This route is only for the event users, instead of returning all users regardless of coops or branch
// this do the opposite which returns only the users for that coop or branch based on the event
export const GET = async (req: NextRequest, { params }: TParams) => {
    try {
        const currentUser = await currentUserOrThrowAuthError();

        const { id } = eventIdParamSchema.parse(params);

        const event = await db.event.findUnique({ where: { id } });

        if (!event)
            return NextResponse.json(
                { message: "Couldn't get users list as the event doesn't exist." },
                { status: 404 },
            );

        const { coopId, branchId } = event;

        const getCondition = (currentRole: Role) => {
            const conditionSet: TConditionSet[] = [
                {
                    roles: [Role.root, Role.coop_root],
                    condition: {
                        OR: [
                            {
                                coopId,
                                branchId
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

        const users = await db.user.findMany({
            where: {
                deleted: false,
                ...getCondition(currentUser.role),
            },
            orderBy: { createdAt: "desc" },
            select: USER_SELECTS_WITH_NO_PASSWORD,
        });
        return NextResponse.json(users);
    } catch (e) {
        console.log(e);
        return routeErrorHandler(e, req);
    }
};

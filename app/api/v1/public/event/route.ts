export const dynamic = "force-dynamic";

import db from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

import { routeErrorHandler } from "@/errors/route-error-handler";
import { currentUserOrFalse } from "@/lib/auth";
import { Event, Role } from "@prisma/client";

type TConditionSet = {
    roles: Role[];
    condition: {
        coopId?: number;
        branchId?: number;
    };
};

export const GET = async (req: NextRequest) => {
    try {
        const currentUser = await currentUserOrFalse();
        let events: Event[] = [];

        const getCondition = () => {
            if (!currentUser) return {};

            const conditionSet: TConditionSet[] = [
                { roles: [Role.root], condition: {} },
                {
                    roles: [Role.coop_root],
                    condition: { coopId: currentUser.coopId },
                },
                {
                    roles: [Role.admin, Role.staff],
                    condition: { branchId: currentUser.branchId },
                },
            ];

            const filteredCondition = conditionSet.find((condition) =>
                condition.roles.includes(currentUser.role),
            );

            return filteredCondition ? filteredCondition.condition : {};
        };

        events = await db.event.findMany({
            where: { deleted: false, ...getCondition() },
            orderBy: [{ createdAt: "desc" }, { date: "desc" }],
        });

        return NextResponse.json(events);
    } catch (e) {
        return routeErrorHandler(e, req);
    }
};

import db from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

import { createBranchSchema } from "@/validation-schema/branch";
import { currentUserOrThrowAuthError } from "@/lib/auth";
import { routeErrorHandler } from "@/errors/route-error-handler";
import { Role } from "@prisma/client";

type TConditionSet = {
    roles: Role[];
    condition: {
        coopId?: number;
        id ?: number;
    };
};

export const GET = async (req: NextRequest) => {
    try {
        const currentUser = await currentUserOrThrowAuthError();

        const getCondition = (currentRole: Role) => {
            const conditionSet: TConditionSet[] = [
                { roles: [Role.root], condition: {} },
                { roles: [Role.coop_root], condition: { coopId: currentUser.coopId } },
                {
                    roles: [Role.admin, Role.staff],
                    condition: { id : currentUser.branchId },
                },
            ];

            const filteredCondition = conditionSet.find((condition) =>
                condition.roles.includes(currentRole),
            );

            return filteredCondition ? filteredCondition.condition : {};
        };

        const branch = await db.branch.findMany({
            where: { 
                deleted: false,
                ...getCondition(currentUser.role),
            },
            include: { coop: true },
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(branch);
    } catch (e) {
        return routeErrorHandler(e, req);
    }
};

export const POST = async (req: NextRequest) => {
    try {
        const { data } = await req.json();
        const user = await currentUserOrThrowAuthError();

        const validation = createBranchSchema.safeParse(data);
        if (!validation.success)
            return NextResponse.json(
                { message: validation.error.issues[0].message },
                { status: 400 },
            );

        const newBranch = await db.branch.create({
            data: { ...validation.data, createdBy: user.id },
        });
        return NextResponse.json(newBranch);
    } catch (e) {
        return routeErrorHandler(e, req);
    }
};

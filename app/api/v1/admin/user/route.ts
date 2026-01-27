import db from "@/lib/database";
import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { hashPassword } from "@/lib/server-utils";
import { currentUserOrThrowAuthError } from "@/lib/auth";
import { createUserSchema } from "@/validation-schema/user";
import { USER_SELECTS_WITH_NO_PASSWORD } from "@/services/user";
import { routeErrorHandler } from "@/errors/route-error-handler";

type TConditionSet = {
    roles: Role[];
    condition: {
        coopId?: number;
        branchId?: number;
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
                    condition: { branchId: currentUser.branchId },
                },
            ];

            const filteredCondition = conditionSet.find((condition) =>
                condition.roles.includes(currentRole),
            );

            return filteredCondition ? filteredCondition.condition : {};
        };

        const users = await db.user.findMany({
            where: { 
                deleted: false, 
                ...getCondition(currentUser.role)
            },
            orderBy: { createdAt: "desc" },
            select: USER_SELECTS_WITH_NO_PASSWORD,
        });
        return NextResponse.json(users);
    } catch (e) {
        return routeErrorHandler(e, req);
    }
};

export const POST = async (req: NextRequest) => {
    try {
        const user = await currentUserOrThrowAuthError();
        const { data } = await req.json();

        const validatedData = createUserSchema.parse(data);
        if (validatedData.password)
            validatedData.password = await hashPassword(validatedData.password);

        const branch = await db.branch.findUnique({
            where: { id: validatedData.branchId },
        });

        if (!branch)
            return NextResponse.json(
                { message: "Selected branch does not exist, try again" },
                { status: 404 },
            );

        const newUser = await db.user.create({
            data: { ...validatedData, createdBy: user.id, coopId: branch.coopId },
        });

        return NextResponse.json(newUser);
    } catch (e) {
        return routeErrorHandler(e, req);
    }
};

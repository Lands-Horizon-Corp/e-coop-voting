import db from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

import { hashPassword } from "@/lib/server-utils";
import { currentUserOrThrowAuthError } from "@/lib/auth";
import { updateUserSchema } from "@/validation-schema/user";
import { USER_SELECTS_WITH_NO_PASSWORD } from "@/services/user";
import { routeErrorHandler } from "@/errors/route-error-handler";

type TParams = { params: { id: number } };

export const GET = async (req: NextRequest, { params }: TParams) => {
    try {
        await currentUserOrThrowAuthError();
        const id = Number(params.id);

        if (!params.id && isNaN(Number(id)))
            return NextResponse.json(
                { message: "missing/invalid id on request" },
                { status: 400 }
            );

        const foundUser = await db.user.findUnique({
            where: { id },
            select: USER_SELECTS_WITH_NO_PASSWORD,
        });

        if (!foundUser)
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );

        return NextResponse.json(foundUser);
    } catch (e) {
        return routeErrorHandler(e, req);
    }
};

export const PATCH = async (req: NextRequest, { params }: TParams) => {
    try {
        const user = await currentUserOrThrowAuthError();
        const id = Number(params.id);
        const { data } = await req.json();

        if (!params.id && isNaN(Number(id)))
            return NextResponse.json(
                { message: "missing/invalid id on request" },
                { status: 400 }
            );

        const validatedData = updateUserSchema.parse(data);

        if (validatedData.password)
            validatedData.password = await hashPassword(validatedData.password);

        const updatedBranch = await db.user.update({
            where: { id },
            data: { ...validatedData, updatedBy: user.id },
        });

        return NextResponse.json(updatedBranch);
    } catch (e) {
        return routeErrorHandler(e, req);
    }
};

export const DELETE = async (req: NextRequest, { params }: TParams) => {
    try {
        const user = await currentUserOrThrowAuthError();
        const id = Number(params.id);

        if (!params.id && isNaN(Number(id)))
            return NextResponse.json(
                { message: "missing/invalid id on request" },
                { status: 400 }
            );

        const updatedBranch = await db.user.delete({
            where: { id },
            // data: { deleted: true, deletedAt: new Date(), deletedBy: user.id },
        });
        return NextResponse.json(updatedBranch);
    } catch (e) {
        return routeErrorHandler(e, req);
    }
};

import z from "zod";
import db from "@/lib/database";

import { emailSchema } from "@/validation-schema/auth";

export const USER_SELECTS_WITH_NO_PASSWORD = {
    id: true,
    name: true,
    picture : true,
    email: true,
    role: true,
    
    coopId : true,
    coop : true,
    branchId: true,
    branch: true,

    verified: true,
    dateVerified: true,

    createdAt: true,
    createdBy: true,
    deleted: true,
    deletedAt: true,
    deletedBy: true,
    updatedAt: true,
    updatedBy: true,
}

export const hasRoot = async () => {
    return db.user.findFirst({
        where: {
            role : "root",
            deleted : false
        },
    });
};

export const findUserByEmail = async (email: z.infer<typeof emailSchema>) => {
    return db.user.findUnique({ where: { email, deleted : false } });
};
    
export const getUserWithoutPassword = async (email : string) => {
    return db.user.findUnique({
        where: { email, deleted : false },
        select: USER_SELECTS_WITH_NO_PASSWORD,
    });
};

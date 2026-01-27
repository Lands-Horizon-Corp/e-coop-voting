import { Branch, Role, User } from "@prisma/client";
import { JWT } from "next-auth/jwt";
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface user {
        id: number;
        picture: string | null;
        name: string;
        email: string;
        branchId: number;
        coopId : number;
        verified: boolean | null;
        branch : Branch;
        role : Role;
        deleted: boolean;
    }

    interface Session extends DefaultSession {
        user: user;
    }

    declare module "next-auth/jwt" {
        interface JWT {
            user : user
        }
    }
}

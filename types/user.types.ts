import { TBranch, TCoop } from ".";
import { User } from "@prisma/client";

export type TUser = Omit<User, 'password'>

export type TUserWithBranch = TUser & { branch : TBranch }

export type TUserWCoop = TUser & { coop : TCoop }

export type TUserWBranchCoop = TUserWCoop & TUserWithBranch

export type TUserMinimalInfo = TUser | {
    id : number,
    picture : string | null,
    name : string,
    email : string,
}

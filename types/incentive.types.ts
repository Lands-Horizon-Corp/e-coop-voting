import { ClaimRequirements, Incentives } from "@prisma/client";
import { TUserMinimalInfo } from "./user.types";
import { TIncentiveAssigned } from "./incentive-assigned.types";

export type TIncentive = Incentives;

export type TIncentiveWithClaimAndAssignedCount = TIncentive & {
    _count: { claimed: number; assigned: number };
};

export type TUserWithAssignedIncentives = TUserMinimalInfo & {
    assignedIncentive: TIncentiveAssigned[];
};

// used in incentive incentive assignee table
export type TListOfAssigneesWithAssistCount = {
    eventId: number;
    id: number;
    _count: {
        claims: number;
    };
    incentive: {
        eventId: number;
        itemName: string;
    };
    user: TUserMinimalInfo;
    incentiveId: number;
    assignedQuantity: number;
};

export type TIncentiveMinimalInfo = {
    id: number;
    itemName: string;
}

export type TIncentiveMinimalInfo2 = {
    id: number;
    itemName: string;
    eventId : number;
    claimRequirement : ClaimRequirements;
}
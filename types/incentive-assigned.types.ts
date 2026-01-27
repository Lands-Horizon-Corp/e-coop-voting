import { TUserMinimalInfo } from "./user.types";
import { ClaimRequirements, IncentiveAssigned } from "@prisma/client";

export type TIncentiveAssigned = IncentiveAssigned;

export type TIncentiveAssignedMinimalInfo = {
      userId: true;
      incentiveId: true;
    }

export type TIncentiveAssignedWithUserMinimalInfo = TIncentiveAssigned & {
  user: TUserMinimalInfo;
};

export type TIncentiveAssignedToMe = {
  id: number;
  eventId: number;
  incentiveId: number;
  incentive: {
    id: number;
    eventId: number;
    itemName: string;
    claimRequirement: ClaimRequirements;
  };
};
